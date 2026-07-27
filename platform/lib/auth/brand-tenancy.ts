import "server-only";

import type { Session } from "next-auth";
import type { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/auth/session";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export type BrandContext = {
  session: Session;
  userId: string;
  role: UserRole;
  /** Active brand scope for this request — always set after requireBrandContext. */
  brandId: string;
};

/**
 * Resolve BrandManagerProfile.brandId for a user.
 * Returns null when the user has no active brand assignment.
 */
export async function resolveBrandIdForUser(userId: string): Promise<string | null> {
  const profile = await prisma.brandManagerProfile.findFirst({
    where: { userId, deletedAt: null },
    select: { brandId: true },
  });
  return profile?.brandId ?? null;
}

/**
 * Pure tenancy check — resource brand must match the caller's brand scope.
 */
export function assertBrandAccess(
  resourceBrandId: string | null | undefined,
  contextBrandId: string,
  message = "This resource does not belong to your brand",
): asserts resourceBrandId is string {
  if (!resourceBrandId || resourceBrandId !== contextBrandId) {
    throw new ForbiddenError(message);
  }
}

/**
 * Require an authenticated Brand Manager (or Super Admin with explicit brandId)
 * and return a locked brand scope for all subsequent mutations/queries.
 *
 * - BRAND_MANAGER: brandId always comes from BrandManagerProfile (cannot override).
 * - SUPER_ADMIN: must pass `brandId` explicitly (no ambient brand inheritance).
 */
export async function requireBrandContext(options: { brandId?: string } = {}): Promise<BrandContext> {
  const session = await requireRole(["BRAND_MANAGER", "SUPER_ADMIN"]);
  const userId = session.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  if (session.user.role === "BRAND_MANAGER") {
    const assignedBrandId = await resolveBrandIdForUser(userId);
    if (!assignedBrandId) {
      throw new ForbiddenError("No brand is assigned to this Brand Manager account");
    }
    if (options.brandId && options.brandId !== assignedBrandId) {
      throw new ForbiddenError("Brand Managers may only access their assigned brand");
    }
    return {
      session,
      userId,
      role: session.user.role,
      brandId: assignedBrandId,
    };
  }

  // SUPER_ADMIN — support tooling must name the brand explicitly
  if (!options.brandId) {
    throw new ForbiddenError(
      "Super Admin brand operations require an explicit brandId (no ambient brand scope)",
    );
  }

  const brand = await prisma.brand.findFirst({
    where: { id: options.brandId, deletedAt: null },
    select: { id: true },
  });
  if (!brand) {
    throw new ForbiddenError("Brand not found");
  }

  return {
    session,
    userId,
    role: session.user.role,
    brandId: brand.id,
  };
}

/**
 * Soft brand scope for read façades: Brand Managers get their assigned brand;
 * Super Admins without an explicit brandId get null (empty — never demo-as-tenant).
 */
export async function getOptionalBrandScope(options: { brandId?: string } = {}): Promise<{
  userId: string;
  role: UserRole;
  brandId: string | null;
} | null> {
  try {
    const session = await requireRole(["BRAND_MANAGER", "SUPER_ADMIN"]);
    const userId = session.user.id;
    if (!userId) return null;

    if (session.user.role === "BRAND_MANAGER") {
      const brandId = await resolveBrandIdForUser(userId);
      return { userId, role: session.user.role, brandId };
    }

    return {
      userId,
      role: session.user.role,
      brandId: options.brandId ?? null,
    };
  } catch {
    return null;
  }
}

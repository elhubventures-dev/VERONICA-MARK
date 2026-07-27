import "server-only";

import type { PermissionScope, UserRole } from "@prisma/client";
import type { Session } from "next-auth";

import { auth } from "@/lib/auth";
import { requirePermission as assertPermission } from "@/lib/auth/permissions";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export async function getCurrentSession(): Promise<Session | null> {
  return auth();
}

export async function requireAuth(): Promise<Session> {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  return session;
}

export async function requireRole(roles: UserRole[]): Promise<Session> {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    throw new ForbiddenError();
  }
  return session;
}

export async function requirePermission(
  resource: string,
  scope: PermissionScope,
): Promise<Session> {
  const session = await requireAuth();
  await assertPermission(session.user.id, resource, scope);
  return session;
}

export function getEffectiveRole(session: Session | null): UserRole | "GUEST" {
  return session?.user?.role ?? "GUEST";
}

export function isGuest(session: Session | null): boolean {
  return getEffectiveRole(session) === "GUEST";
}

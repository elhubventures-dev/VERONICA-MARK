/**
 * Pure brand-tenancy helpers (no server/prisma) for unit tests and shared checks.
 */

export function brandsMatch(
  resourceBrandId: string | null | undefined,
  contextBrandId: string,
): boolean {
  return Boolean(resourceBrandId) && resourceBrandId === contextBrandId;
}

export function orderBelongsToBrand(
  itemBrandIds: Array<string | null | undefined>,
  contextBrandId: string,
): boolean {
  return itemBrandIds.some((id) => id === contextBrandId);
}

/**
 * Brand Managers cannot choose another brandId; Super Admins must supply one.
 */
export function resolveEffectiveBrandId(input: {
  role: "BRAND_MANAGER" | "SUPER_ADMIN" | "CUSTOMER";
  assignedBrandId: string | null;
  requestedBrandId?: string | null;
}): { ok: true; brandId: string } | { ok: false; reason: string } {
  if (input.role === "BRAND_MANAGER") {
    if (!input.assignedBrandId) {
      return { ok: false, reason: "no_brand_assigned" };
    }
    if (input.requestedBrandId && input.requestedBrandId !== input.assignedBrandId) {
      return { ok: false, reason: "cross_brand_denied" };
    }
    return { ok: true, brandId: input.assignedBrandId };
  }

  if (input.role === "SUPER_ADMIN") {
    if (!input.requestedBrandId) {
      return { ok: false, reason: "brand_id_required" };
    }
    return { ok: true, brandId: input.requestedBrandId };
  }

  return { ok: false, reason: "role_denied" };
}

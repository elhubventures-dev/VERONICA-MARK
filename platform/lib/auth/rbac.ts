import { type UserRole } from "@prisma/client";

import { ROLE_HOME_PATHS } from "@/lib/auth/constants";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  BRAND_MANAGER: 2,
  SUPER_ADMIN: 3,
};

export type RouteAccessRule = {
  pattern: RegExp;
  roles: UserRole[];
  /** When true, authenticated users of any role may access */
  authenticatedOnly?: boolean;
};

export const protectedRoutes: RouteAccessRule[] = [
  {
    pattern: /^\/account(\/.*)?$/,
    roles: ["CUSTOMER", "BRAND_MANAGER", "SUPER_ADMIN"],
    authenticatedOnly: true,
  },
  {
    pattern: /^\/brand(\/.*)?$/,
    roles: ["BRAND_MANAGER"],
  },
  {
    pattern: /^\/admin(\/.*)?$/,
    roles: ["SUPER_ADMIN"],
  },
  {
    pattern: /^\/api\/admin(\/.*)?$/,
    roles: ["SUPER_ADMIN"],
  },
  {
    // Admin tooling may call brand APIs with an explicit brandId; UI stays BM-only.
    pattern: /^\/api\/brand(\/.*)?$/,
    roles: ["BRAND_MANAGER", "SUPER_ADMIN"],
  },
];

export const guestAllowedRoutes: RegExp[] = [
  /^\/$/,
  /^\/auth(\/.*)?$/,
  /^\/shop(\/.*)?$/,
  /^\/products?(\/.*)?$/,
  /^\/categories?(\/.*)?$/,
  /^\/collections?(\/.*)?$/,
  /^\/brands?(\/.*)?$/,
  /^\/search(\/.*)?$/,
  /^\/flash-sale(\/.*)?$/,
  /^\/cart(\/.*)?$/,
  /^\/checkout(\/.*)?$/,
  /^\/wishlist(\/.*)?$/,
  /^\/compare(\/.*)?$/,
  /^\/about(\/.*)?$/,
  /^\/contact(\/.*)?$/,
  /^\/faq(\/.*)?$/,
  /^\/privacy(\/.*)?$/,
  /^\/terms(\/.*)?$/,
  /^\/track-order(\/.*)?$/,
  /^\/invoices?(\/.*)?$/,
  /^\/api\/auth(\/.*)?$/,
  /^\/api\/health(\/.*)?$/,
];

export function matchRoute(pathname: string): RouteAccessRule | undefined {
  return protectedRoutes.find((route) => route.pattern.test(pathname));
}

export function hasRequiredRole(userRole: UserRole, allowed: UserRole[]): boolean {
  return allowed.includes(userRole);
}

export function hasMinimumRole(userRole: UserRole, minimum: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimum];
}

export function isBrandScopedRole(role: UserRole): boolean {
  return role === "BRAND_MANAGER";
}

export function getHomePathForRole(role: UserRole): string {
  return ROLE_HOME_PATHS[role];
}

/** Whether the role may open this pathname under `protectedRoutes` (public paths are allowed). */
export function canAccessPath(role: UserRole, pathname: string): boolean {
  const pathOnly = pathname.split("?")[0]?.split("#")[0] || pathname;
  const rule = matchRoute(pathOnly);
  if (!rule) return true;
  return hasRequiredRole(role, rule.roles);
}

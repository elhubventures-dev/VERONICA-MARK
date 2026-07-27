import type { UserRole } from "@prisma/client";

import { getHomePathForRole } from "@/lib/auth/rbac";

const AUTH_PATH_PREFIX = "/auth/";

/**
 * Turn a raw Auth.js callbackUrl into a same-origin relative path, or null if unsafe.
 * Rejects open redirects, protocol-relative URLs, and loops back into /auth/*.
 */
export function sanitizeCallbackPath(
  raw: string | null | undefined,
  origin?: string,
): string | null {
  if (!raw || typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
      if (trimmed === AUTH_PATH_PREFIX.slice(0, -1) || trimmed.startsWith(AUTH_PATH_PREFIX)) {
        return null;
      }
      return trimmed;
    }

    const url = new URL(trimmed);
    const expectedOrigin =
      origin ?? (typeof window !== "undefined" ? window.location.origin : undefined);
    if (expectedOrigin && url.origin !== expectedOrigin) {
      return null;
    }
    if (url.pathname === "/auth" || url.pathname.startsWith(AUTH_PATH_PREFIX)) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return null;
  }
}

/**
 * Resolve where to send the user after a successful sign-in / sign-up.
 * Explicit safe callbackUrls win; otherwise land on the role home dashboard.
 */
export function resolvePostAuthPath(options: {
  callbackUrl?: string | null;
  role?: UserRole | null;
  fallback?: string;
  origin?: string;
}): string {
  const fromCallback = sanitizeCallbackPath(options.callbackUrl, options.origin);
  if (fromCallback) return fromCallback;
  if (options.role) return getHomePathForRole(options.role);
  return options.fallback ?? "/account";
}

/** Full page navigation so the session cookie is always visible to middleware/RSC. */
export function navigateAfterAuth(path: string): void {
  const safe = sanitizeCallbackPath(path) ?? "/account";
  window.location.assign(safe);
}

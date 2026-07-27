import type { UserRole } from "@prisma/client";

export const AUTH_COOKIE_PREFIX = "vm";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
export const JWT_MAX_AGE = SESSION_MAX_AGE;
export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_VERIFY_TTL_MS = 60 * 60 * 1_000;
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1_000;

export const AUTH_RATE_LIMITS = {
  signIn: { limit: 10, windowMs: 15 * 60 * 1_000 },
  register: { limit: 5, windowMs: 15 * 60 * 1_000 },
  forgotPassword: { limit: 5, windowMs: 15 * 60 * 1_000 },
  resetPassword: { limit: 10, windowMs: 15 * 60 * 1_000 },
} as const;

export type AuthRateLimitAction = keyof typeof AUTH_RATE_LIMITS;

export const PUBLIC_AUTH_PATHS = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
] as const;

export const ROLE_HOME_PATHS: Record<UserRole, string> = {
  CUSTOMER: "/account",
  BRAND_MANAGER: "/brand",
  SUPER_ADMIN: "/admin",
};

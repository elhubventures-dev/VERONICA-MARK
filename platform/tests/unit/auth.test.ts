import { describe, expect, it } from "vitest";

import {
  getHomePathForRole,
  hasMinimumRole,
  hasRequiredRole,
  matchRoute,
} from "@/lib/auth/rbac";
import { passwordSchema } from "@/lib/auth/password-policy";
import { createCsrfToken, validateCsrfToken } from "@/lib/auth/csrf";
import { ensureGuestId } from "@/lib/auth/guest";

describe("rbac", () => {
  it("protects admin and brand routes", () => {
    expect(matchRoute("/admin/orders")?.roles).toEqual(["SUPER_ADMIN"]);
    expect(matchRoute("/brand/products")?.roles).toEqual(["BRAND_MANAGER", "SUPER_ADMIN"]);
    expect(matchRoute("/account")?.roles).toContain("CUSTOMER");
  });

  it("enforces role checks and hierarchy", () => {
    expect(hasRequiredRole("CUSTOMER", ["SUPER_ADMIN"])).toBe(false);
    expect(hasMinimumRole("SUPER_ADMIN", "BRAND_MANAGER")).toBe(true);
    expect(getHomePathForRole("BRAND_MANAGER")).toBe("/brand");
  });
});

describe("password policy", () => {
  it("rejects weak passwords", () => {
    expect(passwordSchema.safeParse("short").success).toBe(false);
    expect(passwordSchema.safeParse("alllowercase1").success).toBe(false);
    expect(passwordSchema.safeParse("ChangeMeNow!1").success).toBe(true);
  });
});

describe("csrf", () => {
  it("accepts matching cookie and form tokens", async () => {
    const token = createCsrfToken();
    await expect(validateCsrfToken(token, token)).resolves.toBe(true);
    await expect(validateCsrfToken(token, "deadbeef")).resolves.toBe(false);
  });
});

describe("guest session", () => {
  it("creates a guest id when cookie missing", () => {
    const result = ensureGuestId({ get: () => undefined });
    expect(result.isNew).toBe(true);
    expect(result.guestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});

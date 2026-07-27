import { describe, expect, it } from "vitest";

import {
  brandsMatch,
  orderBelongsToBrand,
  resolveEffectiveBrandId,
} from "@/lib/auth/brand-tenancy-rules";

describe("brand tenancy rules", () => {
  it("matches resource brand to context brand", () => {
    expect(brandsMatch("brand-a", "brand-a")).toBe(true);
    expect(brandsMatch("brand-b", "brand-a")).toBe(false);
    expect(brandsMatch(null, "brand-a")).toBe(false);
  });

  it("detects brand participation on multi-brand orders", () => {
    expect(orderBelongsToBrand(["brand-a", "brand-b"], "brand-a")).toBe(true);
    expect(orderBelongsToBrand(["brand-b"], "brand-a")).toBe(false);
    expect(orderBelongsToBrand([null, undefined], "brand-a")).toBe(false);
  });

  it("locks Brand Managers to their assigned brand", () => {
    expect(
      resolveEffectiveBrandId({
        role: "BRAND_MANAGER",
        assignedBrandId: "brand-a",
        requestedBrandId: "brand-b",
      }),
    ).toEqual({ ok: false, reason: "cross_brand_denied" });

    expect(
      resolveEffectiveBrandId({
        role: "BRAND_MANAGER",
        assignedBrandId: "brand-a",
      }),
    ).toEqual({ ok: true, brandId: "brand-a" });

    expect(
      resolveEffectiveBrandId({
        role: "BRAND_MANAGER",
        assignedBrandId: null,
      }),
    ).toEqual({ ok: false, reason: "no_brand_assigned" });
  });

  it("requires Super Admin to pass an explicit brandId", () => {
    expect(
      resolveEffectiveBrandId({
        role: "SUPER_ADMIN",
        assignedBrandId: null,
      }),
    ).toEqual({ ok: false, reason: "brand_id_required" });

    expect(
      resolveEffectiveBrandId({
        role: "SUPER_ADMIN",
        assignedBrandId: null,
        requestedBrandId: "brand-z",
      }),
    ).toEqual({ ok: true, brandId: "brand-z" });
  });

  it("denies customer role brand scope", () => {
    expect(
      resolveEffectiveBrandId({
        role: "CUSTOMER",
        assignedBrandId: "brand-a",
      }),
    ).toEqual({ ok: false, reason: "role_denied" });
  });
});

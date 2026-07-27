import { describe, expect, it } from "vitest";

import { hasMinimumRole, hasRequiredRole, matchRoute } from "@/lib/auth/rbac";
import { cn } from "@/lib/utils";
import { paginationSchema, toSkipTake } from "@/lib/validations/common";
import { AppError, toErrorResponse } from "@/lib/errors";

describe("rbac", () => {
  it("matches protected admin routes", () => {
    const rule = matchRoute("/admin/orders");
    expect(rule?.roles).toEqual(["SUPER_ADMIN"]);
  });

  it("allows brand managers on brand routes", () => {
    expect(hasRequiredRole("BRAND_MANAGER", ["BRAND_MANAGER", "SUPER_ADMIN"])).toBe(true);
    expect(hasRequiredRole("CUSTOMER", ["BRAND_MANAGER", "SUPER_ADMIN"])).toBe(false);
  });

  it("compares role hierarchy", () => {
    expect(hasMinimumRole("SUPER_ADMIN", "BRAND_MANAGER")).toBe(true);
    expect(hasMinimumRole("CUSTOMER", "BRAND_MANAGER")).toBe(false);
  });
});

describe("utils", () => {
  it("merges class names", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });
});

describe("validation", () => {
  it("converts pagination to skip/take", () => {
    const pagination = paginationSchema.parse({ page: 3, pageSize: 25 });
    expect(toSkipTake(pagination)).toEqual({ skip: 50, take: 25 });
  });
});

describe("errors", () => {
  it("maps AppError to response payload", () => {
    const response = toErrorResponse(new AppError("Nope", { code: "NOPE", statusCode: 418 }));
    expect(response.statusCode).toBe(418);
    expect(response.body.error.code).toBe("NOPE");
  });
});

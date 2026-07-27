import { describe, expect, it, vi } from "vitest";

import { assertSeedAllowed, resolveSeedPassword } from "@/lib/db/seed-guard";

describe("seed guards", () => {
  it("blocks Vercel production", () => {
    expect(() => assertSeedAllowed({ VERCEL_ENV: "production", NODE_ENV: "production" })).toThrow(
      /Vercel production/,
    );
  });

  it("blocks NODE_ENV=production outside preview", () => {
    expect(() => assertSeedAllowed({ NODE_ENV: "production" })).toThrow(/NODE_ENV=production/);
  });

  it("allows preview and development", () => {
    expect(() =>
      assertSeedAllowed({ NODE_ENV: "production", VERCEL_ENV: "preview" }),
    ).not.toThrow();
    expect(() => assertSeedAllowed({ NODE_ENV: "development" })).not.toThrow();
  });

  it("requires SEED_DEFAULT_PASSWORD outside local development", () => {
    expect(() => resolveSeedPassword({ NODE_ENV: "production", VERCEL_ENV: "preview" })).toThrow(
      /SEED_DEFAULT_PASSWORD/,
    );
  });

  it("accepts explicit SEED_DEFAULT_PASSWORD", () => {
    expect(
      resolveSeedPassword({
        NODE_ENV: "production",
        VERCEL_ENV: "preview",
        SEED_DEFAULT_PASSWORD: "StagingOnly!Pass1",
      }),
    ).toBe("StagingOnly!Pass1");
  });

  it("falls back in development with a warning", () => {
    const warn = vi.fn();
    expect(resolveSeedPassword({ NODE_ENV: "development" }, warn)).toBe("ChangeMeNow!1");
    expect(warn).toHaveBeenCalled();
  });
});

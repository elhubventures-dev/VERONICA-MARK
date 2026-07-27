import { FeatureFlagEnvironment } from "@prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { isFeatureEnabled, resolveFeatureFlagEnvironment } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    featureFlag: {
      findUnique: vi.fn(),
    },
  },
}));

describe("feature flags", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("maps Vercel production to PRODUCTION", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(resolveFeatureFlagEnvironment()).toBe(FeatureFlagEnvironment.PRODUCTION);
  });

  it("maps Vercel preview to STAGING", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(resolveFeatureFlagEnvironment()).toBe(FeatureFlagEnvironment.STAGING);
  });

  it("defaults to DEVELOPMENT when VERCEL_ENV is unset", () => {
    vi.stubEnv("VERCEL_ENV", "");
    expect(resolveFeatureFlagEnvironment()).toBe(FeatureFlagEnvironment.DEVELOPMENT);
  });

  it("returns true when the flag is enabled", async () => {
    vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue({
      enabled: true,
      deletedAt: null,
    } as never);

    await expect(isFeatureEnabled("storefront.pwa")).resolves.toBe(true);
    expect(prisma.featureFlag.findUnique).toHaveBeenCalledWith({
      where: {
        key_environment: {
          key: "storefront.pwa",
          environment: FeatureFlagEnvironment.DEVELOPMENT,
        },
      },
      select: { enabled: true, deletedAt: true },
    });
  });

  it("returns false when the flag is missing or soft-deleted", async () => {
    vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue(null);
    await expect(isFeatureEnabled("storefront.pwa")).resolves.toBe(false);

    vi.mocked(prisma.featureFlag.findUnique).mockResolvedValue({
      enabled: true,
      deletedAt: new Date(),
    } as never);
    await expect(isFeatureEnabled("storefront.pwa")).resolves.toBe(false);
  });

  it("returns false when the database lookup fails", async () => {
    vi.mocked(prisma.featureFlag.findUnique).mockRejectedValue(new Error("db down"));
    await expect(isFeatureEnabled("storefront.pwa")).resolves.toBe(false);
  });
});

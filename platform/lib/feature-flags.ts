import { FeatureFlagEnvironment } from "@prisma/client";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

/**
 * Maps deployment context to the Prisma FeatureFlag environment.
 * - Vercel production → PRODUCTION
 * - Vercel preview → STAGING
 * - Local / test → DEVELOPMENT
 */
export function resolveFeatureFlagEnvironment(): FeatureFlagEnvironment {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === "production") {
    return FeatureFlagEnvironment.PRODUCTION;
  }

  if (vercelEnv === "preview") {
    return FeatureFlagEnvironment.STAGING;
  }

  return FeatureFlagEnvironment.DEVELOPMENT;
}

/**
 * Returns whether a feature flag is enabled for the current deployment environment.
 * Missing rows and DB errors default to `false` (safe off).
 */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  const environment = resolveFeatureFlagEnvironment();

  try {
    const flag = await prisma.featureFlag.findUnique({
      where: {
        key_environment: {
          key,
          environment,
        },
      },
      select: { enabled: true, deletedAt: true },
    });

    if (!flag || flag.deletedAt) {
      return false;
    }

    return flag.enabled;
  } catch (error) {
    logger.warn({ key, environment, err: error }, "feature_flag.lookup_failed");
    return false;
  }
}

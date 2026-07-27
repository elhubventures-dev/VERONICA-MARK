"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAction } from "@/lib/actions/create-action";
import { resolveFeatureFlagEnvironment } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";

const setFeatureFlagEnabledSchema = z.object({
  key: z.string().min(1).max(120),
  enabled: z.boolean(),
});

export const setFeatureFlagEnabledAction = createAction(
  "admin.feature_flags.set_enabled",
  {
    schema: setFeatureFlagEnabledSchema,
    roles: ["SUPER_ADMIN"],
  },
  async (input) => {
    const environment = resolveFeatureFlagEnvironment();

    const flag = await prisma.featureFlag.upsert({
      where: {
        key_environment: {
          key: input.key,
          environment,
        },
      },
      update: {
        enabled: input.enabled,
        deletedAt: null,
      },
      create: {
        key: input.key,
        environment,
        enabled: input.enabled,
        description: null,
        rollout: input.enabled ? 100 : 0,
      },
      select: {
        key: true,
        enabled: true,
        environment: true,
      },
    });

    revalidatePath("/admin/feature-flags");

    return {
      key: flag.key,
      enabled: flag.enabled,
      environment: flag.environment,
    };
  },
);

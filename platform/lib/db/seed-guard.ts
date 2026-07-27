/**
 * Guards for `prisma/seed.ts` — kept separate so unit tests can import without Prisma.
 */

export function assertSeedAllowed(env: NodeJS.ProcessEnv = process.env): void {
  const vercelEnv = env.VERCEL_ENV;
  const nodeEnv = env.NODE_ENV;

  if (vercelEnv === "production") {
    throw new Error(
      "Refusing to run db:seed on Vercel production. Provision users via admin tooling or a controlled migration instead.",
    );
  }

  if (nodeEnv === "production" && vercelEnv !== "preview") {
    throw new Error(
      "Refusing to run db:seed when NODE_ENV=production. Use a non-production database, or set VERCEL_ENV=preview for preview deploys only.",
    );
  }
}

/**
 * Shared/staging seeds must set SEED_DEFAULT_PASSWORD.
 * Local development may omit it and falls back to a known demo password (never use in shared envs).
 */
export function resolveSeedPassword(
  env: NodeJS.ProcessEnv = process.env,
  warn: (message: string) => void = console.warn,
): string {
  const fromEnv = env.SEED_DEFAULT_PASSWORD?.trim();
  if (fromEnv) {
    if (fromEnv.length < 12) {
      throw new Error("SEED_DEFAULT_PASSWORD must be at least 12 characters.");
    }
    return fromEnv;
  }

  if (env.NODE_ENV === "test") {
    return "ChangeMeNow!1";
  }

  if (!env.NODE_ENV || env.NODE_ENV === "development") {
    warn(
      "[seed] SEED_DEFAULT_PASSWORD unset — using local demo password. Set SEED_DEFAULT_PASSWORD before any shared/staging seed.",
    );
    return "ChangeMeNow!1";
  }

  throw new Error(
    "SEED_DEFAULT_PASSWORD is required outside local development. Generate a strong secret and rotate after seeding.",
  );
}

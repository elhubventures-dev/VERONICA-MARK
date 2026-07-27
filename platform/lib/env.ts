import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined || value === null ? undefined : value;

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_UNPOOLED: optionalString,
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_URL: z.string().url().optional(),
  AUTH_TRUST_HOST: z
    .preprocess((value) => value === "true" || value === true, z.boolean())
    .optional(),
  AUTH_GOOGLE_ID: optionalString,
  AUTH_GOOGLE_SECRET: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  SUPABASE_STORAGE_BUCKET: z.string().default("veronica-mark-media"),
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
  PAYSTACK_SECRET_KEY: optionalString,
  SQUADCO_SECRET_KEY: optionalString,
  USD_NGN_RATE: z.preprocess(emptyToUndefined, z.coerce.number().positive().optional()),
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  SENTRY_DSN: optionalUrl,
  SENTRY_ENVIRONMENT: optionalString,
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("VERONICA MARK"),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  PAYSTACK_PUBLIC_KEY: optionalString,
  SQUADCO_PUBLIC_KEY: optionalString,
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
}

const shouldSkipStrictValidation =
  process.env.SKIP_ENV_VALIDATION === "true" ||
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NODE_ENV === "test";

function createServerEnv(): ServerEnv {
  if (shouldSkipStrictValidation) {
    return {
      NODE_ENV: (process.env.NODE_ENV as ServerEnv["NODE_ENV"]) ?? "development",
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://placeholder:placeholder@localhost:5432/veronica_mark",
      DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
      AUTH_SECRET: process.env.AUTH_SECRET ?? "development-secret-must-be-32-chars-min",
      AUTH_URL: process.env.AUTH_URL,
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST === "true",
      AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
      AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET ?? "veronica-mark-media",
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
      SQUADCO_SECRET_KEY: process.env.SQUADCO_SECRET_KEY,
      USD_NGN_RATE: process.env.USD_NGN_RATE ? Number(process.env.USD_NGN_RATE) : undefined,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      EMAIL_FROM: process.env.EMAIL_FROM,
      LOG_LEVEL: (process.env.LOG_LEVEL as ServerEnv["LOG_LEVEL"]) ?? "info",
      SENTRY_DSN: process.env.SENTRY_DSN,
      SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    };
  }

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment variables:\n${formatZodError(parsed.error)}`);
  }
  return parsed.data;
}

function createClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    SQUADCO_PUBLIC_KEY: process.env.SQUADCO_PUBLIC_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });

  if (!parsed.success) {
    throw new Error(`Invalid client environment variables:\n${formatZodError(parsed.error)}`);
  }
  return parsed.data;
}

let cachedServerEnv: ServerEnv | undefined;
let cachedClientEnv: ClientEnv | undefined;

export const env = {
  get server(): ServerEnv {
    cachedServerEnv ??= createServerEnv();
    return cachedServerEnv;
  },
  get client(): ClientEnv {
    cachedClientEnv ??= createClientEnv();
    return cachedClientEnv;
  },
};

export function getPublicEnv(): ClientEnv {
  return env.client;
}

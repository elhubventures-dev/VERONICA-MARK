import pino from "pino";

import { env } from "@/lib/env";

const isDevelopment = env.server.NODE_ENV === "development";

export const logger = pino({
  level: env.server.LOG_LEVEL,
  base: {
    service: "veronica-mark-platform",
    env: env.server.NODE_ENV,
  },
  redact: {
    paths: [
      "password",
      "passwordHash",
      "token",
      "authorization",
      "cookie",
      "AUTH_SECRET",
      "SUPABASE_SERVICE_ROLE_KEY",
      "PAYSTACK_SECRET_KEY",
      "SQUADCO_SECRET_KEY",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_ACCOUNT_SID",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    remove: true,
  },
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

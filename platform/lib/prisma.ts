import "server-only";

import { PrismaClient } from "@prisma/client";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log:
      env.server.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ]
        : [{ emit: "stdout", level: "error" }],
  });

  if (env.server.NODE_ENV === "development") {
    client.$on(
      "query" as never,
      ((event: { query: string; duration: number }) => {
        logger.debug({ query: event.query, durationMs: event.duration }, "prisma.query");
      }) as never,
    );
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.server.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

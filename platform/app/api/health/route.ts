import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { captureException } from "@/lib/observability/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const payload = {
      status: "ok" as const,
      service: "veronica-mark-platform",
      version: "1.0.0",
      environment: env.server.NODE_ENV,
      checks: {
        database: "up",
      },
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
    };

    logger.info(payload, "health.ok");
    return NextResponse.json(payload);
  } catch (error) {
    captureException(error, { route: "/api/health" });

    return NextResponse.json(
      {
        status: "degraded",
        service: "veronica-mark-platform",
        version: "1.0.0",
        environment: env.server.NODE_ENV,
        checks: {
          database: "down",
        },
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}

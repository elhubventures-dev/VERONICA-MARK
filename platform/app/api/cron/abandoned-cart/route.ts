import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { processAbandonedCartReminders } from "@/lib/marketing/abandoned-cart";
import { logger } from "@/lib/logger";
import { captureException } from "@/lib/observability/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    // Allow in development without secret for local manual runs.
    return process.env.NODE_ENV === "development";
  }

  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const querySecret = new URL(request.url).searchParams.get("secret");
  const provided = bearer ?? querySecret;
  if (!provided) return false;

  const expected = Buffer.from(secret);
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

async function run(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processAbandonedCartReminders();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    captureException(error, { route: "/api/cron/abandoned-cart" });
    logger.error({ err: error }, "abandoned_cart.cron_failed");
    return NextResponse.json({ ok: false, error: "Worker failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

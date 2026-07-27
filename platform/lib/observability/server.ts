import { logger } from "@/lib/logger";

type ObservabilityContext = Record<string, unknown>;

/**
 * Server-side exception capture.
 * When SENTRY_DSN is configured, wire @sentry/nextjs here without changing call sites.
 */
export function captureException(error: unknown, context: ObservabilityContext = {}) {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error({ err, ...context }, err.message);

  if (process.env.SENTRY_DSN) {
    // Optional integration point for Sentry Node SDK.
    console.error("[observability]", err.message, context);
  }

  return err;
}

export function captureMessage(message: string, context: ObservabilityContext = {}) {
  logger.info({ ...context }, message);
}

export function startSpan<T>(name: string, fn: () => T): T {
  const started = Date.now();
  try {
    return fn();
  } finally {
    logger.debug({ span: name, durationMs: Date.now() - started }, "span.complete");
  }
}

export async function startSpanAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const started = Date.now();
  try {
    return await fn();
  } finally {
    logger.debug({ span: name, durationMs: Date.now() - started }, "span.complete");
  }
}

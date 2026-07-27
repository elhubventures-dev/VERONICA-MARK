/**
 * Client-side exception capture for error boundaries.
 * Always logs locally; forwards to Sentry when a DSN is configured.
 */
export function captureClientException(
  error: Error,
  context: Record<string, unknown> = {},
) {
  console.error("[client-error]", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...context,
  });

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN && !process.env.SENTRY_DSN) {
    return;
  }

  void import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.captureException(error, { extra: context });
    })
    .catch(() => {
      // SDK unavailable — console log above is enough.
    });
}

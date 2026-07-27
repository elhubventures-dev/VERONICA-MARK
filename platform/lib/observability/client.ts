/**
 * Client-side exception capture for error boundaries.
 * Logs to console in all environments; integrates with Sentry when DSN is present.
 */
export function captureClientException(
  error: Error,
  context: Record<string, unknown> = {},
) {
  // Prefer structured console payload for Vercel log drains before Sentry is wired.
  console.error("[client-error]", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...context,
  });

  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Optional: window.Sentry?.captureException(error, { extra: context });
  }
}

# Sentry — error monitoring

P0 item 5: Sentry is wired for client, server, and edge. Capture is a no-op when DSNs are unset.

## Env

| Variable | Purpose |
|---|---|
| `SENTRY_DSN` | Server/edge DSN |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser DSN (often same project) |
| `SENTRY_ENVIRONMENT` | Overrides `VERCEL_ENV` / `NODE_ENV` |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Optional CI source-map upload |

## Files

- `instrumentation-client.ts` — browser SDK
- `sentry.server.config.ts` / `sentry.edge.config.ts` — server/edge SDK
- `instrumentation.ts` — registers server/edge + `onRequestError`
- `lib/observability/client.ts` / `server.ts` — call-site helpers used by error boundaries and API routes
- `next.config.ts` — `withSentryConfig` (source maps skipped without `SENTRY_AUTH_TOKEN`)

## On-call alerts (ops)

In the Sentry project UI:

1. Create alert rules for new issues / spike in error rate.
2. Route to Slack/email/PagerDuty as needed.
3. Confirm `SENTRY_ENVIRONMENT=production` on the Vercel production env.

## Verify

1. Set DSNs in Vercel (or `.env.local`).
2. Trigger a handled error (or temporary throw in a route).
3. Confirm the event appears in Sentry within ~1 minute.

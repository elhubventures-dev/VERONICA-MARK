# VERONICA MARK — Production Operations Guide (v1.0)

**Stage:** 10 — Production readiness  
**Release:** 1.0.0  
**Stack:** Next.js 15 · Neon PostgreSQL · Supabase Storage · Vercel · Auth.js · Upstash Redis

## 1. Deployment (Vercel)

### Project settings
| Setting | Value |
| --- | --- |
| Root Directory | `platform` |
| Node | 20.x |
| Install | `pnpm install` |
| Build | `pnpm exec prisma generate && pnpm exec prisma migrate deploy && pnpm build` |
| Output | `.next` |

### Required environment variables
| Variable | Provider | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Neon pooled | Runtime Prisma |
| `DATABASE_URL_UNPOOLED` | Neon direct | Migrations |
| `AUTH_SECRET` | Generated | ≥32 chars |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | Production origin | HTTPS |
| `AUTH_TRUST_HOST` | `true` on Vercel | |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Server uploads |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | Upstash | Rate limits |

Optional: Google OAuth, Paystack/SquadCo keys, `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` (see [SENTRY.md](./SENTRY.md)), `CRON_SECRET`, `SEED_DEFAULT_PASSWORD` (non-prod only).

### Post-deploy smoke
1. `GET /api/health` → `{ status: "ok" }`
2. `/robots.txt` and `/sitemap.xml` return 200
3. Storefront home + `/shop` render
4. `/account` redirects unauthenticated users to sign-in
5. Never run `pnpm db:seed` against production (blocked in seed guard). Rotate any staging seed passwords immediately.

## 2. Neon PostgreSQL

- Use **pooled** URL for the app, **unpooled** for `prisma migrate deploy`.
- Enable **Point-in-Time Recovery (PITR)** on the production branch.
- Prefer branch-per-preview for dangerous schema work.
- Seed only non-production environments (`pnpm db:seed`).

See [BACKUP_AND_DR.md](./BACKUP_AND_DR.md).

## 3. Supabase Storage

- Bucket: `veronica-mark-media` (private or authenticated policies as required).
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Confirm `next.config.ts` `images.remotePatterns` includes your project hostname.

## 4. Performance targets

Target: **Lighthouse ≥ 95** (Performance, Accessibility, Best Practices, SEO) on homepage and PDP in mobile + desktop.

Checklist: [PERFORMANCE_AND_LIGHTHOUSE.md](./PERFORMANCE_AND_LIGHTHOUSE.md)

Implemented in v1.0:
- AVIF/WebP image formats + long cache TTL
- Static asset `Cache-Control: immutable`
- `optimizePackageImports` for lucide/recharts/framer-motion/date-fns
- Error/not-found boundaries (no white-screen failures)
- SEO robots/sitemap/JSON-LD helpers

## 5. Accessibility (WCAG 2.1 AA)

- Focus rings, skip links, 44px targets, reduced-motion support
- Documented in `docs/design-system/ACCESSIBILITY.md`
- Playwright smoke asserts skip link presence
- Storybook a11y addon available (`pnpm storybook`)

## 6. Security

See [SECURITY_AUDIT_STAGE10.md](./SECURITY_AUDIT_STAGE10.md) and [PENETRATION_TEST_PLAN.md](./PENETRATION_TEST_PLAN.md).

## 7. Observability

- **Logging:** Pino JSON to stdout (Vercel log drains)
- **Health:** `/api/health` (DB probe)
- **Error boundaries:** `app/error.tsx`, `app/global-error.tsx` → `captureClientException`
- **Server capture:** `lib/observability/server.ts` (Sentry SDK; see [SENTRY.md](./SENTRY.md))
- **Client capture:** `lib/observability/client.ts` + error boundaries
- Wire `@sentry/nextjs` when DSNs are provisioned (env already accepted)

## 8. Testing & CI/CD

| Gate | Command / workflow |
| --- | --- |
| Unit | `pnpm test` |
| Integration-oriented helpers | `tests/unit/production.test.ts` |
| E2E smoke | `pnpm test:e2e` |
| Dependency audit | `pnpm audit:deps` |
| Full local release check | `pnpm release:check` |
| CI | `.github/workflows/ci.yml` (migrate deploy + e2e job) |
| CD checklist | `.github/workflows/cd.yml` |

## 9. Related docs

- [RELEASE_NOTES_v1.0.md](./RELEASE_NOTES_v1.0.md)
- [PROJECT_REVIEW.md](./PROJECT_REVIEW.md)
- [REMAINING_IMPROVEMENTS.md](./REMAINING_IMPROVEMENTS.md)
- [BACKUP_AND_DR.md](./BACKUP_AND_DR.md)

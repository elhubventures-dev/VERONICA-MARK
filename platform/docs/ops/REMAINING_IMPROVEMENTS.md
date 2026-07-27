# Remaining Improvements (post-v1.0)

Prioritized backlog after Stage 10 / Version 1.0 release.

## P0 — Before wide public traffic
1. ~~Wire live Paystack charge + webhook verification~~ **Done (Paystack only; SquadCo deferred).** See [PAYMENTS_PAYSTACK.md](./PAYMENTS_PAYSTACK.md).
2. ~~Replace demo façades with Prisma repositories across account/brand/admin/marketing queries~~ **Done (Prisma-first + demo fallback).** See [DEMO_TO_PRISMA.md](./DEMO_TO_PRISMA.md).
3. ~~Enforce brand tenancy (`BrandManagerProfile.brandId`) on every brand mutation~~ **Done.** See [BRAND_TENANCY.md](./BRAND_TENANCY.md).
4. Complete authorized penetration test and remediate High/Critical findings. **Ops checklist:** [PENETRATION_TEST_CHECKLIST.md](./PENETRATION_TEST_CHECKLIST.md) (engineering prep only — external engagement required).
5. ~~Enable Sentry (or equivalent) with on-call alerts; remove console-only client capture.~~ **Done (SDK wired).** Configure DSN + alert routing in Sentry UI. See [SENTRY.md](./SENTRY.md).
6. ~~Rotate/remove seed credentials from any shared environment; disable `db:seed` in production.~~ **Done.** Seed blocked in production; `SEED_DEFAULT_PASSWORD` required outside local dev.
7. ~~Resolve `pnpm audit` High/Critical (Auth.js stable upgrade; Next/postcss patch train).~~ **Auth.js Critical/High cleared** (`next-auth@5.0.0-beta.32`). **brace-expansion** pinned to `5.0.8`. **Residual High:** `postcss` / `sharp` still pulled by `next@15.5.21` — track Next patch train; do not force-break image pipeline. Re-run `pnpm audit:deps` after each Next upgrade.

## P1 — Launch polish
7. ~~Achieve measured Lighthouse ≥95 on home + PDP (optimize LCP hero to `next/image` priority).~~ **Shipped LCP fixes** (hero text no longer opacity-hidden; priority/`fetchPriority`/quality tuning; lazy below-fold banners). Re-measure on production build to confirm ≥95.
8. ~~Add axe-core assertions to Playwright critical flows (checkout, account nav).~~ **Done.** See `tests/e2e/a11y.spec.ts`.
9. ~~Real OG default image asset + Twitter cards on all marketing pages.~~ **Done** (`public/brand/og-default.webp` + `buildPageMetadata`).
10. ~~Sitemap `lastModified` from DB timestamps.~~ **Done.** See `app/sitemap.ts`.
11. ~~Abandoned-cart automation workers (email/push) on a queue/cron.~~ **Done (email via daily cron on Hobby; Pro unlocks hourly).** See [ABANDONED_CART.md](./ABANDONED_CART.md). Push deferred.
12. Affiliate Prisma models + payout ledger if partner program is confirmed.

## P2 — Scale & ops
13. Coverage thresholds in CI (`vitest --coverage` fail under X%).
14. OpenTelemetry traces alongside Pino.
15. Read replicas / reporting warehouse for admin analytics.
16. Nonce-based CSP when Next tooling allows removing `'unsafe-inline'`.
17. Bulk CSV import for Brand Manager (SRS).
18. Multi-language storefront content (Localization already admin-ready).

## P3 — Product expansion
19. Support tickets console.
20. Taxes admin module (schema exists).
21. ~~PWA install + offline shell (`storefront.pwa` feature flag).~~ **Done.** See [PWA.md](./PWA.md).
22. Image search / barcode scanner (SRS stretch).

## Tracking
Update this file when items ship. Link PRs to item numbers in commit messages where practical.

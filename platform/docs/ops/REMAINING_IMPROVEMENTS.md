# Remaining Improvements (post-v1.0)

Prioritized backlog after Stage 10 / Version 1.0 release.

## P0 — Before wide public traffic
1. ~~Wire live Paystack charge + webhook verification~~ **Done (Paystack only; SquadCo deferred).** See [PAYMENTS_PAYSTACK.md](./PAYMENTS_PAYSTACK.md).
2. ~~Replace demo façades with Prisma repositories across account/brand/admin/marketing queries~~ **Done (Prisma-first + demo fallback).** See [DEMO_TO_PRISMA.md](./DEMO_TO_PRISMA.md).
3. ~~Enforce brand tenancy (`BrandManagerProfile.brandId`) on every brand mutation~~ **Done.** See [BRAND_TENANCY.md](./BRAND_TENANCY.md).
4. Complete authorized penetration test and remediate High/Critical findings.
5. Enable Sentry (or equivalent) with on-call alerts; remove console-only client capture.
6. Rotate/remove seed credentials from any shared environment; disable `db:seed` in production.
7. Resolve `pnpm audit` High/Critical (Auth.js stable upgrade; Next/postcss patch train).

## P1 — Launch polish
7. Achieve measured Lighthouse ≥95 on home + PDP (optimize LCP hero to `next/image` priority).
8. Add axe-core assertions to Playwright critical flows (checkout, account nav).
9. Real OG default image asset + Twitter cards on all marketing pages.
10. Sitemap `lastModified` from DB timestamps.
11. Abandoned-cart automation workers (email/push) on a queue/cron.
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
21. PWA install + offline shell (`storefront.pwa` feature flag).
22. Image search / barcode scanner (SRS stretch).

## Tracking
Update this file when items ship. Link PRs to item numbers in commit messages where practical.

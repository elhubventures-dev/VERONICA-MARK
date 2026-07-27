# Stage 10 Security Audit

**Date:** 2026-07-24  
**Scope:** Production readiness for VERONICA MARK v1.0  
**Companion:** Stage 4 `docs/auth/SECURITY_AUDIT.md`

## Summary
| Area | Status |
| --- | --- |
| Transport security | HSTS + HTTPS via Vercel |
| Security headers | CSP, frame options, nosniff, referrer, permissions-policy |
| Auth | Auth.js credentials + Google; CSRF cookie; rate limits (Upstash) |
| RBAC | Middleware route maps for `/account`, `/brand`, `/admin` |
| Secrets | Zod env schema; `.env.example` without secrets |
| Logging | Pino redaction of sensitive fields |
| Dependency audit | `pnpm audit:deps` in CI (high+ prod, non-blocking alert) |

## Findings & dispositions

### Fixed / hardened in Stage 10
1. Added HSTS header.
2. Extended CSP `connect-src`/`script-src` for Vercel Live + Sentry hosts.
3. Production error boundaries avoid leaking stack traces to users.
4. CI uses `prisma migrate deploy` (not `db push`).
5. Observability capture points ready for Sentry DSN.

### Accepted risks for v1.0
| Risk | Mitigation / follow-up |
| --- | --- |
| CSP still allows `'unsafe-inline'` / `'unsafe-eval'` (Next requirement) | Track nonce-based CSP when Next supports fully |
| Demo fixtures / seed passwords in non-prod | Forbid seed on production; rotate immediately if used |
| Payment providers UI-stubbed | Do not enable live keys until webhook verification lands |
| Brand tenancy filters demo-level | Enforce `BrandManagerProfile.brandId` in repositories before multi-brand go-live |
| Affiliate model missing | Marketing UI only — no affiliate payouts |

### Open actions before broad public launch
1. Complete external penetration test — ops checklist: [PENETRATION_TEST_CHECKLIST.md](./PENETRATION_TEST_CHECKLIST.md).
2. ~~Enable Sentry~~ **Done** — set production DSNs + alert routing ([SENTRY.md](./SENTRY.md)).
3. Confirm Upstash rate limits active in production.
4. Review Supabase storage RLS policies with least privilege.
5. Rotate `AUTH_SECRET` and OAuth secrets for production.

## Dependency audit
```bash
cd platform
pnpm audit:deps        # production high+
pnpm audit:deps:full   # all severities
```
CI runs `pnpm audit --prod --audit-level=high` with `continue-on-error` so known advisories are visible without blocking hotfixes; treat failures as release blockers for public launch.

### v1.0 audit snapshot (updated 2026-07-27)
- Cleared Auth.js Critical/High by upgrading to `next-auth@5.0.0-beta.32`.
- Pinned `brace-expansion@5.0.8` (Sentry/glob chain).
- Residual High via `next@15.5.21` transitive `postcss@8.4.31` and `sharp@<0.35` — await Next patch; documented exception until then.

CI runs `pnpm audit --prod --audit-level=high` with `continue-on-error` so known residual advisories are visible without blocking hotfixes; treat new Critical/High as release blockers for public launch.

## Auth residual checks (from Stage 4)
- Guest checkout remains intentionally ungated.
- Admin is SUPER_ADMIN-only.
- Password reset tokens hashed; email verify flows present.

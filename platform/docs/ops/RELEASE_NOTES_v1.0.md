# Release Notes — VERONICA MARK v1.0.0

**Codename:** Production readiness  
**Date:** 2026-07-24

## Highlights
- Full luxury marketplace surface: public storefront, customer account, brand manager, super admin, and marketing ops.
- Production deploy contract for **Vercel + Neon PostgreSQL + Supabase Storage**.
- Hardened security headers (incl. HSTS), caching, image optimization, error boundaries, observability hooks.
- CI quality gates with Prisma migrate deploy + Playwright smoke.

## Included stages (1–10)
Foundation → Design system → Database → Auth → Storefront → Account → Brand → Admin → Marketing → Production ops.

## Operator notes
- Package version: `1.0.0`
- Docs entrypoint: `docs/ops/PRODUCTION.md`
- Seed users are for non-production only — rotate immediately if ever applied to a live DB.

## Breaking / migration
- First production deploy must run `prisma migrate deploy` against Neon unpooled URL.
- Ensure Vercel root directory is `platform`.

## Known limitations
See `docs/ops/REMAINING_IMPROVEMENTS.md` (payments live capture, demo→Prisma sync, external pentest).

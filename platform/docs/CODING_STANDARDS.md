# Enterprise Coding Standards — VERONICA MARK

Derived from the project skill cross-cutting disciplines and Volume 4 architecture.

## Principles

1. **Production-ready only** — no pseudocode, fake APIs, or unrequested TODOs in merged code.
2. **Layered architecture** — presentation ≠ services ≠ domain ≠ repositories.
3. **Feature ownership** — prefer `features/<domain>/` co-location.
4. **Managed-brand model** — Brand Manager scoped to own brand; Super Admin unrestricted.
5. **Server is source of truth** — recompute money, tax, shipping, promotions server-side.

## TypeScript

- `strict` enabled; avoid `any`
- Prefer `type` imports
- Explicit return types on exported public service methods when clarity suffers without them
- UUID strings for entity IDs

## React / Next.js

- Default to Server Components
- Add `"use client"` only for interactivity
- Server Actions for mutations; Route Handlers for webhooks/external APIs
- Loading / empty / error states required for user-facing screens

## Validation & errors

- Zod at every boundary
- Throw/return `AppError` subclasses from `lib/errors`
- Never leak internal exception messages to clients

## UI / design system

- Tokens from `app/globals.css` (Vol 3) — no ad-hoc brand colors
- Breakpoints: 640 / 768 / 1024 / 1280 / 1536
- Typography: Playfair Display (display), Inter (UI), Manrope (alt)
- shadcn/ui primitives first; Lucide icons; Framer Motion for intentional motion
- WCAG 2.2 AA, visible focus, reduced-motion support

## Data

- Prisma only through repositories/services
- `Decimal(12,2)` for money
- Soft-delete where SRS requires (`deletedAt`)
- Transactions for multi-table workflows (checkout, refunds)
- Immutable ledgers (wallet/audit) — never edit/delete history rows

## Security

- Auth.js sessions; middleware for route protection
- RBAC checks on server, never client-only
- Rate limiting via Upstash when configured
- Signed URLs for protected Supabase assets
- CSP + security headers in `next.config.ts`

## i18n / currency readiness

Languages: EN, FR, AR (RTL), ES, HA, IG, YO  
Currencies: NGN (default), USD, GBP, EUR

Do not hardcode English copy or NGN formatting in reusable components when a localized path exists.

## Performance targets

- Lighthouse ≥ 95
- RSC boundaries intentional
- Paginate list queries
- Cache catalog/CMS content appropriately

## Testing

- Unit: Vitest
- E2E: Playwright
- Cover validation, permissions, and failure modes for risky changes

## Documentation

Significant features update architecture notes and call out new discrepancies against the reference volumes.

# Volume 4 — Technical Architecture

Source: VERONICA_MARK_Technical_Architecture_Specification.docx (Enterprise Architecture v1.0)

## Architecture Overview
Modular, layered architecture: Next.js App Router, React Server Components, TypeScript, Prisma. Business logic is separated from presentation, data access and infrastructure — never mix them in one file.

## Technology Stack
- Frontend: Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Next.js Server Actions & Route Handlers (no separate NestJS/Express backend)
- Database: Neon PostgreSQL + Prisma ORM
- Storage: Supabase Storage
- Hosting: Vercel
- Auth: Auth.js
- Cache: Redis (Upstash)
- Payments: Paystack, SquadCo

## Application Layers
`Presentation → Application Services → Domain Logic → Repository Layer → Prisma ORM → PostgreSQL`
Cross-cutting concerns (auth, validation, logging, caching) wrap all layers rather than living inside any one of them.

## Project Structure
```
app/            # Next.js App Router routes
components/     # shared UI components (shadcn/ui based)
features/       # feature-based modules (preferred over pure type-based org)
lib/            # utilities, Prisma client, shared services
prisma/         # schema.prisma, migrations, seed.ts
hooks/          # shared React hooks
types/          # shared TypeScript types
styles/
emails/         # transactional email templates
middleware.ts   # RBAC / route protection
public/
tests/
```
Organize by **feature**, not only by file type — a `products/` feature folder should hold its own components, actions, and types rather than scattering them across top-level `components/`, `lib/`, `types/`.

## Authentication & Authorization
Google + email auth via Auth.js. Secure sessions. RBAC for `SUPER_ADMIN`, `BRAND_MANAGER`, `CUSTOMER` (and `GUEST` for unauthenticated). `middleware.ts` protects routes based on permissions — don't rely on client-side role checks alone.

## API & Server Actions
- **Server Actions** for mutations (preferred default for form submissions, dashboard actions)
- **Route Handlers** for external APIs and webhooks (Paystack/SquadCo callbacks, etc.)
- Validate all inputs with **Zod**, return typed responses

## Database Architecture
Prisma manages schema, migrations, queries. UUID primary keys, indexed foreign keys, transactions wrapping critical multi-table workflows (checkout, refunds), soft-delete (`deletedAt`) where the SRS calls for it. See references/05-database-overview.md and references/06-prisma-schema.md.

## Caching & Performance
React `cache()`, Next.js Data Cache, ISR where appropriate. Cache catalog and CMS content specifically (these change infrequently relative to orders/inventory). Optimize images, code-split, lazy-load.

## Storage & Media
Supabase Storage for product images, documents, media. Signed URLs for protected assets; image optimization pipeline for storefront delivery.

## Background Processing
Queue async work: emails, inventory updates, webhook retries, analytics aggregation, report generation. Don't do these synchronously in a request/response cycle.

## Security
HTTPS everywhere, CSP, CSRF protection, secure cookies, rate limiting, input validation, parameterized Prisma queries (never raw string-interpolated SQL), audit logging, secrets via environment variables only.

## Deployment
Continuous deployment via Vercel. Separate dev/staging/production environments. Prisma migrations run automatically in the release pipeline (not manually against prod).

## Monitoring & Observability
Application logs, audit logs, health checks, webhook delivery monitoring, error tracking, performance metrics, uptime monitoring, alerting dashboards.

## Scalability
Stateless app servers, CDN delivery, horizontal scaling via Vercel, DB connection pooling, modular services, feature flags for controlled rollout.

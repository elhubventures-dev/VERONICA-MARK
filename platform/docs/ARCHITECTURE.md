# Architecture — Stage 1 Foundation

## System context

VERONICA MARK is a Next.js monolith (App Router) deployed on Vercel, with Neon PostgreSQL, Supabase Storage, Upstash Redis, and Auth.js.

```
Browser / PWA
   │
   ▼
Next.js (RSC + Server Actions + Route Handlers)
   │
   ├── Auth.js sessions
   ├── Prisma → Neon PostgreSQL
   ├── Supabase Storage (signed URLs)
   └── Upstash Redis (rate limit / cache)
```

## Directory map

```
platform/
  app/                 # routes, layouts, API handlers
  components/          # shared UI (shadcn-based)
  features/            # feature modules (Phase 2+)
  lib/
    auth/              # Auth.js + RBAC
    actions/           # server action factory
    services/          # application services
    domain/            # domain rules
    repositories/      # Prisma data access
    validations/       # Zod schemas
    storage/           # Supabase helpers
    cache/             # Redis / rate limit
    env.ts             # validated configuration
    logger.ts          # Pino logging
    errors.ts          # operational errors
    prisma.ts          # Prisma singleton
  prisma/              # schema, seed, migrations
  hooks/
  types/
  emails/
  tests/
  docker/              # local Postgres + Mailpit only
```

## Auth & RBAC

Coarse roles on `User.role`:

- `CUSTOMER`
- `BRAND_MANAGER`
- `SUPER_ADMIN`

Middleware protects `/account`, `/checkout`, `/brand`, `/admin`.

Part IV `Role` / `Permission` / `RolePermission` models exist in schema but are **not** connected to `User`. Do not implement fine-grained permission checks against those tables until product decides additive vs replacement RBAC.

## Observability

- Structured logs via Pino (`lib/logger.ts`)
- Request IDs via middleware `x-request-id`
- `/api/health` checks database connectivity

## CI/CD

GitHub Actions (repo root `.github/workflows`):

1. Install → Prisma generate/validate → typecheck → lint → format → unit tests → db push → build
2. CD workflow documents Vercel production release expectations

## Stage boundaries

Stage 1 delivers foundation only. Catalog, commerce, marketing, and admin dashboards arrive in roadmap Phases 2–5.

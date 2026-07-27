# VERONICA MARK Platform

Luxury **managed-brand marketplace** (launch category: perfumes) — **Version 1.0.0**.

Brands are curated and onboarded by VERONICA MARK — this is not a vendor self-registration marketplace. Use **Brand** / **Brand Manager** terminology everywhere.

## Release status

**v1.0.0** — Stages 1–10 complete (foundation through production readiness).

- Production ops: [docs/ops/PRODUCTION.md](./docs/ops/PRODUCTION.md)
- Release notes: [docs/ops/RELEASE_NOTES_v1.0.md](./docs/ops/RELEASE_NOTES_v1.0.md)
- Remaining backlog: [docs/ops/REMAINING_IMPROVEMENTS.md](./docs/ops/REMAINING_IMPROVEMENTS.md)

## Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| App           | Next.js 15, React, TypeScript                 |
| UI            | Tailwind CSS, shadcn/ui, Framer Motion, Lucide|
| Data          | Prisma ORM, Neon PostgreSQL                   |
| Storage       | Supabase Storage                              |
| Auth          | Auth.js / NextAuth v5                         |
| Cache         | Upstash Redis                                 |
| Payments      | Paystack, SquadCo (UI ready; live capture P0) |
| Hosting       | Vercel                                        |
| Observability | Pino + health checks (Sentry-ready)           |

## Quick start

See [INSTALLATION.md](./INSTALLATION.md).

```bash
cd platform
pnpm install
cp .env.example .env.local
docker compose -f docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Quality

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm release:check
```

## Portals

| Surface    | Path                | Role          |
| ---------- | ------------------- | ------------- |
| Storefront | `/`                 | Guest+        |
| Account    | `/account`          | Customer+     |
| Brand      | `/brand`            | Brand Manager+|
| Admin      | `/admin`            | Super Admin   |
| Marketing  | `/admin/marketing`  | Super Admin   |

## Documentation

- [docs/ops/PRODUCTION.md](./docs/ops/PRODUCTION.md)
- [docs/ops/BACKUP_AND_DR.md](./docs/ops/BACKUP_AND_DR.md)
- [docs/ops/SECURITY_AUDIT_STAGE10.md](./docs/ops/SECURITY_AUDIT_STAGE10.md)
- [docs/design-system/ACCESSIBILITY.md](./docs/design-system/ACCESSIBILITY.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## License

Proprietary — VERONICA MARK. All rights reserved.

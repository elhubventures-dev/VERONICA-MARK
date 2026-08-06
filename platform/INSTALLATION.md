# Installation Guide — VERONICA MARK Platform

## Prerequisites

- Node.js **20+**
- pnpm **9+** (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- Docker Desktop (for local PostgreSQL only)
- Neon PostgreSQL project (staging/production)
- Supabase project (storage)
- Vercel project (hosting)

## 1. Clone and install

```bash
cd "VERONICA MARK/platform"
pnpm install
```

## 2. Environment

```bash
cp .env.example .env.local
```

Required for local app boot:

| Variable                | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `DATABASE_URL`          | Neon pooled URL (or local Docker Postgres) |
| `DATABASE_URL_UNPOOLED` | Direct URL for migrations                  |
| `AUTH_SECRET`           | `openssl rand -base64 32`                  |
| `NEXT_PUBLIC_APP_URL`   | `http://localhost:3000`                    |

Optional until later phases: Google OAuth, Supabase, Upstash Redis, Paystack, SquadCo, Resend, Twilio WhatsApp (see `docs/ops/TWILIO_WHATSAPP.md`).

## 3. Local database (Docker)

```bash
docker compose -f docker/docker-compose.yml up -d
```

Suggested local URLs:

```env
DATABASE_URL=postgresql://veronica:veronica@localhost:5432/veronica_mark?schema=public
DATABASE_URL_UNPOOLED=postgresql://veronica:veronica@localhost:5432/veronica_mark?schema=public
AUTH_SECRET=local-dev-secret-replace-with-openssl-rand
```

Mailpit UI (dev email catcher): http://localhost:8025

## 4. Prisma

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Seed creates:

- Super Admin `sales@veronicamark.com` — password from `SEED_DEFAULT_PASSWORD` (local demo fallback only). **Change immediately on any shared environment; production seed is blocked.**
- House brand `vma-scents`
- Category `perfumes`
- Default currency + guest checkout feature flag

## 5. Run

```bash
pnpm dev
```

- Storefront: http://localhost:3000
- Health: http://localhost:3000/api/health
- Sign-in: http://localhost:3000/auth/sign-in

## 6. Quality commands

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm ci
```

## 7. Vercel

1. Set project **Root Directory** to `platform`
2. Install: `pnpm install`
3. Build: `pnpm exec prisma generate && pnpm exec prisma migrate deploy && pnpm build`
4. Configure all production secrets from `.env.example`

## Troubleshooting

- **Prisma P1001** — database unreachable; confirm Docker/Neon and `DATABASE_URL`
- **AUTH_SECRET length** — must be ≥ 32 characters
- **pnpm EBUSY on Windows** — close IDE terminals locking `node_modules`, delete `node_modules`, reinstall
- **Husky hooks not running** — `pnpm prepare` from `platform/`

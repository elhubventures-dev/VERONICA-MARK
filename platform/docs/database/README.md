# Database Architecture — Stage 3

VERONICA MARK uses **Neon PostgreSQL** as the system of record, accessed exclusively through **Prisma ORM** from server-side code (`lib/repositories`, `lib/services`).

## Layering

> **Stage 3 review:** see [DATABASE_REVIEW.md](./DATABASE_REVIEW.md) for model counts, relationship review, and Neon apply checklist.

```
Route Handler / Server Action
        │
        ▼
   lib/services/*          ← business orchestration, transactions
        │
        ▼
   lib/repositories/*      ← Prisma data access (no HTTP concerns)
        │
        ▼
   lib/db/*                ← pagination, soft delete, errors, transactions
        │
        ▼
   lib/prisma.ts           ← PrismaClient singleton (server-only)
        │
        ▼
   Neon PostgreSQL
```

### Rules

- **Never** import `lib/prisma.ts` from client components.
- Repositories are **append-only** for immutable ledgers (`AuditLog`, `InventoryMovement`, `WalletTransaction`, `PaymentEvent`).
- Money is stored as `Decimal(12,2)` — convert at boundaries with `lib/db/query-helpers.ts`.
- Soft-deleted rows use `deletedAt`; default queries exclude them via `lib/db/soft-delete.ts`.

## Neon setup

1. Create a Neon project (PostgreSQL 16+ recommended).
2. Copy the **pooled** connection string → `DATABASE_URL`
3. Copy the **direct** connection string → `DATABASE_URL_UNPOOLED` (migrations, introspection)
4. Add both to `.env.local`:

```env
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
```

Neon pools connections for serverless (Vercel). Prisma uses `directUrl` for migrations to avoid pooler limitations.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm db:generate` | Regenerate Prisma Client after schema changes |
| `pnpm db:validate` | Format + validate `schema.prisma` |
| `pnpm db:migrate` | Create & apply dev migration (`prisma migrate dev`) |
| `pnpm db:migrate:deploy` | Apply pending migrations in CI/production |
| `pnpm db:push` | Push schema without migration (local prototyping only) |
| `pnpm db:seed` | Run `prisma/seed.ts` |
| `pnpm db:studio` | Open Prisma Studio |

### Typical workflow

```bash
# After pulling schema changes
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# CI / production
pnpm db:migrate:deploy
```

## Repository index

| Repository | Responsibility |
|------------|----------------|
| `brand.repository` | Brand CRUD, slug lookup, soft delete |
| `product.repository` | Published catalog, slug lookup, soft delete |
| `inventory.repository` | Stock adjust/reserve/release/commit + movements |
| `cart.repository` | Guest/customer carts, merge on login |
| `order.repository` | Order creation with items + status history |
| `payment.repository` | Payment records and status events |
| `promotion.repository` | Active promotions and coupon lookup |
| `audit-log.repository` | Append-only audit trail |

See [MODELS.md](./MODELS.md) and [CONVENTIONS.md](./CONVENTIONS.md) for schema details.

## Error mapping

Prisma errors are normalized in `lib/db/errors.ts`:

| Code | Mapped error |
|------|----------------|
| P2002 | `UniqueConstraintError` (409) |
| P2025 | `RecordNotFoundError` (404) |
| P2003 | `ForeignKeyConstraintError` (400) |

Use `handlePrisma()` wrapper in repositories for consistent mapping.

## Related docs

- [ERD.md](./ERD.md) — entity relationship diagram
- [MODELS.md](./MODELS.md) — model group inventory
- [CONVENTIONS.md](./CONVENTIONS.md) — UUID, money, soft delete, indexes

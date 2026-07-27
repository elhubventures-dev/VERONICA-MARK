# Database Conventions — VERONICA MARK

Production conventions for the Vol 5/6 Prisma schema and application layer.

## Identifiers

- **Primary keys**: UUID v4 via `@id @default(uuid())` on every model.
- **Public references**: Use human-readable slugs (`Brand.slug`, `Product.slug`) or order numbers (`Order.orderNumber`) in URLs — never expose sequential IDs.
- **SKU / barcode**: Unique at variant level (`ProductVariant.sku`).

## Timestamps

| Field | Usage |
|-------|-------|
| `createdAt` | Set once at insert (`@default(now())`) |
| `updatedAt` | Auto-updated on mutable models (`@updatedAt`) |
| `deletedAt` | Soft delete marker (`null` = active) |
| `publishedAt` | Catalog visibility timestamp |

## Soft delete

Applied to **mutable, customer-facing entities**:

- `User`, `Brand`, `Product`, `Category`, and similar catalog/identity models.

**Not** soft-deleted (immutable ledgers):

- `AuditLog`, `InventoryMovement`, `WalletTransaction`, `RewardTransaction`
- `PaymentEvent`, `CouponUsage`, `OrderStatusHistory`, `WebhookLog`

### Query pattern

```typescript
import { mergeSoftDeleteFilter } from "@/lib/db/soft-delete";

const where = mergeSoftDeleteFilter({ slug: "noir-eclat-edp" });
// → { slug: "noir-eclat-edp", deletedAt: null }
```

Pass `{ withDeleted: true }` for admin/audit views.

## Money

- **Storage**: `Decimal @db.Decimal(12, 2)` in PostgreSQL.
- **Runtime**: Use `Decimal` from `@prisma/client/runtime/library` — never raw JavaScript `number` for arithmetic.
- **Display**: Convert at UI boundary with `decimalToNumber()` or locale formatters.
- **Comparison**: Use `moneyEquals(a, b)` — not `===`.
- **Validation**: `assertPositiveMoney()` for prices; Zod `moneySchema` at API boundaries.

### Checkout totals

Server-side recomputation lives in `lib/services/checkout.service.ts` (`recomputeTotals`). Never trust client-submitted totals.

## Immutable ledgers

Stock, wallet, reward, payment, and audit tables are **append-only**:

| Ledger | Write pattern |
|--------|---------------|
| `InventoryMovement` | Created inside same `$transaction` as `Inventory` update |
| `WalletTransaction` | Credit/debit rows; balance derived or denormalized |
| `OrderStatusHistory` | One row per status transition |
| `AuditLog` | `AuditLogRepository.create()` only — no update/delete |
| `PaymentEvent` | Webhook payloads logged immutably |

Repositories must not expose update/delete for these models.

## Transactions

- Use `withTransaction()` from `lib/db/transactions.ts` for multi-step writes.
- Default timeout: 15s, max wait: 5s.
- Pass `tx` client to repositories when composing operations (e.g. `InventoryRepository.adjustStock(input, tx)`).

## Indexes

Vol 5 specifies heavy composite indexes. Common patterns:

```prisma
@@index([brandId, status])           // catalog filters
@@index([customerId, status])        // order history
@@index([active, startsAt, endsAt])  // promotions
@@index([deletedAt])                 // soft delete scans
@@unique([cartId, variantId])       // cart line dedup
@@unique([locale, namespace, key])  // localization
```

Always filter on indexed columns in list queries (status, deletedAt, foreign keys).

## RBAC (additive)

- Coarse gate: `User.role` enum (`UserRole`).
- Fine-grained: `UserRoleAssignment` → `Role` → `RolePermission` → `Permission`.
- Both layers coexist until product consolidates. Do not remove `User.role` checks without migration plan.

## Naming

| Layer | Convention | Example |
|-------|------------|---------|
| Prisma model | PascalCase singular | `ProductVariant` |
| Table (implicit) | snake_case plural | `product_variants` |
| Repository | `{entity}.repository.ts` | `product.repository.ts` |
| Enum | SCREAMING_SNAKE | `OrderStatus.PACKED` |

## Error handling

Wrap Prisma calls with `handlePrisma()` or catch and `mapPrismaError()`:

- **P2002** → `UniqueConstraintError` (409)
- **P2025** → `RecordNotFoundError` (404)
- **P2003** → `ForeignKeyConstraintError` (400)

## Seed data

`prisma/seed.ts` uses `PrismaClient` directly (not `lib/prisma`) so it can run outside Next.js. Default password for seeded users: documented in seed output only — rotate before any shared environment.

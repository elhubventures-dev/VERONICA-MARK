# Stage 3 Database Review — VERONICA MARK

**Status:** Complete — stop here pending approval before Stage 4 (commerce features).

**Verified**
- `pnpm exec prisma format` ✅
- `pnpm exec prisma validate` ✅
- `pnpm exec prisma generate` ✅
- `pnpm typecheck` ✅
- Migration SQL generated via `prisma migrate diff --from-empty` ✅
- Live `migrate deploy` not run in this environment (Docker unavailable / no Neon credentials). Apply against Neon or local Postgres before seed.

---

## Inventory

| Asset | Count |
| --- | ---: |
| Prisma models | **90** |
| Enums | **39** |
| Migration `CREATE TABLE` | **90** |
| Indexes (incl. unique) | **222** |
| Foreign keys | **111** |

Migration: `prisma/migrations/20260724120000_stage3_production_schema/migration.sql`

---

## Spec resolutions applied

### 1. OrderStatus → SRS/UX full flow
Previous Part II draft (8 states) replaced with production enum:

`PENDING → CONFIRMED → PAID → PROCESSING → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED → COMPLETED`  
Side branches: `CANCELLED`, `REFUND_REQUESTED`, `REFUNDED`

Rationale: Stage 3 asked for every model/status from the specifications; Vol 1/2/5 narrative is the business source of truth for fulfillment. Documented in schema comments and `OrderStatusBadge`.

### 2. RBAC → additive dual mechanism
- **Coarse:** `User.role` (`SUPER_ADMIN` | `BRAND_MANAGER` | `CUSTOMER`) for middleware
- **Fine-grained:** `Role` / `Permission` / `RolePermission` / **`UserRoleAssignment`** wiring users to roles

Guests remain unauthenticated (no `GUEST` DB role).

### 3. CMS / templates completed from Vol 5 narrative
Added `CMSSection`, `EmailTemplate`, `NotificationTemplate` (were gaps in Part IV draft).

### 4. Shipping rename
`Shipping` → `ShippingShipment` (+ `ShippingRule`, `ShipmentTrackingEvent`) to avoid overloaded naming.

---

## Relationship review (core)

```
User ──< CustomerProfile ──< Order ──< OrderItem >── ProductVariant
  │           │                ├── Payment[]
  │           │                ├── ShippingShipment[]
  │           │                └── ReturnRequest[]
  ├── BrandManagerProfile >── Brand ──< Product ──< ProductVariant ── Inventory
  │                              │         ├── ProductMedia / ProductSEO
  │                              └── PromotionBrand / etc.
  └── UserRoleAssignment >── Role ──< RolePermission >── Permission

Cart ──< CartItem >── ProductVariant
Promotion ──< Coupon ──< CouponUsage
Wallet ──< WalletTransaction (immutable)
Inventory ──< InventoryMovement (immutable)
AuditLog (immutable, actor → User)
```

Integrity rules of note:
- Order items / payments use `onDelete: Restrict` where history must survive
- Cart items / wishlist items cascade with parent
- Soft delete on catalog/identity entities; **no** soft delete on ledgers

---

## Application layer delivered

| Layer | Path |
| --- | --- |
| Pagination / soft-delete / transactions / Prisma error map / query helpers | `lib/db/*` |
| Zod DB schemas | `lib/validations/database.ts` |
| Repositories | `lib/repositories/*` (brand, product, inventory, cart, order, payment, promotion, audit-log, user) |
| Services | `lib/services/inventory.service.ts`, `checkout.service.ts` |
| Seed | `prisma/seed.ts` (RBAC, brand, categories, products, August flash sale, tax/shipping) |
| Docs | `docs/database/*` |

---

## Neon apply checklist

```bash
cd platform
cp .env.example .env.local
# set DATABASE_URL (pooled) + DATABASE_URL_UNPOOLED (direct) from Neon

pnpm db:generate
pnpm db:migrate:deploy   # or: pnpm db:migrate for dev
pnpm db:seed
pnpm exec prisma validate
```

Seed credentials (change immediately): `sales@veronicamark.com` / `ChangeMeNow!1`

---

## Risks / follow-ups

1. **Apply migration on Neon** before any Stage 4 commerce work.
2. Brand Manager scoping must filter by `BrandManagerProfile.brandId` in every brand-scoped query (repos ready; enforce in services/actions next stage).
3. Exchange rates / localization tables exist; i18n runtime wiring is Stage 4+.
4. `PaymentStatus` expanded beyond Part II (`CANCELLED`, `PARTIALLY_REFUNDED`) for production payment ops — confirm with payments implementation.

---

## Stop

Stage 3 production database is complete. Do not start Stage 4 until this review is approved and migrations are applied to the target Neon database.

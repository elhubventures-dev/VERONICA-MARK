# Brand tenancy (P0 #3)

Brand Managers may only read/mutate data for the brand on `BrandManagerProfile.brandId`.

## Rules

| Actor | Scope |
|---|---|
| `BRAND_MANAGER` | Locked to assigned `brandId` — cannot override |
| `SUPER_ADMIN` | No ambient brand; must pass explicit `brandId` for brand-scoped ops |
| `CUSTOMER` | Denied |

## Code map

| Piece | Path |
|---|---|
| Pure rules (unit-tested) | `lib/auth/brand-tenancy-rules.ts` |
| Server context | `lib/auth/brand-tenancy.ts` → `requireBrandContext()` |
| Session brand (BM only) | `lib/data/session-context.ts` → `getSessionBrandId()` |
| Mutations | `lib/brand/actions.ts` |
| Repositories | `*ForBrand` methods on product / inventory / order / promotion |

## Mutations covered

- Inventory stock adjust (`adjustBrandInventoryAction`)
- Product archive / restore (`updateBrandProductStatusAction`)
- Order packed / shipped / out for delivery / delivered (`updateBrandOrderFulfillmentAction`) — each step sends the matching customer status email

Each action calls `requireBrandContext()` then a `*ForBrand` repository method that re-checks ownership before write.

## Query hardening

- `getBrandOrder` no longer returns orders when `brandId` is missing or mismatched
- Coupons / flash sales list via `listCouponsForBrand` / `listPromotionsForBrand`
- Product detail uses `findByIdForBrand`

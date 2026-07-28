# Demo → Prisma

Account, brand, admin, marketing, and storefront query layers prefer Prisma repositories.

Demo façades in `lib/*/demo-data.ts` and `lib/storefront/demo-catalog.ts` are **empty** by default so dashboards and the shop show empty states when the database has no rows (no fake seed UI).

## Bootstrap seed

`pnpm db:seed` (and `pnpm db:wipe`) create only:

- RBAC roles / permissions
- Login accounts: `admin@veronicamark.com`, `brand.manager@veronicamark.com`, `customer@example.com`
- House brand shell `vma-scents` (no products)
- Perfume categories
- Nigeria VAT + shipping rules
- Feature flags / default currency

No sample products, orders, wallets, coupons, or promotions.

## Reset

```bash
pnpm db:wipe   # truncate all tables, then bootstrap seed
```

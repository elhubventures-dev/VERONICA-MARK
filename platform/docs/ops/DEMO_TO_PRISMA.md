# Demo → Prisma (P0 #2)

Account, brand, admin, marketing, and storefront query layers now prefer Prisma repositories, with demo-data fallbacks when the DB is empty or unreachable.

## What reads from Prisma

| Area | Wired |
|------|--------|
| Storefront catalog | Products, brands, categories, facets, coupons, flash sale, invoices |
| Checkout (Paystack) | Real `OrderItem` rows when variant IDs exist in DB |
| Account | Orders, profile, addresses, wallet, wishlist, coupons, notifications, rewards, analytics |
| Brand portal | Products, inventory, orders, coupons/flash sales, workspace/profile |
| Admin | Brands, customers, orders, payments, feature flags, settings, users, dashboard |
| Marketing | Promotions, coupons, flash sales, dashboard counts |

Still demo-only (by design for this pass): returns, referral UI, CMS, fraud, email/push campaigns, abandoned-cart workers, brand customers/media/reports.

## Seed expectations

`pnpm db:seed` now includes:

- Active promo window through end of 2026
- Coupons `VM5AUG-20` (primary, 20% off), `AUGUST20`, and `GRANDOPEN`
- Customer address, wishlist, wallet credit, rewards, welcome notification
- Sample paid order `VM-SEED-0001` with line item + Paystack payment
- Unsplash primary images for seeded SKUs

## Fallback behaviour

If Prisma throws or returns empty where a list is required for UX, the previous demo façades are returned so local UI remains browsable without a database.

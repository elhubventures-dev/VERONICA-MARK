# Volume 5 — Database Overview (Narrative)

Sources: VERONICA_MARK_Database_Prisma_Volume_I / II / III / IV.docx

This is the narrative/architectural description of the database, module by module. For actual Prisma `model`/`enum` code, see **references/06-prisma-schema.md** — that file is the implementation-level source of truth; this file is the conceptual map. When the two disagree on a specific field or enum value, the Prisma code in Volume V wins (it's the later, more concrete pass) — but flag the discrepancy to the user rather than silently resolving it, since neither doc is marked as final/superseding the other.

## Database Philosophy
Managed Brand Marketplace architecture (brands are curated, not self-service vendors). Long-term scalability via:
- UUID primary keys on every entity
- `createdAt`, `updatedAt`, `deletedAt` on every table (soft deletes, not hard deletes)
- `Decimal(12,2)` for all monetary values — never Float/Int for money
- Enums for all status fields
- Normalized to 3NF, full referential integrity, RBAC throughout

## Module Map
Authentication · RBAC · Users · Brands · Categories · Products · Inventory · Orders · Payments · Shipping · Marketing · Analytics · Settings · Notifications · Audit Logs

## Volume I — Core Architecture

**RBAC:** `Role`, `Permission`, `UserRole`, `RolePermission` tables. Permissions are granular (`products.create`, `orders.update`, `reports.view`, `settings.manage`, etc.) — don't hardcode role checks, check permissions.

**User architecture:**
```
User
 ├── CustomerProfile
 ├── BrandManagerProfile
 └── SuperAdminProfile
```
User fields: email, Google ID, password hash, profile info, preferences, verification flags, timestamps.

**Brand** (replaces the term "Vendor" everywhere in this project — brands are managed, not self-service vendors): id, name, slug, logo, banner, description, contact details, country, featured flag, status, timestamps.

**Category:** recursive/self-referential for unlimited nesting, e.g. `Fashion → Perfumes → Men → Designer`.

**Product:** core table stores only identity/catalog data — NOT variants, media, SEO, or inventory (those are separate tables by design, don't collapse them back into Product). Fields: brandId, categoryId, name, slug, SKU, barcode, descriptions, visibility, status, publishedAt, featured, newArrival, bestSeller.

**ProductVariant:** each fragrance size (50ml/100ml/150ml) is its own variant row with its own SKU, barcode, price, inventory.

**ProductMedia:** Supabase Storage paths for images/videos/future 360° assets.

**ProductSEO:** dedicated table — meta title, meta description, canonical URL, Open Graph, Twitter Card, JSON-LD.

**Core enums:** `UserRole` (SUPER_ADMIN, BRAND_MANAGER, CUSTOMER, GUEST) · `ProductStatus` (DRAFT, SCHEDULED, PUBLISHED, OUT_OF_STOCK, ARCHIVED) · `InventoryStatus` (IN_STOCK, LOW_STOCK, OUT_OF_STOCK, PREORDER) · `Currency` (NGN, USD, GBP, EUR) · `Theme` (LIGHT, DARK, SYSTEM) · `Language` (EN, FR, AR, ES, HA, IG, YO)

**Indexes:** email, slug, sku, barcode, brandId, categoryId, productId, status, publishedAt. Composite: `(brandId,status)`, `(categoryId,status)`, `(status,publishedAt)`, `(featured,publishedAt)`.

## Volume II — Commerce Engine

- **Inventory:** `Inventory`, `InventoryMovement`, `StockReservation`. Track currentStock, reservedStock, incomingStock, reorderLevel, preorderEnabled. Every stock change writes an immutable `InventoryMovement` record — never mutate stock without a movement row.
- **Cart:** `Cart`, `CartItem`. Support guest AND authenticated carts; merge/persist across devices after login. Validate stock, promotions, pricing before checkout — never trust cart prices at checkout, recompute server-side.
- **Checkout flow:** `Cart → Login/Guest → Address → Shipping → Coupon → Loyalty → Tax → Payment → Confirmation`. Guest checkout may optionally create an account post-purchase.
- **Address:** billing/shipping, country/state/city/postal/phone, default flag, multiple per customer.
- **Shipping:** providers — Bolt, Uber, Local Dispatch, DHL, FedEx, Pickup Stations. `ShippingRule` by destination/weight/price/delivery estimate.
- **Tax:** calculated at checkout by destination country. `TaxRule`: country, region, tax type, percentage, effective dates.
- **Orders:** `Order`, `OrderItem`. Narrative status flow: Pending, Confirmed, Paid, Processing, Packed, Shipped, OutForDelivery, Delivered, Completed, Cancelled, RefundRequested, Refunded. (See the discrepancy note in references/06-prisma-schema.md — the actual Prisma enum is shorter.)
- **Pre-orders:** products flagged `preorderEnabled` can be bought out-of-stock; estimated availability/fulfillment stored per order item.
- **Payments:** `Payment` table — provider, transaction reference, amount, currency, status, authorization code, timestamps. Providers: Paystack, SquadCo.
- **Returns/Refunds:** `ReturnRequest`, `Refund`. Refund workflow: Requested → Approved/Rejected → Processed → Completed.
- **Indexes:** orderNumber, customerId, paymentStatus, orderStatus, transactionReference, countryCode, shippingProvider, createdAt. Composite: `(customerId,createdAt)`, `(status,createdAt)`, `(countryCode,status)`.

## Volume III — Marketing & Customer Systems

- **Promotion engine:** central `Promotion` table — percentage, fixed, free shipping, buy-X-get-Y, scheduled, flash sales, brand/category/product targeting, start/end dates, priority, stackability, usage limits.
- **Coupons:** `Coupon` (code, promotionId, validity, redemption limits, min order value, customer restrictions, status), `CouponUsage` records every redemption.
- **Flash Sales:** `FlashSale`, `FlashSaleItem` — countdown timers, auto activation/expiry, homepage banners, product badges, inventory limits. Canonical example: "August Grand Opening Flash Sale."
- **Loyalty:** `RewardAccount` (points balance), `RewardTransaction` (earn/redeem/expire/adjust). Rules define points-per-purchase and redemption thresholds.
- **Wallet:** `CustomerWallet` (balance by currency), `WalletTransaction` — deposits, refunds, promo credits, purchases, adjustments — **immutable ledger, never edit/delete a transaction row**.
- **Referrals:** `ReferralCode`, `ReferralInvitation`, `ReferralReward`.
- **Wishlist:** `Wishlist`, `WishlistItem` — unlimited saves, stock alerts, price-drop notifications.
- **Reviews:** `Review` (rating, title, content, verifiedPurchase flag, moderation status, helpful votes), `ReviewMedia` for images.
- **Product Comparison:** `ComparisonList` — by spec, price, brand, rating, availability.
- **Recently Viewed:** `RecentlyViewed` — browsing history for recommendations.
- **Notifications:** `Notification`, `NotificationPreference`, `NotificationTemplate` — email/push/in-app. Triggers: order updates, promotions, rewards, restocks.
- **Indexes:** couponCode, referralCode, customerId, promotionStatus, startDate, endDate, rewardAccountId. Composite: `(customerId,createdAt)`, `(promotionStatus,startDate)`, `(couponCode,status)`.
- **Acceptance:** referral rewards, loyalty redemption at checkout, promo campaigns, flash sales, wallets, wishlists, verified reviews, notifications, reusable promotion rules must all work end to end.

## Volume IV — Administration & Analytics

> **Gap:** the production Prisma code for this volume (Volume V Part IV) was uploaded as a 0-byte/corrupted file, so only this narrative description exists — there is no `model`/`enum` code for these tables yet. If asked to implement anything here, say so explicitly and draft the Prisma models fresh from this narrative (checking with the user on naming/fields) rather than assuming code exists.

- **Admin architecture:** separate dashboards for Super Admin (unrestricted) and Brand Manager (RBAC-scoped to their own brand).
- **Super Admin modules:** Dashboard, User Management, Brand Management, Product Oversight, Orders, Inventory, Promotions, Taxes, Shipping, Reports, Support, Email Templates, Push Notifications, Audit Logs, Global Settings.
- **Brand Manager scope:** own catalog, inventory, campaigns, reports, coupons, media assets, customer interactions only. All actions logged.
- **Analytics:** product performance, sales, traffic, conversion, abandoned carts, customer acquisition, repeat purchases, revenue by brand/category/country.
- **Reporting:** daily/weekly/monthly/annual; export CSV/Excel/PDF; sales, inventory, finance, customer, marketing, operational KPIs.
- **Audit Logs:** `AuditLog` — actor, action, resource, recordId, previous values, new values, IP, user agent, timestamp, outcome. **Immutable — no updates or deletes, ever.**
- **CMS:** `CMSPage`, `CMSSection`, `MediaAsset` — homepage banners, landing pages, FAQs, policies, blog, promo pages without code deploys.
- **Email & Notification templates:** `NotificationTemplate`, `EmailTemplate` — localized, versioned, preview + rollback support.
- **Localization:** supported languages, currencies, translations, regional settings — content translatable without duplicating business entities.
- **Feature Flags:** `FeatureFlag` — staged rollouts, A/B testing, regional control, percentage rollouts, environment-specific activation.
- **System Settings:** payment gateways, shipping providers, tax defaults, maintenance mode, security policies, SEO defaults, app branding.
- **Monitoring:** app events, background job status, webhook deliveries, API usage, scheduled task history, system health metrics.
- **Indexes:** brandId, createdAt, action, resourceType, languageCode, featureKey, reportType. Composite: `(brandId,createdAt)`, `(resourceType,recordId)`, `(action,createdAt)`.

# Volume 1 — Software Requirements Specification (SRS)

Source: VERONICA_MARK_SRS_v1.md (v1.0)

## Executive Summary
VERONICA MARK is a premium **managed-brand marketplace**. Launch category is perfumes, with future support for fashion, clothing, shoes, bags, cosmetics, watches and accessories. Brands are curated and managed by VERONICA MARK — this is NOT a vendor self-service marketplace.

## Business Objectives
- Launch a luxury perfume marketplace
- Support worldwide sales with Nigeria as the base market
- Scale beyond 10,000 users
- Expand into a luxury multi-category marketplace

## Scope

**In scope:**
Public storefront, Customer Dashboard, Brand Manager Dashboard, Super Admin Dashboard, guest checkout, promotions, loyalty, referrals, flash sales, reviews, multi-language, multi-currency, PWA.

**Explicitly out of scope (do not build unless the user asks for a scope change):**
- Native mobile apps
- AI features
- Public REST API
- Vendor self-registration (brands are onboarded by VERONICA MARK, not self-service)

## User Roles
`GUEST`, `CUSTOMER`, `BRAND_MANAGER`, `SUPER_ADMIN` — see references/06-prisma-schema.md for the `UserRole` enum.

## Functional Requirements

### Authentication
Email, Google, password reset, email verification.

### Products
Name, SKU, barcode, brand, category, variants, images, price, sale price, scheduled publishing, inventory, SEO metadata.

### Checkout
Guest checkout, login checkout, shipping, coupon, loyalty redemption, country tax calculation, Paystack, SquadCo.

### Orders — status flow
`Pending → Confirmed → Paid → Processing → Packed → Shipped → Out for Delivery → Delivered → Completed`
Side branches: `Cancelled`, `Refund Requested → Refunded`.
Also supports: pre-orders, customer cancellation before shipment.

> Note: the narrative SRS/UX docs describe an 11-state order flow (above) including `Packed` and `Out for Delivery`. The production Prisma schema draft (Volume V Part II) currently only implements a simplified 7-state `OrderStatus` enum. Flag this discrepancy to the user if asked to implement order status logic — reconcile before writing code rather than silently picking one. See references/06-prisma-schema.md for details.

### Promotion Engine
Reference campaign used throughout the specs: **"August Grand Opening Flash Sale"** — 1 Aug 2026 to 7 Aug 2026, 20% off, applies to all perfumes, automatic activation and expiration. Use this as the canonical example when building/testing promotion logic.

### Customer Features
Wishlist, Reviews, Ratings, Coupons, Reward Points, Wallet, Referral, Product Comparison, Recently Viewed, Barcode Scanner, Image Search, Live Chat, Chat with Seller, Order Tracking, Returns, Invoices.

### Brand Manager
Dashboard, Products, Inventory, Orders, Customers, Reports, Analytics, Bulk CSV Import. Brand Managers are scoped to their own brand only (RBAC).

### Super Admin
Brands, Customers, Orders, Products, Marketing, Shipping, Taxes, Reports, Audit Logs, System Settings. Unrestricted access.

## Non-Functional Requirements
- Lighthouse >= 95
- Responsive (mobile-first)
- WCAG 2.2 AA
- RBAC
- CSRF protection
- Secure cookies
- Rate limiting
- Neon PostgreSQL, Supabase Storage, Vercel hosting

## Internationalization
**Languages:** English, French, Arabic, Spanish, Hausa, Igbo, Yoruba
**Currencies:** NGN (default), USD, GBP, EUR — automatic regional switching

## Branding (see also references/03-design-system.md)
Colors: Royal Purple, Luxury Gold, Cream, Matte Black
Fonts: Playfair Display, Inter, Manrope

## MVP Acceptance Criteria
The MVP is complete when browsing, guest checkout, payments, tracking, promotions, multilingual support and deployment on Vercel are fully operational.

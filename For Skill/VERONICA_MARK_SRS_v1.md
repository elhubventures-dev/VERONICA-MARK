# VERONICA MARK
## Software Requirements Specification (SRS)

Version: 1.0

## Executive Summary
VERONICA MARK is a premium managed-brand marketplace. The launch category is perfumes, with future support for fashion, clothing, shoes, bags, cosmetics, watches and accessories. Brands are curated and managed by VERONICA MARK.

## Business Objectives
- Launch a luxury perfume marketplace
- Support worldwide sales with Nigeria as the base market
- Scale beyond 10,000 users
- Expand into a luxury multi-category marketplace

## Scope
Included:
- Public storefront
- Customer Dashboard
- Brand Manager Dashboard
- Super Admin Dashboard
- Guest checkout
- Promotions
- Loyalty
- Referrals
- Flash sales
- Reviews
- Multi-language
- Multi-currency
- PWA

Excluded:
- Native mobile apps
- AI features
- Public REST API
- Vendor self-registration

## User Roles
Guest
Customer
Brand Manager
Super Admin

## Functional Requirements

Authentication:
- Email
- Google
- Password reset
- Email verification

Products:
- Name
- SKU
- Barcode
- Brand
- Category
- Variants
- Images
- Price
- Sale price
- Scheduled publishing
- Inventory
- SEO metadata

Checkout:
- Guest checkout
- Login checkout
- Shipping
- Coupon
- Loyalty redemption
- Country tax calculation
- Paystack
- SquadCo

Orders:
Pending
Confirmed
Paid
Processing
Packed
Shipped
Out for Delivery
Delivered
Completed
Cancelled
Refund Requested
Refunded

Supports:
- Pre-orders
- Customer cancellation before shipment

Promotion Engine:
Campaign:
August Grand Opening Flash Sale
Start: 1 Aug 2026
End: 7 Aug 2026
Discount: 20%
Applies to all perfumes
Automatic activation and expiration

Customer Features:
Wishlist
Reviews
Ratings
Coupons
Reward Points
Wallet
Referral
Product Comparison
Recently Viewed
Barcode Scanner
Image Search
Live Chat
Chat with Seller
Order Tracking
Returns
Invoices

Brand Manager:
Dashboard
Products
Inventory
Orders
Customers
Reports
Analytics
Bulk CSV Import

Super Admin:
Brands
Customers
Orders
Products
Marketing
Shipping
Taxes
Reports
Audit Logs
System Settings

Non-functional:
- Lighthouse >=95
- Responsive
- WCAG AA
- RBAC
- CSRF Protection
- Secure Cookies
- Rate Limiting
- Neon PostgreSQL
- Supabase Storage
- Vercel Hosting

Internationalization:
Languages:
English
French
Arabic
Spanish
Hausa
Igbo
Yoruba

Currencies:
NGN (default)
USD
GBP
EUR (automatic regional switching)

Branding:
Royal Purple
Luxury Gold
Cream
Matte Black
Fonts:
Playfair Display
Inter
Manrope

Acceptance:
The MVP is complete when browsing, guest checkout, payments, tracking, promotions, multilingual support and deployment on Vercel are fully operational.

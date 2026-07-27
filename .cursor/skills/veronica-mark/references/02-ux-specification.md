# Volume 2 — UX Specification

Source: VERONICA_MARK_UX_Specification_v1.md (v1.0)

## UX Vision
Should feel closer to Apple, Dior and Louis Vuitton than a typical marketplace: elegant, minimal, fast, mobile-first, accessible, premium photography, low visual clutter.

## Information Architecture

**Public Website:** Home, Shop, Brands, Categories, Flash Sale, New Arrivals, Best Sellers, About, Contact, Track Order, FAQ, Privacy, Terms.

**Customer Area:** Dashboard, Orders, Wishlist, Rewards, Wallet, Coupons, Addresses, Notifications, Returns, Profile, Security.

**Brand Manager:** Dashboard, Products, Inventory, Orders, Customers, Promotions, Analytics, Reports, Settings.

**Super Admin:** Overview, Brands, Categories, Products, Customers, Orders, Marketing, Flash Sales, Shipping, Taxes, Reports, Audit Logs, System Settings.

## Primary Navigation

**Desktop:** sticky top nav, mega menu for categories, search bar, currency selector, language selector, theme toggle, account, wishlist, cart.

**Mobile:** bottom navigation, floating search, hamburger menu, sticky cart icon.

## Homepage Layout (in order)
1. Announcement Bar
2. Navigation
3. Hero Banner
4. Flash Sale Countdown
5. Featured Brands
6. Shop by Category
7. New Arrivals
8. Best Sellers
9. Featured Collection
10. Customer Reviews
11. Newsletter
12. Footer

## Product Listing
**Card contains:** image, brand, name, rating, current price, original price, discount badge, wishlist, quick view, add to cart.
**Filters:** Brand, Category, Price, Rating, Availability, Size, Volume, Fragrance Family.
**Sorting:** Newest, Popular, Highest Rated, Price Low–High, Price High–Low.

## Product Detail Page
Image gallery + zoom, product details, price, variants, quantity, Add to Cart, Buy Now, delivery estimate, return policy, authenticity notice, specifications, reviews, related products, frequently bought together.

## Checkout Journey
`Cart → Guest/Login → Shipping Address → Shipping Method → Coupon → Loyalty Redemption → Tax Calculation → Payment → Confirmation`
Guest checkout always remains available — never gate checkout behind account creation.

## Customer Journey
`Discover → Search → View Product → Add to Cart → Checkout → Payment → Tracking → Delivery → Review`

## Flash Sale UX
Reference campaign: **August Grand Opening Flash Sale**.
Display surfaces: homepage hero, countdown timer, product badge, cart banner, checkout reminder. Automatic expiry after campaign end — no manual intervention required.

## Dashboard Widgets

**Customer Dashboard:** Recent Orders, Reward Balance, Wishlist Count, Coupons, Notifications, Recommended Products.

**Brand Manager Dashboard:** Sales Today, Orders, Inventory Alerts, Top Products, Revenue, Pending Shipments.

**Super Admin Dashboard:** Total Revenue, Orders, Customers, Brands, Active Promotions, Inventory Status, Platform Health.

## Responsive Breakpoints
Mobile: <768px · Tablet: 768–1023px · Desktop: 1024–1439px · Large Desktop: 1440px+
(Note: the UI Design System volume specifies a slightly different breakpoint set — 640/768/1024/1280/1536px. Treat the Design System volume's breakpoints as authoritative for Tailwind config since it's the more implementation-specific source; flag the discrepancy if precision matters for a given task.)

## Accessibility
WCAG 2.2 AA, keyboard navigation, screen reader labels, high contrast, focus states, reduced motion support.

## Motion Design
Subtle Framer Motion only: page fade, card hover, drawer transitions, skeleton loading, smooth cart updates. Avoid gratuitous animation — luxury brand tone favors restraint.

## Error States
Empty cart, empty wishlist, no search results, offline message, payment failure, out-of-stock notification. **Every error screen must offer a clear recovery action** — never a dead end.

## Success Metrics
Checkout completion rate, search success rate, time to purchase, repeat purchase rate, mobile conversion, Lighthouse score >95.

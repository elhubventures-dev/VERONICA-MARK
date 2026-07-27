# Stage 5 — Storefront UX Review

Review date: 2026-07-24  
Scope: Public website under `app/(storefront)/`  
Verdict: **Pass for Stage 5** — complete guest-facing commerce surface with SEO, a11y basics, and recovery paths. Live payment capture remains stubbed (expected until Stage 6+ integrations).

## Route coverage

| Surface | Route | Status |
| --- | --- | --- |
| Homepage | `/` | Hero → flash sale → brands → categories → rails → featured → reviews → newsletter |
| Mega nav | Header `Shop` mega menu + mobile drawer | Wired; categories / brands / flash sale |
| Categories | `/categories`, `/categories/[slug]` | Listing + filters via shared catalog |
| Brands | `/brands`, `/brands/[slug]` | Index + brand PLP |
| Product listing | `/shop` | Sort + filter shelf |
| Product details | `/products/[slug]` | Gallery, purchase panel, reviews, related, JSON-LD, recently viewed |
| Search | `/search` | Query + catalog results |
| Filters | Shop / search / category / brand | Price, brand, category, availability |
| Wishlist | `/wishlist` | Guest localStorage; empty CTA → shop |
| Comparison | `/compare` | Up to 4; empty CTA |
| Flash sales | `/flash-sale` + homepage countdown | Demo August event |
| Coupons | Cart + checkout | `VM5AUG-20` (20%) |
| Recently viewed | PDP rail | Session/local history |
| Cart | `/cart` | Qty, remove, coupon, checkout CTA |
| Checkout | `/checkout` | Guest allowed; shipping → payment → review |
| Payments | Checkout step | Paystack / SquadCo UI stubs (no live charge) |
| Invoices | `/invoices/[orderNumber]` | Print-friendly demo invoice |
| Content | about, contact, faq, privacy, terms, track-order | Present |
| SEO | `metadata`, `sitemap.ts`, `robots.ts`, JSON-LD | Product + org + website |

## Flow checks

- **Empty states**: Cart, wishlist, and compare show recovery CTAs into `/shop`.
- **Guest checkout**: Checkout is not auth-gated; email collected on shipping step.
- **Errors**: Invalid coupon surfaces inline guidance; missing product/invoice → `notFound()`.
- **Motion**: Hero and mega menu respect `prefers-reduced-motion` via Framer Motion.
- **Responsive**: Sticky header, mobile nav drawer, fluid product grids, checkout stacks on small screens.
- **Accessibility**: Skip link, labelled icon controls with counts, focusable main landmark, Escape closes mobile nav.
- **Imagery**: Next/Image + Unsplash `remotePatterns`; PDP uses optimized gallery sizes.

## Known Stage 5 boundaries (not blockers)

1. Payments are UI-only — no Paystack/SquadCo server verification yet.
2. Cart / wishlist / compare persist in localStorage for guests; account sync lands with later stages.
3. Catalog falls back to demo data when Prisma/DB is unavailable — intentional for local UX review.
4. Invoice confirmation uses demo order numbers until order persistence is fully wired in checkout APIs.

## Stop criteria

Stage 5 complete. Do not start Stage 6 unless explicitly requested.

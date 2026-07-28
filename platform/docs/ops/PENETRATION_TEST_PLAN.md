# Penetration Testing Plan (v1.0)

This is a **manual/authorized** test plan. Do not run intrusive tests against production without written approval.

## Scope
- In scope: storefront, auth, account, brand, admin, public APIs (`/api/health`, Auth.js routes)
- Out of scope initially: third-party payment provider dashboards, Supabase console, Neon console

## Roles under test
| Persona | Seed (non-prod only) |
| --- | --- |
| Guest | none |
| Customer | `customer@example.com` |
| Brand Manager | `veronicamark10@proton.me` |
| Super Admin | `sales@veronicamark.com` |

## Test cases

### Authentication & session
1. Brute-force sign-in → expect rate limiting.
2. CSRF: mutate without `vm_csrf` → rejected.
3. Session fixation after password reset.
4. Access `/admin` as customer → `/forbidden`.
5. Access `/brand` as customer → `/forbidden`.

### Authorization / tenancy
6. Brand manager cannot mutate another brand’s products (when Prisma wired).
7. IDOR on `/account/orders/[orderNumber]` and `/admin/orders/[orderNumber]`.
8. Direct object access to invoices belonging to another user.

### Input & injection
9. XSS in search, review text, CMS fields (stored + reflected).
10. SQL injection via query params (Prisma parameterized — verify no raw SQL).
11. Path traversal on media URLs.

### Business logic
12. Coupon stacking / negative quantity / price tampering in checkout payloads.
13. Flash sale after end date still discounted.
14. Wallet overdraft / double redemption of rewards.

### Infrastructure
15. Security headers present (HSTS, CSP, XFO).
16. Sensitive files not served (`.env`, Prisma schema not public).
17. CORS / host header attacks against Auth URL.

## Deliverable
Produce a short report: severity, repro, impact, remediations. Track remediations in `REMAINING_IMPROVEMENTS.md`.

# Transactional email wiring

Templates live in `emails/`. Sends go through Resend via `lib/email/send.ts`.

## House contact (footer on every template)

Sourced from `lib/storefront/contact.ts` via `emails/tokens.ts` (`emailDefaults`):

- Phone / WhatsApp: `+234 904 319 7743` (`https://wa.me/2349043197743`)
- Email: `sales@veronicamark.com`
- Address: `88 Woji Road, GRA Phase 3, Port Harcourt 500001, Rivers, Nigeria`

Contact form auto-replies (`contact.auto_reply`) also include these details in the body.

## Paired client + admin copies

Every customer-facing notification sends **two individually addressed emails**:

1. **Client** — their template, addressed to them  
2. **Super Admin only** — `sales@veronicamark.com` (or `PLATFORM_ADMIN_EMAIL`) via `admin.event` / `contact.internal_notify`

**Never** email Brand Managers or brand `contactEmail` for these platform notifications.

Admin auth copies never include verification/reset token links.

## Live send hooks

| Event | Client template | Admin (`sales@`) |
|---|---|---|
| Email verification | `auth.email_verification` | `admin.event` (no token) |
| Password reset | `auth.password_reset` | `admin.event` (no token) |
| Payment success | `order.confirmation` | `admin.event` (full order + address + lines) |
| Payment failed | `order.payment_failed` | `admin.event` |
| Packed → delivered | matching `order.*` | `admin.event` |
| Abandoned cart | `cart.abandoned_1/2` | `admin.event` |
| Contact enquiry / order support | `contact.auto_reply` | `contact.internal_notify` |
| Newsletter signup | `newsletter.welcome` | `admin.event` |

Idempotency for confirmation: `finalizePaystackPayment` returns early when already PAID.

Email failures are logged and never fail payment or fulfillment.

## Env

- `RESEND_API_KEY` — required in production
- `EMAIL_FROM` — e.g. `VERONICA MARK <sales@veronicamark.com>` (sender)
- `PLATFORM_ADMIN_EMAIL` — optional override; defaults to `sales@veronicamark.com`
- Without a key in development, sends are logged (`email.development_skip`)

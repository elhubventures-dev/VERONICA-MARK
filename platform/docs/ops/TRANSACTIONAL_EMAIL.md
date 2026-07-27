# Transactional email wiring

Templates live in `emails/`. Sends go through Resend via `lib/email/send.ts`.

## Live send hooks

| Event | Template | Hook |
|---|---|---|
| Email verification | `auth.email_verification` | `lib/auth/email.ts` |
| Password reset | `auth.password_reset` | `lib/auth/email.ts` |
| Payment success (first finalize only) | `order.confirmation` + `brand.new_order` | `finalizePaystackPayment` |
| Payment failed | `order.payment_failed` | `finalizePaystackPayment` fail branch |
| Packed / shipped / OFD / delivered | `order.packed` … `order.delivered` | `updateBrandOrderFulfillmentAction` |

Idempotency for confirmation: `finalizePaystackPayment` returns early when `payment.status === PAID`, so verify + webhook cannot double-send.

Email failures are logged and never fail payment or fulfillment.

## Env

- `RESEND_API_KEY` — required in production
- `EMAIL_FROM` — e.g. `VERONICA MARK <sales@veronicamark.com>`
- Without a key in development, sends are logged (`email.development_skip`)

# Paystack payments (P0 #1)

**Status:** Live Paystack path implemented. SquadCo deferred.  
**Provider:** Paystack only (NGN)

## Flow

1. Guest completes shipping → payment → review on `/checkout`
2. `POST /api/checkout/paystack/initialize` creates guest customer + `Order` (PENDING) + `Payment` (PENDING), then calls Paystack **Transaction Initialize**
3. Browser redirects to Paystack `authorization_url`
4. Paystack returns to `/checkout/callback?reference=…`
5. Callback calls `GET /api/checkout/paystack/verify?reference=…` → Paystack **Verify** → marks `Payment`/`Order` **PAID** → `/checkout/confirmation`
6. Paystack webhooks `POST /api/webhooks/paystack` with `x-paystack-signature` (HMAC-SHA512) also finalize idempotently

## Environment

```env
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx   # optional for redirect flow
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Paystack Dashboard

1. Set **Callback URL** (also passed per-transaction): `{APP_URL}/checkout/callback`
2. Add **Webhook URL**: `{APP_URL}/api/webhooks/paystack`
3. Subscribe at least to `charge.success`

## Code map

| Piece | Path |
| ----- | ---- |
| API client | `lib/payments/paystack.ts` |
| Checkout orchestration | `lib/payments/checkout-paystack.service.ts` |
| Initialize | `app/api/checkout/paystack/initialize/route.ts` |
| Verify | `app/api/checkout/paystack/verify/route.ts` |
| Webhook | `app/api/webhooks/paystack/route.ts` |
| Callback UI | `app/(storefront)/checkout/callback/page.tsx` |

## Notes

- Bag line items from the demo catalog are stored as a `CART_SNAPSHOT` on `Order.notes` (Prisma `OrderItem` requires real `ProductVariant` rows — full line sync is P0 #2).
- Checkout charges **NGN** via Paystack using the bag’s major-unit total (same numeric total as shown, labeled ₦ at pay time).
- Shipping (hubs: Port Harcourt / Rivers and Abuja-FCT): Intra-city ₦3,500 (Rivers or FCT) · Interstate ₦8,000 (other NG states) · Express ₦10,000 · International **$50 USD** (outside Nigeria; FX **$1 = ₦1,500**).
- International browsers see catalog prices in **USD** at the same rate; Paystack still charges NGN.
- Without `PAYSTACK_SECRET_KEY`, initialize returns **503** (no fake success).
- **Bank transfer:** Paystack verify may return `amount` = requested + fees. Matching uses `requested_amount` (not raw `amount`). If a charge succeeds but amounts still disagree, we still mark **PAID** and log/alert — never leave a charged customer stuck in PENDING.
- Confirmation emails (`order.confirmation` + admin copy) fire only after successful finalize to PAID.

## Recover a stuck paid order

If Paystack shows success but the DB is still PENDING (older amount-mismatch bug):

```bash
pnpm exec tsx --require ./scripts/register-server-only.cjs scripts/recover-paid-order.ts <paystack-reference>
```

## Test cards

Use Paystack test mode cards from their docs (e.g. successful charge `4084084084084081`).

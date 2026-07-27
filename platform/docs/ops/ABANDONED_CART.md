# Abandoned cart recovery

Daily Vercel Cron (09:00 UTC) hits `/api/cron/abandoned-cart` (see `vercel.json`). Hobby plans only allow once-per-day schedules; upgrade to Pro for hourly.

## Flow

1. Signed-in shoppers sync bag lines to Prisma via `syncCartLines` (debounced from `CartProvider`).
2. Open bags create/update an `AbandonedCart` row (email from the Auth.js session).
3. Cron sends `cart.abandoned_1` after **1 hour** idle, then `cart.abandoned_2` ~**23 hours** later.
4. Successful Paystack finalize marks the customer's abandoned carts recovered and clears server cart items.

## Auth

Set `CRON_SECRET` in the environment. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.

Local manual run (development allows missing secret):

```bash
curl http://localhost:3000/api/cron/abandoned-cart
# or
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain/api/cron/abandoned-cart
```

## Notes

- Guests using localStorage-only bags are not emailed until they authenticate (checkout requires auth).
- Push notifications are out of scope for this pass (email only).

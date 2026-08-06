# Twilio WhatsApp — order notifications

Automatic WhatsApp templates to the **customer only** after payment and shipping/delivery updates. Email remains the primary channel; WhatsApp is best-effort and never blocks checkout or fulfillment.

## When messages send

Hook: `notifyCustomerOrderStatus` → `notifyCustomerOrderWhatsApp`

| Order status | Content SID env |
|---|---|
| `PAID` | `TWILIO_CONTENT_SID_ORDER_PAID` |
| `SHIPPED` | `TWILIO_CONTENT_SID_ORDER_SHIPPED` |
| `OUT_FOR_DELIVERY` | `TWILIO_CONTENT_SID_ORDER_OUT_FOR_DELIVERY` |
| `DELIVERED` | `TWILIO_CONTENT_SID_ORDER_DELIVERED` |

Triggers: Paystack payment success, Super Admin order status changes, Brand Manager fulfillment status changes.

**Not sent:** processing, packed, cancelled, completed, refunds. No WhatsApp copy to admin (admin stays on email).

## Phone source

1. `order.shippingAddress.phone` (checkout)
2. Fallback: `User.phone`

Normalized to international digits (e.g. `0803…` → `234803…`), then sent as `whatsapp:+234803…`.

## Twilio dashboard setup

1. Create / open a Twilio account and enable **WhatsApp** (sender for `+234 904 319 7743`, or the Twilio sandbox for local tests).
2. Create four **Content templates** (WhatsApp) and submit for Meta approval. Suggested bodies (`{{1}}` …):

| Key | Body |
|---|---|
| `order_paid` | Hello {{1}}, your VERONICA MARK order {{2}} is confirmed. Total: {{3}}. Track: {{4}} |
| `order_shipped` | Hello {{1}}, order {{2}} has been shipped. Track: {{3}} |
| `order_out_for_delivery` | Hello {{1}}, order {{2}} is out for delivery. Track: {{3}} |
| `order_delivered` | Hello {{1}}, order {{2}} has been delivered. Thank you for shopping with VERONICA MARK. |

3. After approval, copy each **Content SID** (`HX…`) into env. Variable keys in `ContentVariables` are `"1"`, `"2"`, … matching `{{1}}`, `{{2}}`, …

API: `POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json` with `ContentSid` + `ContentVariables` — see [Twilio WhatsApp templates](https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates).

Status callbacks / inbound webhooks are **not required** for these outbound order messages.

## Env

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+2349043197743
TWILIO_CONTENT_SID_ORDER_PAID=
TWILIO_CONTENT_SID_ORDER_SHIPPED=
TWILIO_CONTENT_SID_ORDER_OUT_FOR_DELIVERY=
TWILIO_CONTENT_SID_ORDER_DELIVERED=
```

Without account / token / from / Content SID for a status, the send is skipped and logged. Failures never fail payment or fulfillment.

## Code map

| Path | Role |
|---|---|
| `lib/whatsapp/phone.ts` | Normalize / resolve phone |
| `lib/whatsapp/twilio.ts` | Twilio Messages API client |
| `lib/whatsapp/order-notifications.ts` | Status → Content SID + variables |
| `lib/email/order-notifications.ts` | Calls WhatsApp after email |

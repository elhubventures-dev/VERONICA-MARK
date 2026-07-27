import { PaymentProvider, WebhookStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { handlePaystackWebhookEvent } from "@/lib/payments/checkout-paystack.service";
import { isPaystackConfigured, verifyPaystackWebhookSignature } from "@/lib/payments/paystack";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { error: { code: "PAYSTACK_NOT_CONFIGURED", message: "Paystack is not configured" } },
        { status: 503 },
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!verifyPaystackWebhookSignature(rawBody, signature)) {
      logger.warn("Invalid Paystack webhook signature");
      return NextResponse.json(
        { error: { code: "INVALID_SIGNATURE", message: "Invalid signature" } },
        { status: 401 },
      );
    }

    const payload = JSON.parse(rawBody) as {
      event: string;
      data: Record<string, unknown>;
    };

    const providerEventId = String(
      payload.data.id ?? `${payload.event}_${payload.data.reference ?? Date.now()}`,
    );
    const reference = String(payload.data.reference ?? "");

    await prisma.webhookLog.create({
      data: {
        provider: "paystack",
        eventId: providerEventId,
        eventType: payload.event,
        endpoint: "/api/webhooks/paystack",
        payload: payload as object,
        requestHeaders: { "x-paystack-signature": signature },
        status: WebhookStatus.RECEIVED,
      },
    }).catch(() => undefined);

    if (reference) {
      const payment = await prisma.payment.findFirst({ where: { reference, deletedAt: null } });
      if (payment) {
        await prisma.paymentEvent
          .create({
            data: {
              paymentId: payment.id,
              provider: PaymentProvider.PAYSTACK,
              providerEventId,
              eventType: payload.event,
              payload: payload as object,
              signature: signature ?? undefined,
              status: WebhookStatus.RECEIVED,
            },
          })
          .catch(() => undefined);
      }
    }

    const result = await handlePaystackWebhookEvent(payload);

    await prisma.webhookLog
      .updateMany({
        where: { provider: "paystack", eventId: providerEventId },
        data: {
          status: WebhookStatus.PROCESSED,
          processedAt: new Date(),
          statusCode: 200,
          responseBody: result as object,
        },
      })
      .catch(() => undefined);

    if (reference) {
      await prisma.paymentEvent
        .updateMany({
          where: { provider: PaymentProvider.PAYSTACK, providerEventId },
          data: { status: WebhookStatus.PROCESSED, processedAt: new Date() },
        })
        .catch(() => undefined);
    }

    return NextResponse.json({ received: true, result });
  } catch (error) {
    logger.error({ err: error }, "Paystack webhook failed");
    const { statusCode, body } = toErrorResponse(error);
    return NextResponse.json(body, { status: statusCode });
  }
}

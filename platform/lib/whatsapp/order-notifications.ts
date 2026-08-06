import "server-only";

import { OrderStatus } from "@prisma/client";

import {
  buildOrderEmailVars,
  formatOrderMoney,
  resolveOrderRecipient,
} from "@/lib/email/order-email-vars";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";
import { absoluteUrl } from "@/lib/seo/metadata";
import { resolveOrderWhatsAppPhone } from "@/lib/whatsapp/phone";
import { getTwilioWhatsAppConfig, sendTwilioWhatsAppTemplate } from "@/lib/whatsapp/twilio";

/** Statuses that trigger customer WhatsApp templates (payment + shipping/delivery). */
export const WHATSAPP_ORDER_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.SHIPPED,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
] as const;

export type WhatsAppOrderStatus = (typeof WHATSAPP_ORDER_STATUSES)[number];

export function isWhatsAppOrderStatus(status: OrderStatus): status is WhatsAppOrderStatus {
  return (WHATSAPP_ORDER_STATUSES as readonly OrderStatus[]).includes(status);
}

/** Twilio ContentSid (HX…) for each order WhatsApp template. */
export function resolveWhatsAppContentSid(status: OrderStatus): string | null {
  switch (status) {
    case OrderStatus.PAID:
      return env.server.TWILIO_CONTENT_SID_ORDER_PAID?.trim() || null;
    case OrderStatus.SHIPPED:
      return env.server.TWILIO_CONTENT_SID_ORDER_SHIPPED?.trim() || null;
    case OrderStatus.OUT_FOR_DELIVERY:
      return env.server.TWILIO_CONTENT_SID_ORDER_OUT_FOR_DELIVERY?.trim() || null;
    case OrderStatus.DELIVERED:
      return env.server.TWILIO_CONTENT_SID_ORDER_DELIVERED?.trim() || null;
    default:
      return null;
  }
}

/** @deprecated Use resolveWhatsAppContentSid */
export const resolveWhatsAppTemplateId = resolveWhatsAppContentSid;

/**
 * Numbered keys match Twilio ContentVariables / WhatsApp {{1}}, {{2}}, …
 * - paid: 1=name, 2=orderNumber, 3=total, 4=trackUrl
 * - shipped / out_for_delivery: 1=name, 2=orderNumber, 3=trackUrl
 * - delivered: 1=name, 2=orderNumber
 */
export function buildWhatsAppTemplateData(
  status: WhatsAppOrderStatus,
  vars: {
    recipientName?: string;
    orderNumber: string;
    orderTotalLabel?: string;
    trackingUrl?: string;
  },
): Record<string, string> {
  const name = vars.recipientName?.trim() || "there";
  const track = vars.trackingUrl || absoluteUrl("/track-order");

  switch (status) {
    case OrderStatus.PAID:
      return {
        "1": name,
        "2": vars.orderNumber,
        "3": vars.orderTotalLabel || formatOrderMoney(0),
        "4": track,
      };
    case OrderStatus.SHIPPED:
    case OrderStatus.OUT_FOR_DELIVERY:
      return {
        "1": name,
        "2": vars.orderNumber,
        "3": track,
      };
    case OrderStatus.DELIVERED:
      return {
        "1": name,
        "2": vars.orderNumber,
      };
  }
}

/**
 * Best-effort WhatsApp to the customer only. Never throws.
 */
export async function notifyCustomerOrderWhatsApp(
  order: OrderWithRelations,
  status: OrderStatus,
): Promise<void> {
  if (!isWhatsAppOrderStatus(status)) return;

  const contentSid = resolveWhatsAppContentSid(status);
  if (!contentSid) {
    if (getTwilioWhatsAppConfig()) {
      logger.warn(
        { orderNumber: order.orderNumber, status },
        "order.whatsapp.missing_template_id",
      );
    }
    return;
  }

  const phone = resolveOrderWhatsAppPhone(order);
  if (!phone) {
    logger.warn({ orderNumber: order.orderNumber, status }, "order.whatsapp.missing_phone");
    return;
  }

  const { name } = resolveOrderRecipient(order);
  const emailVars = buildOrderEmailVars(order);
  const variables = buildWhatsAppTemplateData(status, {
    recipientName: name,
    orderNumber: order.orderNumber,
    orderTotalLabel: emailVars.orderTotalLabel,
    trackingUrl: emailVars.trackingUrl,
  });

  await sendTwilioWhatsAppTemplate({
    phoneNumber: phone,
    contentSid,
    variables,
    context: { orderNumber: order.orderNumber, status },
  });
}

import "server-only";

import { OrderStatus } from "@prisma/client";

import type { OrderEmailVars } from "@/emails/types";
import { notifyAdminEvent } from "@/lib/email/admin";
import {
  buildOrderAdminDetails,
  buildOrderEmailVars,
  buildOrderLineItems,
  resolveOrderRecipient,
} from "@/lib/email/order-email-vars";
import { sendTemplateEmail } from "@/lib/email/send";
import { logger } from "@/lib/logger";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";
import { absoluteUrl } from "@/lib/seo/metadata";
import { notifyCustomerOrderWhatsApp } from "@/lib/whatsapp/order-notifications";

export {
  buildOrderAdminDetails,
  buildOrderEmailVars,
  formatOrderMoney,
  resolveOrderRecipient,
} from "@/lib/email/order-email-vars";

const STATUS_EMAIL_MAP: Partial<
  Record<
    OrderStatus,
    | "order.confirmation"
    | "order.processing"
    | "order.packed"
    | "order.shipped"
    | "order.out_for_delivery"
    | "order.delivered"
    | "order.cancelled"
    | "order.completed"
  >
> = {
  [OrderStatus.PAID]: "order.confirmation",
  [OrderStatus.PROCESSING]: "order.processing",
  [OrderStatus.PACKED]: "order.packed",
  [OrderStatus.SHIPPED]: "order.shipped",
  [OrderStatus.OUT_FOR_DELIVERY]: "order.out_for_delivery",
  [OrderStatus.DELIVERED]: "order.delivered",
  [OrderStatus.CANCELLED]: "order.cancelled",
  [OrderStatus.COMPLETED]: "order.completed",
};

const STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.PAID]: "Paid · order confirmation",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.PACKED]: "Packed",
  [OrderStatus.SHIPPED]: "Shipped",
  [OrderStatus.OUT_FOR_DELIVERY]: "Out for delivery",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.COMPLETED]: "Completed",
};

/**
 * Client + admin individually addressed copies for an order status transition.
 * Never throws — payment/fulfillment must not fail because mail failed.
 */
export async function notifyCustomerOrderStatus(
  order: OrderWithRelations,
  status: OrderStatus,
  extras: Partial<OrderEmailVars> = {},
): Promise<void> {
  const templateKey = STATUS_EMAIL_MAP[status];
  if (!templateKey) return;

  const { email, name } = resolveOrderRecipient(order);
  const vars = buildOrderEmailVars(order, extras);
  const statusLabel = STATUS_LABEL[status] || status;

  if (email) {
    try {
      await sendTemplateEmail(templateKey, email, vars);
    } catch (error) {
      logger.error(
        { err: error, orderNumber: order.orderNumber, status, templateKey },
        "order.email.send_failed",
      );
    }
  } else {
    logger.warn({ orderNumber: order.orderNumber, status }, "order.email.missing_recipient");
  }

  try {
    await notifyCustomerOrderWhatsApp(order, status);
  } catch (error) {
    logger.error(
      { err: error, orderNumber: order.orderNumber, status },
      "order.whatsapp.send_failed",
    );
  }

  await notifyAdminEvent({
    clientEmail: email,
    eventTitle: `Order ${statusLabel} · ${order.orderNumber}`,
    summary: `${name || "A customer"} · ${email || "no email"} · ${vars.orderTotalLabel || ""}`.trim(),
    details: buildOrderAdminDetails(order, { statusLabel }),
    items: buildOrderLineItems(order),
    ctaUrl: absoluteUrl(`/admin/orders/${order.orderNumber}`),
    ctaLabel: "View order in admin",
  });
}

export async function notifyCustomerPaymentFailed(
  order: OrderWithRelations,
  reason?: string,
): Promise<void> {
  const { email, name } = resolveOrderRecipient(order);
  const vars = buildOrderEmailVars(order, {
    cancelReason: reason,
    ctaUrl: absoluteUrl("/checkout"),
  });

  if (email) {
    try {
      await sendTemplateEmail("order.payment_failed", email, vars);
    } catch (error) {
      logger.error(
        { err: error, orderNumber: order.orderNumber },
        "order.payment_failed.send_failed",
      );
    }
  } else {
    logger.warn({ orderNumber: order.orderNumber }, "order.payment_failed.missing_recipient");
  }

  await notifyAdminEvent({
    clientEmail: email,
    eventTitle: `Payment failed · ${order.orderNumber}`,
    summary: `Payment was not completed for ${name || "a customer"} (${email || "no email"}).`,
    details: buildOrderAdminDetails(order, {
      statusLabel: "Payment failed",
      paymentNote: reason,
    }),
    items: buildOrderLineItems(order),
    ctaUrl: absoluteUrl(`/admin/orders/${order.orderNumber}`),
    ctaLabel: "View order in admin",
  });
}

import "server-only";

import { OrderStatus } from "@prisma/client";

import type { OrderEmailVars } from "@/emails/types";
import {
  buildOrderEmailVars,
  formatOrderMoney,
  resolveOrderRecipient,
} from "@/lib/email/order-email-vars";
import { sendTemplateEmail } from "@/lib/email/send";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";
import { absoluteUrl } from "@/lib/seo/metadata";

export { buildOrderEmailVars, formatOrderMoney, resolveOrderRecipient } from "@/lib/email/order-email-vars";

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

/**
 * Best-effort customer email for an order status transition.
 * Never throws — payment/fulfillment must not fail because mail failed.
 */
export async function notifyCustomerOrderStatus(
  order: OrderWithRelations,
  status: OrderStatus,
  extras: Partial<OrderEmailVars> = {},
): Promise<void> {
  const templateKey = STATUS_EMAIL_MAP[status];
  if (!templateKey) return;

  const { email } = resolveOrderRecipient(order);
  if (!email) {
    logger.warn({ orderNumber: order.orderNumber, status }, "order.email.missing_recipient");
    return;
  }

  try {
    const vars = buildOrderEmailVars(order, extras);
    await sendTemplateEmail(templateKey, email, vars);
  } catch (error) {
    logger.error(
      { err: error, orderNumber: order.orderNumber, status, templateKey },
      "order.email.send_failed",
    );
  }
}

export async function notifyCustomerPaymentFailed(
  order: OrderWithRelations,
  reason?: string,
): Promise<void> {
  const { email } = resolveOrderRecipient(order);
  if (!email) {
    logger.warn({ orderNumber: order.orderNumber }, "order.payment_failed.missing_recipient");
    return;
  }

  try {
    await sendTemplateEmail(
      "order.payment_failed",
      email,
      buildOrderEmailVars(order, {
        cancelReason: reason,
        ctaUrl: absoluteUrl("/checkout"),
      }),
    );
  } catch (error) {
    logger.error(
      { err: error, orderNumber: order.orderNumber },
      "order.payment_failed.send_failed",
    );
  }
}

/**
 * Notify brand managers (and brand contactEmail fallback) about a newly paid order.
 */
export async function notifyBrandManagersNewOrder(order: OrderWithRelations): Promise<void> {
  const brandIds = [
    ...new Set(
      order.items
        .map((item) => item.variant?.product?.brandId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  if (!brandIds.length) return;

  try {
    const managers = await prisma.brandManagerProfile.findMany({
      where: { brandId: { in: brandIds }, deletedAt: null },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        brand: { select: { id: true, name: true, contactEmail: true } },
      },
    });

    const sent = new Set<string>();

    for (const manager of managers) {
      const to = manager.user.email?.trim().toLowerCase();
      if (!to || sent.has(to)) continue;
      sent.add(to);

      await sendTemplateEmail("brand.new_order", to, {
        recipientName:
          [manager.user.firstName, manager.user.lastName].filter(Boolean).join(" ") || undefined,
        brandName: manager.brand.name,
        orderNumber: order.orderNumber,
        orderTotalLabel: formatOrderMoney(Number(order.total), order.currency),
        appUrl: absoluteUrl("/").replace(/\/$/, ""),
        ctaUrl: absoluteUrl(`/brand/orders/${order.orderNumber}`),
      });
    }

    const brands = await prisma.brand.findMany({
      where: { id: { in: brandIds }, deletedAt: null },
      select: { id: true, name: true, contactEmail: true },
    });

    for (const brand of brands) {
      const to = brand.contactEmail?.trim().toLowerCase();
      if (!to || sent.has(to)) continue;
      const hasManager = managers.some((m) => m.brandId === brand.id);
      if (hasManager) continue;
      sent.add(to);

      await sendTemplateEmail("brand.new_order", to, {
        brandName: brand.name,
        orderNumber: order.orderNumber,
        orderTotalLabel: formatOrderMoney(Number(order.total), order.currency),
        appUrl: absoluteUrl("/").replace(/\/$/, ""),
        ctaUrl: absoluteUrl(`/brand/orders/${order.orderNumber}`),
      });
    }
  } catch (error) {
    logger.error(
      { err: error, orderNumber: order.orderNumber },
      "brand.new_order.send_failed",
    );
  }
}

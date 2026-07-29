"use server";

import { z } from "zod";

import type { OrderTimelineEvent } from "@/components/commerce/order-timeline";
import type { OrderStatus as UiOrderStatus } from "@/components/commerce/order-status-badge";
import {
  buildTrackingTimeline,
  normalizeOrderReference,
  normalizeTrackingEmail,
  orderEmailMatches,
  toUiTrackingStatus,
} from "@/lib/commerce/order-tracking";
import { logger } from "@/lib/logger";
import { orderRepository } from "@/lib/repositories/order.repository";
import { storefrontContact } from "@/lib/storefront/contact";

export type TrackOrderResult =
  | {
      ok: true;
      order: {
        orderNumber: string;
        status: UiOrderStatus;
        placedAtLabel: string;
        itemCount: number;
        trackingNumber?: string;
        timeline: OrderTimelineEvent[];
      };
    }
  | { ok: false; message: string };

const trackSchema = z.object({
  orderNumber: z.string().trim().min(1).max(64),
  email: z.string().trim().email().max(254),
});

const NOT_FOUND_MESSAGE = `We couldn’t find a matching order. Check your details or contact client services on ${storefrontContact.phone}.`;

/**
 * Public guest tracking — requires order reference + checkout email.
 * Same not-found copy whether the order is missing or the email does not match.
 */
export async function trackOrderAction(input: {
  orderNumber: string;
  email: string;
}): Promise<TrackOrderResult> {
  try {
    const parsed = trackSchema.parse({
      orderNumber: normalizeOrderReference(input.orderNumber),
      email: normalizeTrackingEmail(input.email),
    });

    const order = await orderRepository.findByOrderNumber(parsed.orderNumber);
    if (!order) {
      return { ok: false, message: NOT_FOUND_MESSAGE };
    }

    if (!orderEmailMatches(parsed.email, order.customer?.user?.email, order.shippingAddress)) {
      return { ok: false, message: NOT_FOUND_MESSAGE };
    }

    const placedAt = order.placedAt ?? order.createdAt;
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const trackingNumber = order.shipments.find((s) => s.trackingNumber)?.trackingNumber ?? undefined;

    return {
      ok: true,
      order: {
        orderNumber: order.orderNumber,
        status: toUiTrackingStatus(order.status),
        placedAtLabel: placedAt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        itemCount,
        trackingNumber,
        timeline: buildTrackingTimeline(order.status, order.statusHistory ?? [], placedAt),
      },
    };
  } catch (error) {
    logger.warn({ err: error }, "track_order.failed");
    if (error instanceof z.ZodError) {
      return { ok: false, message: "Enter both your order reference and a valid email address." };
    }
    return {
      ok: false,
      message: `We could not look up your order right now. Please try again or call ${storefrontContact.phone}.`,
    };
  }
}

/**
 * Guest order tracking helpers — status timeline and email gate matching.
 */

import type { OrderStatus } from "@prisma/client";

import type { OrderTimelineEvent } from "@/components/commerce/order-timeline";
import type { OrderStatus as UiOrderStatus } from "@/components/commerce/order-status-badge";

export type TrackingStatusHistoryEntry = {
  toStatus: OrderStatus;
  createdAt: Date;
};

const FULFILLMENT_STEPS: Array<{
  id: string;
  title: string;
  description: string;
  statuses: OrderStatus[];
}> = [
  {
    id: "confirmed",
    title: "Order confirmed",
    description: "Payment received and your order is with us.",
    statuses: ["PENDING", "CONFIRMED", "PAID"],
  },
  {
    id: "processing",
    title: "Preparing",
    description: "Your selection is being carefully assembled.",
    statuses: ["PROCESSING"],
  },
  {
    id: "packed",
    title: "Packed",
    description: "Your order is packed and ready for dispatch.",
    statuses: ["PACKED"],
  },
  {
    id: "shipped",
    title: "Dispatched",
    description: "Your order has left our care.",
    statuses: ["SHIPPED"],
  },
  {
    id: "out_for_delivery",
    title: "Out for delivery",
    description: "Your parcel is on its final leg to you.",
    statuses: ["OUT_FOR_DELIVERY"],
  },
  {
    id: "delivered",
    title: "Delivered",
    description: "Marked as delivered.",
    statuses: ["DELIVERED", "COMPLETED"],
  },
];

const TERMINAL_NEGATIVE: OrderStatus[] = ["CANCELLED", "REFUND_REQUESTED", "REFUNDED"];

function stepIndexForStatus(status: OrderStatus): number {
  const idx = FULFILLMENT_STEPS.findIndex((step) => step.statuses.includes(status));
  return idx >= 0 ? idx : 0;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function historyTimestamp(
  history: TrackingStatusHistoryEntry[],
  statuses: OrderStatus[],
  fallback?: Date,
): string | undefined {
  const match = [...history].reverse().find((h) => statuses.includes(h.toStatus));
  const at = match?.createdAt ?? fallback;
  return at ? formatTimestamp(at) : undefined;
}

/** Build a public fulfillment timeline for the track-order page. */
export function buildTrackingTimeline(
  status: OrderStatus,
  history: TrackingStatusHistoryEntry[],
  placedAt: Date,
): OrderTimelineEvent[] {
  if (TERMINAL_NEGATIVE.includes(status)) {
    const label =
      status === "CANCELLED"
        ? "Order cancelled"
        : status === "REFUNDED"
          ? "Refunded"
          : "Refund requested";
    return [
      {
        id: "confirmed",
        title: "Order confirmed",
        timestamp: formatTimestamp(placedAt),
        status: "complete",
      },
      {
        id: status.toLowerCase(),
        title: label,
        timestamp: historyTimestamp(history, [status], placedAt),
        status: "current",
      },
    ];
  }

  const currentIdx = stepIndexForStatus(status);

  return FULFILLMENT_STEPS.map((step, index) => {
    let eventStatus: OrderTimelineEvent["status"];
    if (index < currentIdx) eventStatus = "complete";
    else if (index === currentIdx) eventStatus = "current";
    else eventStatus = "upcoming";

    const timestamp =
      index === 0
        ? formatTimestamp(placedAt)
        : eventStatus === "upcoming"
          ? undefined
          : historyTimestamp(history, step.statuses);

    return {
      id: step.id,
      title: step.title,
      description: eventStatus === "upcoming" ? undefined : step.description,
      timestamp,
      status: eventStatus,
    };
  });
}

export function toUiTrackingStatus(status: OrderStatus): UiOrderStatus {
  return status.toLowerCase() as UiOrderStatus;
}

export function normalizeOrderReference(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeTrackingEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** True when the submitted email matches the order customer or shipping address email. */
export function orderEmailMatches(
  submittedEmail: string,
  customerEmail: string | null | undefined,
  shippingAddress: unknown,
): boolean {
  const target = normalizeTrackingEmail(submittedEmail);
  if (!target) return false;

  const customer = customerEmail ? normalizeTrackingEmail(customerEmail) : "";
  if (customer && customer === target) return true;

  const addr = (shippingAddress ?? {}) as Record<string, unknown>;
  const shippingEmail =
    typeof addr.email === "string" ? normalizeTrackingEmail(addr.email) : "";
  return Boolean(shippingEmail && shippingEmail === target);
}

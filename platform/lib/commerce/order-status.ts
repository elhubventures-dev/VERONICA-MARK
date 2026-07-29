import { OrderStatus } from "@prisma/client";

import type { OrderStatus as UiOrderStatus } from "@/components/commerce/order-status-badge";
import type { UiOrderStatus as ValidatedUiOrderStatus } from "@/lib/validations/order-edit";

export const UI_ORDER_STATUSES: ValidatedUiOrderStatus[] = [
  "pending",
  "confirmed",
  "paid",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "refund_requested",
  "refunded",
];

const UI_TO_PRISMA: Record<ValidatedUiOrderStatus, OrderStatus> = {
  pending: OrderStatus.PENDING,
  confirmed: OrderStatus.CONFIRMED,
  paid: OrderStatus.PAID,
  processing: OrderStatus.PROCESSING,
  packed: OrderStatus.PACKED,
  shipped: OrderStatus.SHIPPED,
  out_for_delivery: OrderStatus.OUT_FOR_DELIVERY,
  delivered: OrderStatus.DELIVERED,
  completed: OrderStatus.COMPLETED,
  cancelled: OrderStatus.CANCELLED,
  refund_requested: OrderStatus.REFUND_REQUESTED,
  refunded: OrderStatus.REFUNDED,
};

export function toPrismaOrderStatus(status: string): OrderStatus {
  const key = status.toLowerCase() as ValidatedUiOrderStatus;
  const mapped = UI_TO_PRISMA[key];
  if (!mapped) {
    throw new Error(`Unknown order status: ${status}`);
  }
  return mapped;
}

export function toUiOrderStatus(status: OrderStatus | string): UiOrderStatus {
  return status.toLowerCase() as UiOrderStatus;
}

export function formatOrderStatusLabel(status: string): string {
  return status.replaceAll("_", " ");
}

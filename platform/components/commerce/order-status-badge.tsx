/**
 * @file OrderStatusBadge — semantic status label for order lifecycle states.
 * Maps SRS 12-state fulfillment flow to design system badge variants.
 */

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Aligns with Prisma `OrderStatus` (Stage 3 SRS resolution). */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refund_requested"
  | "refunded";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "accent" | "success" | "warning" | "error" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  paid: { label: "Paid", variant: "accent" },
  processing: { label: "Processing", variant: "secondary" },
  packed: { label: "Packed", variant: "secondary" },
  shipped: { label: "Shipped", variant: "accent" },
  out_for_delivery: { label: "Out for delivery", variant: "accent" },
  delivered: { label: "Delivered", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
  refund_requested: { label: "Refund requested", variant: "warning" },
  refunded: { label: "Refunded", variant: "warning" },
};

export interface OrderStatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: OrderStatus;
  label?: string;
}

export function OrderStatusBadge({ className, status, label, ...props }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={cn("rounded-lg", className)} {...props}>
      {label ?? config.label}
    </Badge>
  );
}

export function toOrderStatusBadge(status: string): OrderStatus {
  const normalized = status.toLowerCase() as OrderStatus;
  if (normalized in statusConfig) {
    return normalized;
  }
  return "pending";
}

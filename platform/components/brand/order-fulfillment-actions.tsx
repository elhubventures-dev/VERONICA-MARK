"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  OrderStatusBadge,
  type OrderStatus,
} from "@/components/commerce/order-status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { updateBrandOrderFulfillmentAction } from "@/lib/brand/actions";

type OrderFulfillmentActionsProps = {
  orderNumber: string;
  initialStatus: OrderStatus;
};

type FulfillmentAction = "packed" | "shipped" | "out_for_delivery" | "delivered";

const packableStatuses: OrderStatus[] = ["confirmed", "paid", "processing"];

export function OrderFulfillmentActions({
  orderNumber,
  initialStatus,
}: OrderFulfillmentActionsProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<OrderStatus>(initialStatus);
  const [pendingAction, setPendingAction] = React.useState<FulfillmentAction | null>(null);

  React.useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const canMarkPacked = packableStatuses.includes(status);
  const canMarkShipped = status === "packed";
  const canMarkOutForDelivery = status === "shipped";
  const canMarkDelivered = status === "out_for_delivery";

  async function runAction(nextStatus: FulfillmentAction) {
    setPendingAction(nextStatus);
    const previous = status;

    const result = await updateBrandOrderFulfillmentAction({
      orderNumber,
      status: nextStatus,
    });

    if (!result.ok) {
      setStatus(previous);
      toast.error(result.message);
    } else {
      setStatus(nextStatus);
      toast.success(result.message);
      router.refresh();
    }
    setPendingAction(null);
  }

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Fulfillment actions</h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Advance packing and shipping for orders that include your brand&apos;s products.
            Customers receive a status email at each step.
          </p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!canMarkPacked || pendingAction !== null}
          onClick={() => void runAction("packed")}
        >
          {pendingAction === "packed" ? "Marking packed..." : "Mark packed"}
        </Button>
        <Button
          type="button"
          disabled={!canMarkShipped || pendingAction !== null}
          onClick={() => void runAction("shipped")}
        >
          {pendingAction === "shipped" ? "Marking shipped..." : "Mark shipped"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canMarkOutForDelivery || pendingAction !== null}
          onClick={() => void runAction("out_for_delivery")}
        >
          {pendingAction === "out_for_delivery" ? "Updating..." : "Out for delivery"}
        </Button>
        <Button
          type="button"
          disabled={!canMarkDelivered || pendingAction !== null}
          onClick={() => void runAction("delivered")}
        >
          {pendingAction === "delivered" ? "Updating..." : "Mark delivered"}
        </Button>
      </div>

      <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
        Actions are brand-scoped: only orders with your SKUs can be updated.
      </p>
    </section>
  );
}

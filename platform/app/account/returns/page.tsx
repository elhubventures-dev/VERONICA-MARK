import type { Metadata } from "next";
import Link from "next/link";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { ReturnStatusBadge } from "@/components/account/return-status-badge";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAccountOrders, getAccountReturns } from "@/lib/account/queries";

type AccountReturnsPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export const metadata: Metadata = {
  title: "Returns",
  description: "Track your VERONICA MARK return requests and start a new one from eligible orders.",
};

function formatRequestedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountReturnsPage({
  searchParams,
}: AccountReturnsPageProps) {
  const [{ order: orderQuery }, returns, orders] = await Promise.all([
    searchParams,
    getAccountReturns(),
    getAccountOrders(),
  ]);

  const returnedOrderNumbers = new Set(returns.map((entry) => entry.orderNumber));
  const eligibleOrders = orders.filter(
    (order) =>
      ["delivered", "completed"].includes(order.status) &&
      !returnedOrderNumbers.has(order.orderNumber),
  );
  const selectedOrder =
    eligibleOrders.find((order) => order.orderNumber === orderQuery) ?? eligibleOrders[0] ?? null;
  const selectedOrderItemCount = selectedOrder
    ? selectedOrder.items.reduce((count, item) => count + item.quantity, 0)
    : 0;
  const selectedReturnHref = selectedOrder
    ? `mailto:concierge@veronicamark.com?subject=${encodeURIComponent(`Return request ${selectedOrder.orderNumber}`)}&body=${encodeURIComponent(
        `Hello VERONICA MARK,\n\nI would like to request a return for order ${selectedOrder.orderNumber}.\n\nThank you.`,
      )}`
    : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Returns"
        description="Review refund progress, open each return in detail, and start a new request from an eligible delivered order."
        actions={
          <Button asChild variant="outline">
            <Link href="/account/orders">Review orders</Link>
          </Button>
        }
      />

      {selectedOrder ? (
        <section
          id="start-return"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl">Start a return</h2>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Select an eligible order below, then open a pre-filled return request to concierge.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={selectedOrder.status} />
              <Badge variant="outline" className="rounded-lg">
                Eligible order
              </Badge>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-2">
              <Label htmlFor="return-order-number">Selected order number</Label>
              <Input
                id="return-order-number"
                value={selectedOrder.orderNumber}
                readOnly
                aria-readonly="true"
              />
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {selectedOrderItemCount} item{selectedOrderItemCount === 1 ? "" : "s"} in this eligible order.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href={`/account/orders/${selectedOrder.orderNumber}`}>Review order</Link>
              </Button>
              {selectedReturnHref ? (
                <Button asChild>
                  <a href={selectedReturnHref}>Request return</a>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {eligibleOrders.map((order) => {
              const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

              return (
                <article
                  key={order.orderNumber}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                        Delivered order with {itemCount} item{itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Price amount={order.total} currency={order.currency} size="sm" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/account/returns?order=${encodeURIComponent(order.orderNumber)}#start-return`}>
                        Select order
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/account/orders/${order.orderNumber}`}>View order</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {returns.length ? (
        <section aria-label="Return requests" className="space-y-4">
          {returns.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                    Return {entry.id}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    Order {entry.orderNumber} · Requested {formatRequestedAt(entry.requestedAt)}
                  </p>
                </div>
                <ReturnStatusBadge status={entry.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{entry.reason}</p>
                  <div className="mt-1">
                    <Price amount={entry.refundAmount} currency={entry.currency} size="sm" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/account/orders/${entry.orderNumber}`}>Order details</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/account/returns/${entry.id}`}>View return</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : eligibleOrders.length ? (
        <section className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10">
          <h2 className="font-display text-2xl">No active returns</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted-foreground)]">
            You do not have any submitted returns yet, but one or more eligible orders can still be requested above.
          </p>
        </section>
      ) : (
        <AccountEmptyState
          title="No returns to manage"
          description="When you request a return, the approval and refund progress will appear here. Delivered orders eligible for return will also show on this page."
          actionLabel="View delivered orders"
          actionHref="/account/orders"
        />
      )}
    </div>
  );
}

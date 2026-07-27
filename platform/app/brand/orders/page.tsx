import type { Metadata } from "next";
import Link from "next/link";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandOrders } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Orders",
  description: "Review brand-scoped orders, monitor statuses, and open fulfillment details.",
};

function formatPlacedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function BrandOrdersPage() {
  const orders = await getBrandOrders();
  const sortedOrders = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Manager"
        title="Orders"
        description="Track brand-scoped demand, monitor fulfillment states, and jump straight into each order."
        actions={
          <Button asChild variant="outline">
            <Link href="/brand/customers">View customers</Link>
          </Button>
        }
      />

      {sortedOrders.length ? (
        <section aria-label="Brand orders list" className="space-y-4">
          {sortedOrders.map((order) => (
            <article
              key={order.orderNumber}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)] transition-colors hover:bg-[var(--color-muted)]/20"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/brand/orders/${order.orderNumber}`}
                      className="font-display text-xl hover:text-[var(--color-primary)]"
                    >
                      {order.orderNumber}
                    </Link>
                    <OrderStatusBadge status={order.status} />
                    <Badge variant="outline">{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</Badge>
                  </div>
                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-3">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Customer:</span>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Email:</span>{" "}
                      {order.customerEmail}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Placed:</span>{" "}
                      {formatPlacedAt(order.placedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                  <Price amount={order.total} currency={order.currency} size="lg" />
                  <Button asChild>
                    <Link href={`/brand/orders/${order.orderNumber}`}>Open order</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <BrandEmptyState
          title="No brand orders yet"
          description="As soon as customers place orders for your managed assortment, they will appear here with fulfillment-ready detail views."
        />
      )}
    </div>
  );
}

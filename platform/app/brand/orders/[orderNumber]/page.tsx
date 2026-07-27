import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderFulfillmentActions } from "@/components/brand/order-fulfillment-actions";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandOrder } from "@/lib/brand/queries";

type BrandOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({
  params,
}: BrandOrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Brand Order ${orderNumber}`,
    description: `View line items and fulfillment actions for brand order ${orderNumber}.`,
  };
}

function formatPlacedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function BrandOrderDetailPage({
  params,
}: BrandOrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getBrandOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Manager"
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatPlacedAt(order.placedAt)} by ${order.customerName}.`}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/brand/orders">Back to orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/brand/customers">Customer list</Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_22rem]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Current status</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={order.status} />
                <Badge variant="outline">{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</Badge>
              </div>
            </div>
            <Price amount={order.total} currency={order.currency} size="lg" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Customer</p>
              <p className="mt-1 font-medium">{order.customerName}</p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{order.customerEmail}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Brand scope</p>
              <p className="mt-1 font-medium">Managed commerce view</p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                This order detail is limited to the current brand workspace.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl">Order summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Subtotal</dt>
                <dd>
                  <Price amount={subtotal} currency={order.currency} size="sm" />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Items</dt>
                <dd>{order.itemCount}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-3">
                <dt className="font-medium">Total</dt>
                <dd>
                  <Price amount={order.total} currency={order.currency} size="md" />
                </dd>
              </div>
            </dl>
          </section>

          <OrderFulfillmentActions orderNumber={order.orderNumber} initialStatus={order.status} />
        </aside>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Items</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Review each SKU included in this order before moving it through fulfillment.
            </p>
          </div>
          <Badge variant="outline">Brand-scoped line items</Badge>
        </div>

        <div className="mt-6 space-y-4">
          {order.items.map((item, index) => {
            const lineTotal = item.unitPrice * item.quantity;

            return (
              <article
                key={`${item.title}-${index}`}
                className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    {item.variant} · Qty {item.quantity}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    Unit price <Price amount={item.unitPrice} currency={order.currency} size="sm" />
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-[var(--color-muted-foreground)]">Line total</p>
                  <Price amount={lineTotal} currency={order.currency} size="md" />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAccountOrder } from "@/lib/account/queries";

type AccountOrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({
  params,
}: AccountOrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    description: `View tracking, items, and delivery details for order ${orderNumber}.`,
  };
}

function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getAccountOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);
  const invoiceHref = `/account/invoices/${order.orderNumber}`;
  const canRequestReturn = ["delivered", "completed"].includes(order.status);
  const trackingHref = order.trackingNumber
    ? `https://www.17track.net/en/track#nums=${encodeURIComponent(order.trackingNumber)}`
    : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${formatLongDate(order.placedAt)} with ${itemCount} item${itemCount === 1 ? "" : "s"}.`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/account/orders">Back to orders</Link>
            </Button>
            <Button asChild>
              <Link href={invoiceHref}>Open invoice</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Current status</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={order.status} />
                <Badge variant="outline" className="rounded-lg">
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </Badge>
                {order.trackingNumber ? (
                  <Badge variant="outline" className="rounded-lg">
                    Tracking {order.trackingNumber}
                  </Badge>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {trackingHref ? (
                <Button asChild variant="outline">
                  <a href={trackingHref} target="_blank" rel="noreferrer">
                    Track parcel
                  </a>
                </Button>
              ) : null}
              {canRequestReturn ? (
                <Button asChild variant="outline">
                  <Link href={`/account/returns?order=${encodeURIComponent(order.orderNumber)}`}>
                    Request return
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <ol className="mt-6 space-y-4">
            {order.timeline.map((step, index) => (
              <li key={`${step.label}-${index}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={[
                      "mt-1 block size-3 rounded-full border",
                      step.done
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-muted)]",
                    ].join(" ")}
                    aria-hidden
                  />
                  {index < order.timeline.length - 1 ? (
                    <span className="mt-2 block w-px flex-1 bg-[var(--color-border)]" aria-hidden />
                  ) : null}
                </div>
                <div className="pb-4">
                  <p className="font-medium">{step.label}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{step.at}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl">Order total</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Subtotal</dt>
                <dd>
                  <Price amount={order.subtotal} currency={order.currency} size="sm" />
                </dd>
              </div>
              {order.discount > 0 ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[var(--color-muted-foreground)]">Discount</dt>
                  <dd>
                    <Price amount={-order.discount} currency={order.currency} size="sm" />
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Shipping</dt>
                <dd>
                  <Price amount={order.shipping} currency={order.currency} size="sm" />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Tax</dt>
                <dd>
                  <Price amount={order.tax} currency={order.currency} size="sm" />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-3">
                <dt className="font-medium">Total</dt>
                <dd>
                  <Price amount={order.total} currency={order.currency} size="lg" />
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl">Shipping address</h2>
            <address className="mt-4 space-y-1 text-sm not-italic text-[var(--color-muted-foreground)]">
              <p className="font-medium text-[var(--color-foreground)]">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2">{order.email}</p>
            </address>
          </section>
        </aside>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Items in this order</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Review each fragrance and jump back to its product page.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={invoiceHref}>Invoice details</Link>
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {order.items.map((item, index) => {
            const lineTotal = item.unitPrice * item.quantity;
            const content = (
              <>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-muted)]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                    {item.brand}
                  </p>
                  <p className="mt-1 font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    {item.variant} · Qty {item.quantity}
                  </p>
                </div>
                <div className="sm:text-right">
                  <Price amount={lineTotal} currency={order.currency} size="md" />
                </div>
              </>
            );

            return item.productSlug ? (
              <Link
                key={`${item.title}-${index}`}
                href={`/products/${item.productSlug}`}
                className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-muted)] sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
              >
                {content}
              </Link>
            ) : (
              <article
                key={`${item.title}-${index}`}
                className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Need help with this order?</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Use your invoice, tracking, or returns tools first. If something still looks off, our concierge team can help.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={invoiceHref}>View invoice</Link>
            </Button>
            <Button asChild>
              <a href={`mailto:concierge@veronicamark.com?subject=${encodeURIComponent(`Order support ${order.orderNumber}`)}`}>
                Contact concierge
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import type { OrderAddressFields } from "@/lib/commerce/order-address";
import { formatOrderStatusLabel } from "@/lib/commerce/order-status";
import type { StaffOrderDetail } from "@/lib/commerce/staff-order-detail";
import { Badge } from "@/components/ui/badge";

type StaffOrderOverviewProps = {
  order: StaffOrderDetail;
  showBrandNames?: boolean;
};

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShippingMethod(method: string | null) {
  if (!method) return "—";
  return method.replaceAll("_", " ");
}

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: OrderAddressFields;
}) {
  const hasContent =
    address.name ||
    address.line1 ||
    address.city ||
    address.phone ||
    address.email ||
    address.country;

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="font-display text-xl">{title}</h2>
      {hasContent ? (
        <address className="mt-4 space-y-1 text-sm not-italic text-[var(--color-muted-foreground)]">
          {address.name ? (
            <p className="font-medium text-[var(--color-foreground)]">{address.name}</p>
          ) : null}
          {address.phone ? <p>{address.phone}</p> : null}
          {address.email ? <p>{address.email}</p> : null}
          {address.line1 ? <p>{address.line1}</p> : null}
          {address.line2 ? <p>{address.line2}</p> : null}
          <p>
            {[address.city, address.state, address.postalCode].filter(Boolean).join(", ") || "—"}
          </p>
          {address.country ? <p>{address.country}</p> : null}
        </address>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">No address on file.</p>
      )}
    </section>
  );
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-4">
      <dt className="text-sm text-[var(--color-muted-foreground)]">{label}</dt>
      <dd className="mt-1 font-medium text-[var(--color-foreground)]">{children}</dd>
    </div>
  );
}

export function StaffOrderOverview({ order, showBrandNames = true }: StaffOrderOverviewProps) {
  return (
    <div className="space-y-4">
      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">Order total</p>
            <div className="mt-1">
              <Price amount={order.total} currency={order.currency} size="lg" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <Badge variant="outline" className="rounded-lg">
                {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
              </Badge>
              <Badge variant="outline" className="rounded-lg capitalize">
                Payment {order.paymentStatus}
              </Badge>
              <Badge variant="outline" className="rounded-lg capitalize">
                Shipping {order.shippingStatus.replaceAll("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetaRow label="Order number">{order.orderNumber}</MetaRow>
          <MetaRow label="Placed">{formatDateTime(order.placedAt)}</MetaRow>
          <MetaRow label="Created">{formatDateTime(order.createdAt)}</MetaRow>
          <MetaRow label="Updated">{formatDateTime(order.updatedAt)}</MetaRow>
          {order.completedAt ? (
            <MetaRow label="Completed">{formatDateTime(order.completedAt)}</MetaRow>
          ) : null}
          {order.cancelledAt ? (
            <MetaRow label="Cancelled">{formatDateTime(order.cancelledAt)}</MetaRow>
          ) : null}
          <MetaRow label="Currency">{order.currency}</MetaRow>
          <MetaRow label="Shipping method">{formatShippingMethod(order.shippingMethod)}</MetaRow>
          <MetaRow label="Coupon">{order.couponCode ?? "—"}</MetaRow>
        </dl>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-display text-xl">Customer</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Name</dt>
              <dd className="mt-1 font-medium">{order.customerName || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Email</dt>
              <dd className="mt-1 font-medium">{order.customerEmail || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Phone</dt>
              <dd className="mt-1 font-medium">{order.customerPhone || "—"}</dd>
            </div>
            {showBrandNames ? (
              <div>
                <dt className="text-[var(--color-muted-foreground)]">Brand{order.brandNames.length === 1 ? "" : "s"}</dt>
                <dd className="mt-1 font-medium">
                  {order.brandNames.length ? order.brandNames.join(", ") : "—"}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-display text-xl">Totals</h2>
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
                <Price amount={order.shippingFee} currency={order.currency} size="sm" />
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
                <Price amount={order.total} currency={order.currency} size="md" />
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
            All product prices include tax.
          </p>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AddressBlock title="Shipping address" address={order.shippingAddress} />
        <AddressBlock title="Billing address" address={order.billingAddress} />
      </div>

      {order.customerNotes ? (
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-display text-xl">Order notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--color-muted-foreground)]">
            {order.customerNotes}
          </p>
        </section>
      ) : null}

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-display text-2xl">Items</h2>
        <div className="mt-6 space-y-4">
          {order.items.length === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">No line items on this order.</p>
          ) : (
            order.items.map((item, index) => {
              const content = (
                <>
                  {item.image ? (
                    <div className="relative aspect-square w-24 overflow-hidden rounded-xl bg-[var(--color-muted)] sm:w-28">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="112px"
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    {item.brand ? (
                      <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                        {item.brand}
                      </p>
                    ) : null}
                    <p className="mt-1 font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                      {[item.variant, `Qty ${item.quantity}`, item.sku ? `SKU ${item.sku}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-muted-foreground)]">
                      <span>
                        Unit <Price amount={item.unitPrice} currency={order.currency} size="sm" />
                      </span>
                      {item.compareAtPrice != null && item.compareAtPrice > item.unitPrice ? (
                        <span>
                          Compare{" "}
                          <Price amount={item.compareAtPrice} currency={order.currency} size="sm" />
                        </span>
                      ) : null}
                      {item.discountAmount > 0 ? (
                        <span>
                          Discount{" "}
                          <Price amount={item.discountAmount} currency={order.currency} size="sm" />
                        </span>
                      ) : null}
                      {item.taxAmount > 0 ? (
                        <span>
                          Tax <Price amount={item.taxAmount} currency={order.currency} size="sm" />
                        </span>
                      ) : null}
                      {item.preorderEstimatedAt ? (
                        <span>Preorder est. {formatDateTime(item.preorderEstimatedAt)}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-[var(--color-muted-foreground)]">Line total</p>
                    <Price amount={item.lineTotal} currency={order.currency} size="md" />
                  </div>
                </>
              );

              return item.productSlug ? (
                <Link
                  key={`${item.sku}-${index}`}
                  href={`/products/${item.productSlug}`}
                  className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-muted)]/20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  {content}
                </Link>
              ) : (
                <article
                  key={`${item.sku}-${index}`}
                  className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  {content}
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-display text-xl">Payments</h2>
        <div className="mt-4 space-y-3">
          {order.payments.length === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">No payment records yet.</p>
          ) : (
            order.payments.map((payment) => (
              <article
                key={payment.reference}
                className="rounded-xl border border-[var(--color-border)] p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium capitalize">
                      {payment.provider} · {payment.status.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-[var(--color-muted-foreground)]">
                      Ref {payment.reference}
                    </p>
                  </div>
                  <Price amount={payment.amount} currency={payment.currency} size="md" />
                </div>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Created</dt>
                    <dd>{formatDateTime(payment.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Paid at</dt>
                    <dd>{formatDateTime(payment.paidAt)}</dd>
                  </div>
                  {payment.failureReason ? (
                    <div className="sm:col-span-2">
                      <dt className="text-[var(--color-muted-foreground)]">Failure reason</dt>
                      <dd>{payment.failureReason}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-display text-xl">Shipments</h2>
        <div className="mt-4 space-y-3">
          {order.shipments.length === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">No shipment records yet.</p>
          ) : (
            order.shipments.map((shipment, index) => (
              <article
                key={`${shipment.trackingNumber ?? "shipment"}-${index}`}
                className="rounded-xl border border-[var(--color-border)] p-4 text-sm"
              >
                <p className="font-medium capitalize">
                  {shipment.provider} · {shipment.status.replaceAll("_", " ")}
                </p>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Tracking</dt>
                    <dd>{shipment.trackingNumber ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Method</dt>
                    <dd className="capitalize">{formatShippingMethod(shipment.shippingMethod)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Cost</dt>
                    <dd>
                      <Price amount={shipment.cost} currency={order.currency} size="sm" />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Updated</dt>
                    <dd>{formatDateTime(shipment.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Shipped</dt>
                    <dd>{formatDateTime(shipment.shippedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Delivered</dt>
                    <dd>{formatDateTime(shipment.deliveredAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Est. delivery</dt>
                    <dd>{formatDateTime(shipment.estimatedDeliveryAt)}</dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </div>
      </section>

      {order.statusHistory.length > 0 ? (
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-display text-xl">Status timeline</h2>
          <ol className="mt-4 space-y-3">
            {[...order.statusHistory].reverse().map((entry, index) => (
              <li
                key={`${entry.at}-${entry.toStatus}-${index}`}
                className="rounded-xl border border-[var(--color-border)] p-3 text-sm"
              >
                <p className="font-medium capitalize text-[var(--color-foreground)]">
                  {entry.fromStatus
                    ? `${formatOrderStatusLabel(entry.fromStatus)} → ${formatOrderStatusLabel(entry.toStatus)}`
                    : formatOrderStatusLabel(entry.toStatus)}
                </p>
                <p className="mt-1 text-[var(--color-muted-foreground)]">{formatDateTime(entry.at)}</p>
                {entry.comment ? (
                  <p className="mt-2 text-[var(--color-muted-foreground)]">{entry.comment}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}

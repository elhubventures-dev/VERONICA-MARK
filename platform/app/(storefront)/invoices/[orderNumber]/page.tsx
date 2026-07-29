import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Price } from "@/components/commerce/price";
import { OrderStatusBadge, toOrderStatusBadge } from "@/components/commerce/order-status-badge";
import { getOrderForInvoice } from "@/lib/storefront/catalog-queries";

type InvoicePageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Invoice ${orderNumber}`,
    description: `VERONICA MARK invoice for order ${orderNumber}.`,
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { orderNumber } = await params;
  const order = await getOrderForInvoice(orderNumber);
  if (!order) notFound();

  const created = new Date(order.createdAt);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 print:py-6 sm:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 print:mb-6">
        <div>
          <p className="font-display text-2xl">VERONICA MARK</p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Luxury managed-brand marketplace</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">Invoice</p>
          <p className="text-[var(--color-muted-foreground)]">{order.orderNumber}</p>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            {created.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-2 flex justify-end">
            <OrderStatusBadge status={toOrderStatusBadge(order.status)} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 rounded-xl border border-[var(--color-border)] p-6 print:border-black/20 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-[var(--color-muted-foreground)]">
            Bill to
          </p>
          <p className="mt-2 text-sm">{order.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-[var(--color-muted-foreground)]">
            Ship to
          </p>
          <address className="mt-2 text-sm not-italic">
            {order.shippingAddress.name}
            <br />
            {order.shippingAddress.phone ? (
              <>
                {order.shippingAddress.phone}
                <br />
              </>
            ) : null}
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? (
              <>
                <br />
                {order.shippingAddress.line2}
              </>
            ) : null}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </address>
        </div>
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted-foreground)]">
            <th className="pb-3 font-medium">Item</th>
            <th className="pb-3 font-medium">Qty</th>
            <th className="pb-3 text-right font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index} className="border-b border-[var(--color-border)]">
              <td className="py-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {item.brand} · {item.variant}
                </p>
              </td>
              <td className="py-4">{item.quantity}</td>
              <td className="py-4 text-right">
                <Price amount={item.unitPrice * item.quantity} currency={order.currency} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-muted-foreground)]">Subtotal</dt>
          <dd>
            <Price amount={order.subtotal} currency={order.currency} size="sm" />
          </dd>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted-foreground)]">Discount</dt>
            <dd>
              <Price amount={-order.discount} currency={order.currency} size="sm" />
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-[var(--color-muted-foreground)]">Shipping</dt>
          <dd>
            <Price amount={order.shipping} currency={order.currency} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-muted-foreground)]">Tax</dt>
          <dd>
            <Price amount={order.tax} currency={order.currency} size="sm" />
          </dd>
        </div>
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2 font-medium">
          <dt>Total</dt>
          <dd>
            <Price amount={order.total} currency={order.currency} size="lg" />
          </dd>
        </div>
      </dl>

      <p className="mt-10 text-center text-xs text-[var(--color-muted-foreground)] print:mt-6">
        Thank you for choosing VERONICA MARK. Questions? Contact concierge@veronicamark.com
      </p>
    </div>
  );
}

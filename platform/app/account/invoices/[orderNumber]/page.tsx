import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintInvoiceButton } from "@/components/account/print-invoice-button";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getAccountOrder } from "@/lib/account/queries";

type AccountInvoicePageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({
  params,
}: AccountInvoicePageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Invoice ${orderNumber}`,
    description: `Print-friendly VERONICA MARK invoice for order ${orderNumber}.`,
  };
}

function formatIssuedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AccountInvoiceDetailPage({
  params,
}: AccountInvoicePageProps) {
  const { orderNumber } = await params;
  const order = await getAccountOrder(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        className="print:hidden"
        eyebrow="Account"
        title={`Invoice ${order.orderNumber}`}
        description="A print-friendly invoice layout inside your account dashboard."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/account/invoices">Back to invoices</Link>
            </Button>
            <PrintInvoiceButton />
          </>
        }
      />

      <section className="mx-auto max-w-4xl rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] pb-6 print:pb-5">
          <div>
            <p className="font-display text-3xl tracking-tight">VERONICA MARK</p>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Account invoice for premium fragrance orders.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-2xl">Invoice</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{order.orderNumber}</p>
            <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
              Issued {formatIssuedAt(order.placedAt)}
            </p>
            <div className="mt-3 sm:ml-auto sm:w-fit">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 rounded-xl border border-[var(--color-border)] p-6 print:rounded-none print:border-black/15 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
              Bill to
            </p>
            <p className="mt-3 text-sm">{order.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
              Ship to
            </p>
            <address className="mt-3 text-sm not-italic">
              {order.shippingAddress.name}
              <br />
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
              <th className="pb-3 text-right font-medium">Unit price</th>
              <th className="pb-3 text-right font-medium">Line total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={`${item.title}-${index}`} className="border-b border-[var(--color-border)] align-top">
                <td className="py-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {item.brand} · {item.variant}
                  </p>
                </td>
                <td className="py-4">{item.quantity}</td>
                <td className="py-4 text-right">
                  <Price amount={item.unitPrice} currency={order.currency} size="sm" />
                </td>
                <td className="py-4 text-right">
                  <Price amount={item.unitPrice * item.quantity} currency={order.currency} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted-foreground)]">Subtotal</dt>
            <dd>
              <Price amount={order.subtotal} currency={order.currency} size="sm" />
            </dd>
          </div>
          {order.discount > 0 ? (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-muted-foreground)]">Discount</dt>
              <dd>
                <Price amount={-order.discount} currency={order.currency} size="sm" />
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted-foreground)]">Shipping</dt>
            <dd>
              <Price amount={order.shipping} currency={order.currency} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted-foreground)]">Tax</dt>
            <dd>
              <Price amount={order.tax} currency={order.currency} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-[var(--color-border)] pt-2 font-medium">
            <dt>Total</dt>
            <dd>
              <Price amount={order.total} currency={order.currency} size="lg" />
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-muted-foreground)] print:mt-8">
          <p>Questions about this invoice? Contact concierge@veronicamark.com.</p>
          <Button asChild variant="outline" size="sm" className="print:hidden">
            <Link href={`/account/orders/${order.orderNumber}`}>Open order details</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

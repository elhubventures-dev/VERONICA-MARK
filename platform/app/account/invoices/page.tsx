import type { Metadata } from "next";
import Link from "next/link";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAccountInvoices } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Access print-friendly invoices for your VERONICA MARK orders.",
};

function formatIssuedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AccountInvoicesPage() {
  const invoices = await getAccountInvoices();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Invoices"
        description="Open account-ready invoice views for completed and in-flight orders, then print them from the detail page."
        actions={
          <Button asChild variant="outline">
            <Link href="/account/orders">View orders</Link>
          </Button>
        }
      />

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="rounded-lg">
            Print-friendly
          </Badge>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Open any invoice below and use the print action for a clean paper or PDF-friendly layout.
          </p>
        </div>
      </section>

      {invoices.length ? (
        <section aria-label="Invoices list" className="space-y-4">
          {invoices.map((invoice) => (
            <article
              key={invoice.orderNumber}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                    Invoice {invoice.orderNumber}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    Issued {formatIssuedAt(invoice.placedAt)}
                  </p>
                </div>
                <OrderStatusBadge status={invoice.status} />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Invoice total</p>
                  <Price amount={invoice.total} currency={invoice.currency} size="md" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/account/orders/${invoice.orderNumber}`}>Order details</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/account/invoices/${invoice.orderNumber}`}>Open invoice</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AccountEmptyState
          title="No invoices available yet"
          description="Invoices appear here as soon as an order reaches the confirmed payment and fulfillment flow."
          actionLabel="Browse orders"
          actionHref="/account/orders"
        />
      )}
    </div>
  );
}

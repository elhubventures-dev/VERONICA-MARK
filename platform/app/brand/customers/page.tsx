import type { Metadata } from "next";
import Link from "next/link";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandCustomers } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Customers",
  description: "Review the customers, lifetime spend, and most recent orders for this brand workspace.",
};

function formatLastOrder(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BrandCustomersPage() {
  const customers = await getBrandCustomers();
  const sortedCustomers = [...customers].sort((a, b) => b.spend - a.spend);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Manager"
        title="Customers"
        description="See the shoppers buying from your managed assortment and spot the highest-value relationships."
        actions={
          <Button asChild variant="outline">
            <Link href="/brand/orders">View orders</Link>
          </Button>
        }
      />

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex flex-wrap items-start gap-3">
          <Badge variant="outline">Brand-scoped audience</Badge>
          <p className="max-w-3xl text-sm text-[var(--color-muted-foreground)]">
            This directory includes only customers who have purchased from the current brand workspace, not the full
            marketplace customer base.
          </p>
        </div>
      </section>

      {sortedCustomers.length ? (
        <section aria-label="Brand customers" className="space-y-4">
          {sortedCustomers.map((customer) => (
            <article
              key={customer.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:items-center">
                <div className="min-w-0">
                  <p className="font-display text-xl">{customer.name}</p>
                  <p className="mt-1 truncate text-sm text-[var(--color-muted-foreground)]">{customer.email}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    {customer.city}, {customer.country}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Spend</p>
                  <Price amount={customer.spend} size="md" />
                </div>

                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Orders</p>
                  <p className="mt-1 font-medium">{customer.orders}</p>
                </div>

                <div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Last order</p>
                  <p className="mt-1 font-medium">{formatLastOrder(customer.lastOrderAt)}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <BrandEmptyState
          title="No customers yet"
          description="Customer profiles will populate here after the first brand-scoped orders are placed."
        />
      )}
    </div>
  );
}

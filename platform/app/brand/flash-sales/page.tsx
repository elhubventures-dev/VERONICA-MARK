import type { Metadata } from "next";
import Link from "next/link";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { DemoActionButton } from "@/components/brand/demo-action-button";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandFlashSales } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Flash Sales",
  description: "Review live, scheduled, and completed flash sale events for the current brand workspace.",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(status: "live" | "scheduled" | "ended") {
  switch (status) {
    case "live":
      return "success";
    case "scheduled":
      return "warning";
    default:
      return "outline";
  }
}

export default async function BrandFlashSalesPage() {
  const flashSales = await getBrandFlashSales();
  const sortedFlashSales = [...flashSales].sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Manager"
        title="Flash sales"
        description="Coordinate short-window merchandising pushes, track event revenue, and preview upcoming sale drops."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/brand/coupons">View coupons</Link>
            </Button>
            <DemoActionButton
              label="Create flash sale"
              pendingLabel="Creating..."
              successMessage="Flash sale created."
              description="Demo action only. No campaign was persisted."
            />
          </div>
        }
      />

      {sortedFlashSales.length ? (
        <section aria-label="Brand flash sales" className="grid gap-4 xl:grid-cols-2">
          {sortedFlashSales.map((sale) => (
            <article
              key={sale.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl">{sale.title}</h2>
                    <Badge variant={getStatusVariant(sale.status)} className="capitalize">
                      {sale.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    {formatDateTime(sale.startsAt)} to {formatDateTime(sale.endsAt)}
                  </p>
                </div>
                <Badge variant="outline">{sale.discountPercent}% off</Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                  <p className="text-sm text-[var(--color-muted-foreground)]">Products</p>
                  <p className="mt-1 font-medium">{sale.productCount}</p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                  <p className="text-sm text-[var(--color-muted-foreground)]">Revenue</p>
                  <Price amount={sale.revenue} size="md" />
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
                  <p className="text-sm text-[var(--color-muted-foreground)]">Window</p>
                  <p className="mt-1 font-medium capitalize">{sale.status}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-[var(--color-muted-foreground)]">Included products</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sale.products.map((product) => (
                    <Badge key={product} variant="outline">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <BrandEmptyState
          title="No flash sales yet"
          description="Create a timed campaign to spotlight hero SKUs, drive urgency, or support new collection moments."
        />
      )}
    </div>
  );
}

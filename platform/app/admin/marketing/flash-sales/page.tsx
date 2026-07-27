import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingFlashSales } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Marketing Flash Sales",
  description: "Track Stage 9 flash-sale windows, unit velocity, and revenue across live and scheduled launch moments.",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusVariant(status: "live" | "scheduled" | "ended") {
  switch (status) {
    case "live":
      return "success";
    case "scheduled":
      return "warning";
    case "ended":
    default:
      return "outline";
  }
}

export default async function MarketingFlashSalesPage() {
  const flashSales = await getMarketingFlashSales();
  const liveCount = flashSales.filter((sale) => sale.status === "live").length;
  const scheduledCount = flashSales.filter((sale) => sale.status === "scheduled").length;
  const totalUnits = flashSales.reduce((sum, sale) => sum + sale.unitsSold, 0);
  const totalRevenue = flashSales.reduce((sum, sale) => sum + sale.revenue, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Flash sales"
        description="Coordinate short-window merchandising events with clear visibility into live coverage, scheduled inventory, and sales impact."
        actions={
          <AdminDemoButton label="Create flash sale" message="Flash sale created in demo mode." variant="default" />
        }
      />

      {flashSales.length ? (
        <>
          <section aria-label="Flash sale overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Live now</p>
              <p className="mt-2 font-display text-3xl">{liveCount}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Scheduled</p>
              <p className="mt-2 font-display text-3xl">{scheduledCount}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Units sold</p>
              <p className="mt-2 font-display text-3xl">{totalUnits.toLocaleString()}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Revenue</p>
              <p className="mt-2 font-display text-3xl">{formatPrice(totalRevenue, "EUR")}</p>
            </article>
          </section>

          <section aria-label="Flash sale list" className="grid gap-4 xl:grid-cols-2">
            {flashSales
              .slice()
              .sort((a, b) => a.startsAt.localeCompare(b.startsAt) * -1)
              .map((sale) => (
                <article
                  key={sale.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-2xl text-[var(--color-foreground)]">{sale.title}</h2>
                        <Badge variant={getStatusVariant(sale.status)} className="rounded-lg capitalize">
                          {sale.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                        {formatDateTime(sale.startsAt)} to {formatDateTime(sale.endsAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      {sale.discountPercent}% off
                    </Badge>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                      <p className="text-sm text-[var(--color-muted-foreground)]">Products</p>
                      <p className="mt-1 font-medium">{sale.productCount}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                      <p className="text-sm text-[var(--color-muted-foreground)]">Units</p>
                      <p className="mt-1 font-medium">{sale.unitsSold.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                      <p className="text-sm text-[var(--color-muted-foreground)]">Revenue</p>
                      <p className="mt-1 font-medium">{formatPrice(sale.revenue, "EUR")}</p>
                    </div>
                  </div>
                </article>
              ))}
          </section>
        </>
      ) : (
        <AdminEmptyState
          title="No flash sales scheduled"
          description="Timed launch events and urgent merchandising windows will appear here once Stage 9 flash-sale orchestration is enabled."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

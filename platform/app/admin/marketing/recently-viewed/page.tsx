import type { Metadata } from "next";
import { Eye, MousePointerClick, ScanSearch, TrendingUp } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { getMarketingRecentlyViewed } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Recently Viewed",
  description: "Track product engagement for recently viewed modules and identify the strongest conversion candidates.",
};

export default async function MarketingRecentlyViewedPage() {
  const items = await getMarketingRecentlyViewed();

  const totalViews = items.reduce((sum, item) => sum + item.views, 0);
  const averageAddToCartRate = items.length > 0 ? items.reduce((sum, item) => sum + item.addToCartRate, 0) / items.length : 0;
  const topProduct = items[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Recently viewed"
        description="Understand which products continue to convert when surfaced back to returning shoppers."
      />

      <section aria-label="Recently viewed KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Tracked products" value={items.length.toLocaleString()} icon={Eye} />
        <KpiCard label="Total views" value={totalViews.toLocaleString()} icon={ScanSearch} />
        <KpiCard label="Average add-to-cart" value={`${averageAddToCartRate.toFixed(1)}%`} icon={MousePointerClick} />
        <KpiCard
          label="Top product"
          value={topProduct ? topProduct.productName : "N/A"}
          icon={TrendingUp}
          className="sm:col-span-2 xl:col-span-1"
        />
      </section>

      {items.length ? (
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Product engagement</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Prioritize products that earn repeat interest and convert well from return visits.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article key={item.productName} className="rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--color-foreground)]">{item.productName}</h3>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                      {item.views.toLocaleString()} recent views
                    </p>
                  </div>
                  <div className="text-sm text-[var(--color-muted-foreground)]">
                    Add-to-cart rate <span className="font-medium text-[var(--color-foreground)]">{item.addToCartRate.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full bg-[var(--color-muted)]">
                  <div
                    className="h-2 rounded-full bg-[var(--color-primary)]"
                    style={{ width: `${Math.min(item.addToCartRate * 5, 100)}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <AdminEmptyState
          title="No recently viewed activity"
          description="Recently viewed performance will appear here after shopper browsing sessions begin populating engagement signals."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

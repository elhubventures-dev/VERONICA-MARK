import type { Metadata } from "next";
import Link from "next/link";
import { DonutChart } from "@/components/charts/donut-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Price } from "@/components/commerce/price";
import { formatPrice } from "@/lib/commerce/format-price";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBrandAnalytics } from "@/lib/brand/queries";
import { Banknote, Percent, Receipt, ShoppingBag } from "@/components/icons";

export const metadata: Metadata = {
  title: "Brand Analytics",
  description: "Track 30-day revenue, conversion, category mix, and top products for your managed brand.",
};

export default async function BrandAnalyticsPage() {
  const analytics = await getBrandAnalytics();
  const categoryMixTotal = analytics.categoryMix.reduce((total, item) => total + item.value, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Brand Manager"
        title="Analytics"
        description="Monitor 30-day revenue momentum, conversion efficiency, and category contribution across your brand."
        actions={
          <Button asChild variant="outline">
            <Link href="/brand/reports">Open reports</Link>
          </Button>
        }
      />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue (30 days)" value={formatPrice(analytics.revenue30d, "EUR")} icon={<Banknote className="size-4" />} />
        <KpiCard label="Orders (30 days)" value={String(analytics.orders30d)} icon={<ShoppingBag className="size-4" />} />
        <KpiCard label="AOV (30 days)" value={formatPrice(analytics.aov30d, "EUR")} icon={<Receipt className="size-4" />} />
        <KpiCard label="Conversion rate" value={`${analytics.conversionRate.toFixed(1)}%`} icon={<Percent className="size-4" />} />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.7fr_1fr]">
        <LineChart
          title="Revenue trend"
          description="Daily gross revenue and order volume for the latest seven-day window."
          data={analytics.revenueSeries}
          xKey="day"
          series={[
            { dataKey: "revenue", name: "Revenue", color: "var(--color-primary)" },
            { dataKey: "orders", name: "Orders", color: "var(--color-accent)" },
          ]}
          showLegend
          height={320}
        />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-1">
          <DonutChart
            title="Category mix"
            description="Share of sales contribution by merchandising category."
            data={analytics.categoryMix}
            centerValue={`${categoryMixTotal}%`}
            centerLabel="30-day mix"
            height={320}
          />

          <section
            aria-labelledby="category-breakdown-heading"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="category-breakdown-heading" className="font-display text-xl text-[var(--color-foreground)]">
                  Category breakdown
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  Compare mix contribution across the current reporting period.
                </p>
              </div>
              <span className="rounded-lg bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-muted-foreground)]">
                Total {categoryMixTotal}%
              </span>
            </div>

            <ul className="mt-6 space-y-3">
              {analytics.categoryMix.map((category) => (
                <li
                  key={category.name}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-[var(--color-foreground)]">{category.name}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Category share of brand sales</p>
                  </div>
                  <span className="font-display text-lg font-semibold text-[var(--color-foreground)]">
                    {category.value}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="top-products-heading"
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="top-products-heading" className="font-display text-2xl text-[var(--color-foreground)]">
              Top products
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Best-performing products ranked by units sold and revenue in the last 30 days.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/brand/products">View catalog</Link>
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
              <tr>
                <th className="pb-3 font-medium">Rank</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Units sold</th>
                <th className="pb-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {analytics.topProducts.map((product, index) => (
                <tr key={product.name}>
                  <td className="py-4 text-[var(--color-muted-foreground)]">#{index + 1}</td>
                  <td className="py-4 font-medium text-[var(--color-foreground)]">{product.name}</td>
                  <td className="py-4">{product.units}</td>
                  <td className="py-4">
                    <Price amount={product.revenue} currency="EUR" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { DonutChart } from "@/components/charts/donut-chart";
import { LineChart } from "@/components/charts/line-chart";
import { formatPrice } from "@/lib/commerce/format-price";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminAnalytics } from "@/lib/admin/queries";
import { BarChart3, CreditCard, ShoppingBag, Store } from "@/components/icons";

export const metadata: Metadata = {
  title: "Admin Analytics",
  description: "Review platform performance KPIs, revenue momentum, and channel mix across the VERONICA MARK marketplace.",
};

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalytics();
  const brandMixTotal = analytics.brandMix.reduce((sum, item) => sum + item.value, 0);
  const paymentMixTotal = analytics.paymentMix.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Analytics"
        description="Track cross-brand performance with a concise executive view of GMV, order demand, customer scale, and payment distribution."
      />

      <section aria-label="Analytics KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue (30d)"
          value={formatPrice(analytics.totalRevenue30d, "NGN")}
          change={12}
          icon={<ShoppingBag className="size-4" />}
        />
        <KpiCard label="Orders (30d)" value={analytics.orders30d.toLocaleString()} change={9} icon={<BarChart3 className="size-4" />} />
        <KpiCard label="Customers" value={analytics.customersTotal.toLocaleString()} change={7} icon={<CreditCard className="size-4" />} />
        <KpiCard label="Active brands" value={String(analytics.brandsActive)} change={3} icon={<Store className="size-4" />} />
      </section>

      <LineChart
        title="Marketplace revenue"
        description="Daily revenue and order volume across all active brands."
        data={analytics.revenueSeries}
        xKey="day"
        series={[
          { dataKey: "revenue", name: "Revenue", color: "var(--color-primary)" },
          { dataKey: "orders", name: "Orders", color: "var(--color-accent)" },
        ]}
        showLegend
        height={320}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <DonutChart
          title="Brand mix"
          description="Contribution by leading marketplace collections."
          data={analytics.brandMix.map((item, index) => ({
            ...item,
            color:
              index === 0
                ? "var(--color-primary)"
                : index === 1
                  ? "var(--color-accent)"
                  : index === 2
                    ? "var(--color-secondary)"
                    : "var(--color-info)",
          }))}
          centerValue={`${brandMixTotal}%`}
          centerLabel="Tracked share"
          height={320}
        />

        <DonutChart
          title="Payment mix"
          description="Provider distribution for recent successful payment attempts."
          data={analytics.paymentMix.map((item, index) => ({
            ...item,
            color: index === 0 ? "var(--color-primary)" : "var(--color-accent)",
          }))}
          centerValue={`${paymentMixTotal}%`}
          centerLabel="Processed volume"
          height={320}
        />
      </div>

      <section
        aria-label="Payment mix details"
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Payment mix details</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Balance provider concentration while monitoring checkout resiliency.
            </p>
          </div>
          <Badge variant="outline" className="rounded-lg">
            {analytics.paymentMix.length} providers
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {analytics.paymentMix.map((provider) => (
            <div key={provider.name} className="rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[var(--color-foreground)]">{provider.name}</p>
                <span className="text-sm text-[var(--color-muted-foreground)]">{provider.value}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--color-muted)]">
                <div className="h-2 rounded-full bg-[var(--color-primary)]" style={{ width: `${provider.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

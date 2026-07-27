import type { Metadata } from "next";
import { DonutChart } from "@/components/charts/donut-chart";
import { LineChart } from "@/components/charts/line-chart";
import { formatPrice } from "@/lib/commerce/format-price";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingAnalytics } from "@/lib/marketing/queries";
import { Bell, Mail, ShoppingBag, TicketPercent } from "@/components/icons";

export const metadata: Metadata = {
  title: "Marketing Analytics",
  description: "Review Stage 9 marketing performance across promotional revenue, lifecycle engagement, and channel contribution.",
};

export default async function MarketingAnalyticsPage() {
  const analytics = await getMarketingAnalytics();
  const channelMixTotal = analytics.channelMix.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Marketing analytics"
        description="Measure campaign impact with a concise view of promotional revenue, recovery efficiency, and owned channel performance."
      />

      <section aria-label="Marketing analytics KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Promo revenue (30d)" value={formatPrice(analytics.promoRevenue30d, "EUR")} icon={<ShoppingBag className="size-4" />} />
        <KpiCard label="Coupon redemptions" value={analytics.couponRedemptions30d.toLocaleString()} icon={<TicketPercent className="size-4" />} />
        <KpiCard label="Email open rate" value={`${analytics.emailOpenRate.toFixed(1)}%`} icon={<Mail className="size-4" />} />
        <KpiCard label="Push open rate" value={`${analytics.pushOpenRate.toFixed(1)}%`} icon={<Bell className="size-4" />} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <LineChart
          title="Attributed vs organic revenue"
          description="Promo-influenced revenue compared with organic demand over the latest seven days."
          data={analytics.series}
          xKey="day"
          series={[
            { dataKey: "promo", name: "Promo", color: "var(--color-primary)" },
            { dataKey: "organic", name: "Organic", color: "var(--color-accent)" },
          ]}
          showLegend
          height={320}
        />

        <DonutChart
          title="Channel mix"
          description="Share of tracked demand attributed to the leading marketing channels."
          data={analytics.channelMix}
          centerValue={`${channelMixTotal}%`}
          centerLabel="Tracked mix"
          height={320}
        />
      </div>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Channel benchmarks</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Compare response efficiency across retention and promotional channels.
            </p>
          </div>
          <Badge variant="outline" className="rounded-lg">
            {analytics.channelMix.length} channels
          </Badge>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-[var(--color-border)] p-4">
            <h3 className="font-medium text-[var(--color-foreground)]">Recovery and referral</h3>
            <div className="mt-4 space-y-3 text-sm text-[var(--color-muted-foreground)]">
              <p>
                Abandoned recovery rate:{" "}
                <span className="font-medium text-[var(--color-foreground)]">
                  {analytics.abandonedRecoveryRate.toFixed(1)}%
                </span>
              </p>
              <p>
                Referral conversion rate:{" "}
                <span className="font-medium text-[var(--color-foreground)]">
                  {analytics.referralConversionRate.toFixed(1)}%
                </span>
              </p>
            </div>
          </article>

          <div className="grid gap-3">
            {analytics.channelMix.map((channel) => (
              <article key={channel.name} className="rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-[var(--color-foreground)]">{channel.name}</p>
                  <span className="text-sm text-[var(--color-muted-foreground)]">{channel.value}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[var(--color-muted)]">
                  <div className="h-2 rounded-full bg-[var(--color-primary)]" style={{ width: `${channel.value}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

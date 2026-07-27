import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { LineChart } from "@/components/charts/line-chart";
import { formatPrice } from "@/lib/commerce/format-price";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMarketingDashboard } from "@/lib/marketing/queries";
import { Gauge, MessageSquareWarning, ShoppingCart, Sparkles, Timer, Zap } from "@/components/icons";

export const metadata: Metadata = {
  title: "Marketing Platform",
  description: "Promotion engine, campaigns, loyalty, and recovery workflows for VERONICA MARK.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MarketingDashboardPage() {
  const data = await getMarketingDashboard();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Stage 9"
        title="Marketing platform"
        description="Operate promotions, loyalty, recovery, and campaign scheduling across the marketplace."
        actions={
          <>
            <AdminDemoButton label="New promotion" message="Promotion draft created (demo)" />
            <Button asChild variant="outline">
              <Link href="/admin/marketing/brand-standards">Brand standards</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/marketing/scheduling">Campaign calendar</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Marketing KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Active promotions" value={String(data.activePromotions)} icon={<Sparkles className="size-4" />} />
        <KpiCard label="Live flash sales" value={String(data.liveFlashSales)} icon={<Zap className="size-4" />} />
        <KpiCard label="Open abandoned carts" value={String(data.openAbandonedCarts)} icon={<ShoppingCart className="size-4" />} />
        <KpiCard label="Pending reviews" value={String(data.pendingReviews.length)} icon={<MessageSquareWarning className="size-4" />} />
        <KpiCard label="Scheduled campaigns" value={String(data.scheduledCampaigns)} icon={<Timer className="size-4" />} />
        <KpiCard label="Active automations" value={String(data.activeAutomations)} icon={<Gauge className="size-4" />} />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <LineChart
          title="Attributed vs organic revenue"
          description="Promo-influenced GMV against organic demand (7 days)."
          data={data.analytics.series}
          xKey="day"
          series={[
            { dataKey: "promo", name: "Promo", color: "var(--color-primary)" },
            { dataKey: "organic", name: "Organic", color: "var(--color-accent)" },
          ]}
          showLegend
          height={300}
        />

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Upcoming schedule</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/marketing/scheduling">View all</Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-3">
            {data.upcoming.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--color-border)] px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant="outline" className="rounded-lg capitalize">
                    {item.campaignType.replace("_", " ")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  {formatDate(item.startsAt)} · {item.owner}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Abandoned cart queue</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/marketing/abandoned-cart">Recover</Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-[var(--color-border)]">
            {data.openCarts.map((cart) => (
              <li key={cart.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{cart.customer}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {cart.email} · {cart.items} items · {cart.remindersSent} reminders
                  </p>
                </div>
                <p className="font-medium">{formatPrice(cart.value, cart.currency)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Review moderation</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/marketing/reviews">Moderate</Link>
            </Button>
          </div>
          {data.pendingReviews.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">No reviews awaiting review.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.pendingReviews.map((review) => (
                <li key={review.id} className="rounded-xl border border-[var(--color-border)] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{review.productName}</p>
                    <Badge variant="warning" className="rounded-lg">
                      {review.rating}★
                    </Badge>
                    {review.verifiedPurchase ? (
                      <Badge variant="success" className="rounded-lg">
                        Verified
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{review.excerpt}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-[var(--color-primary)]" aria-hidden />
          <h2 className="font-display text-xl">Quick modules</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { href: "/admin/marketing/brand-standards", label: "Brand standards" },
              { href: "/admin/marketing/promotions", label: "Promotion engine" },
              { href: "/admin/marketing/coupons", label: "Coupons" },
              { href: "/admin/marketing/rewards", label: "Reward points" },
              { href: "/admin/marketing/referral", label: "Referral" },
              { href: "/admin/marketing/affiliate", label: "Affiliate" },
              { href: "/admin/marketing/email-campaigns", label: "Email campaigns" },
              { href: "/admin/marketing/push", label: "Push notifications" },
              { href: "/admin/marketing/automation", label: "Automation" },
            ] as const
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm transition-colors hover:bg-[var(--color-muted)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

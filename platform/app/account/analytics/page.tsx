import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Gift, RotateCcw, ShoppingBag } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccountAnalytics } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Analytics",
  description: "See your VERONICA MARK order, spend, rewards, and category engagement trends.",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function AccountAnalyticsPage() {
  const analytics = await getAccountAnalytics();
  const maxMonthlySpend = Math.max(...analytics.monthlySpend.map((entry) => entry.amount), 1);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Analytics"
        description="A clear year-to-date snapshot of spend, ordering habits, and category preference."
        actions={
          <>
            <Badge variant="outline" className="h-11 px-4 text-sm">
              YTD
            </Badge>
            <Button asChild>
              <Link href="/shop">Shop the new arrivals</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Analytics summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Orders placed" value={String(analytics.ordersPlaced)} icon={ShoppingBag} />
        <KpiCard label="Spend YTD" value={formatCurrency(analytics.spendYtd)} icon={BarChart3} />
        <KpiCard label="Average order" value={formatCurrency(analytics.avgOrderValue)} icon={ArrowUpRight} />
        <KpiCard label="Points earned" value={analytics.pointsEarned.toLocaleString()} icon={Gift} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Monthly spend</CardTitle>
            <CardDescription>A lightweight view of how your spend has built across the year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 items-end gap-3 sm:gap-4">
              {analytics.monthlySpend.map((entry) => {
                const height = `${Math.max(10, Math.round((entry.amount / maxMonthlySpend) * 100))}%`;

                return (
                  <div key={entry.month} className="flex flex-col items-center gap-3">
                    <span className="text-xs text-[var(--color-muted-foreground)]">{formatCurrency(entry.amount)}</span>
                    <div className="flex h-56 w-full items-end rounded-xl bg-[var(--color-muted)]/45 p-2">
                      <div
                        className="w-full rounded-lg bg-[var(--color-primary)]"
                        style={{ height }}
                        aria-label={`${entry.month} spend ${formatCurrency(entry.amount)}`}
                      />
                    </div>
                    <span className="text-sm font-medium">{entry.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="size-5 text-[var(--color-primary)]" aria-hidden />
              Returns rate
            </CardTitle>
            <CardDescription>Based on year-to-date purchasing and return activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-5">
              <p className="font-display text-4xl">{analytics.returnsRate}%</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                A small amount of returns is normal for a premium discovery-led shopping experience.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Your strongest month so far was{" "}
                <span className="font-medium text-[var(--color-foreground)]">
                  {
                    analytics.monthlySpend.reduce((best, current) =>
                      current.amount > best.amount ? current : best,
                    ).month
                  }
                </span>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category mix</CardTitle>
          <CardDescription>
            A simple view of where most of your VERONICA MARK engagement has been concentrated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.categoryMix.map((entry) => (
            <div key={entry.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{entry.label}</span>
                <span className="text-[var(--color-muted-foreground)]">{entry.value}%</span>
              </div>
              <div className="h-3 rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-3 rounded-full bg-[var(--color-accent)]"
                  style={{ width: `${Math.max(8, entry.value)}%` }}
                  aria-label={`${entry.label} ${entry.value}%`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

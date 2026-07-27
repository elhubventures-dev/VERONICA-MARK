import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Building2,
  HeartPulse,
  Package,
  ShieldAlert,
  ShoppingBag,
  Users,
} from "lucide-react";

import { LineChart } from "@/components/charts/line-chart";
import { formatPrice } from "@/components/commerce/price";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { StatWidget } from "@/components/dashboard/stat-widget";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminDashboard } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Global Dashboard",
  description: "Super Admin overview of VERONICA MARK marketplace health and operations.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  const { analytics } = data;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Super Admin"
        title="Global dashboard"
        description={`${data.platform.name} · ${data.platform.environment} · v${data.platform.version}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/fraud">Fraud queue</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/brands">Manage brands</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Platform KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total revenue (30d)"
          value={formatPrice(analytics.totalRevenue30d, "EUR")}
          change={12}
          icon={ShoppingBag}
        />
        <KpiCard label="Orders (30d)" value={String(analytics.orders30d)} icon={Package} />
        <KpiCard label="Customers" value={analytics.customersTotal.toLocaleString()} icon={Users} />
        <KpiCard label="Active brands" value={String(analytics.brandsActive)} icon={Building2} />
      </section>

      <section aria-label="Admin widgets" className="grid gap-4 md:grid-cols-3">
        <StatWidget
          label="Active promotions"
          value={String(analytics.activePromotions)}
          hint="Across all brands"
        />
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="text-sm text-[var(--color-muted-foreground)]">Inventory status</p>
          <div className="mt-4 flex items-center gap-4">
            <ProgressRing value={analytics.inventoryHealth} size={72} />
            <div>
              <p className="font-display text-2xl">{analytics.inventoryHealth}%</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Healthy SKUs</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="text-sm text-[var(--color-muted-foreground)]">Platform health</p>
          <div className="mt-4 flex items-center gap-4">
            <ProgressRing value={analytics.platformHealth} size={72} />
            <div>
              <p className="font-display text-2xl">{analytics.platformHealth}%</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Services nominal</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={data.health.payments ? "warning" : "success"} className="rounded-lg">
                  Payments {data.health.payments ? "attention" : "ok"}
                </Badge>
                <Badge variant={data.health.errorLogs ? "warning" : "success"} className="rounded-lg">
                  Logs {data.health.errorLogs ? "errors" : "ok"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <LineChart
          title="Marketplace revenue"
          description="Cross-brand gross merchandise value and order volume."
          data={analytics.revenueSeries}
          xKey="day"
          series={[
            { dataKey: "revenue", name: "Revenue", color: "var(--color-primary)" },
            { dataKey: "orders", name: "Orders", color: "var(--color-accent)" },
          ]}
          showLegend
          height={300}
        />

        <ActivityFeed
          title="Audit pulse"
          items={data.recentAudit.map((log) => ({
            id: log.id,
            title: log.summary,
            description: `${log.actor} · ${log.action}`,
            timestamp: formatDate(log.createdAt),
            icon: Activity,
          }))}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Pending brand approvals</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/brands">All brands</Link>
            </Button>
          </div>
          {data.pendingBrands.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">No brands awaiting review.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.pendingBrands.map((brand) => (
                <li
                  key={brand.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{brand.name}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">/{brand.slug}</p>
                  </div>
                  <Badge variant="warning" className="rounded-lg">
                    Pending
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Fraud monitoring</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/fraud">Open queue</Link>
            </Button>
          </div>
          {data.openFraud.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">No open fraud cases.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.openFraud.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 size-4 text-[var(--color-warning)]" aria-hidden />
                    <div>
                      <p className="font-medium">{item.subject}</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {item.type} · score {item.score}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.severity === "high" ? "error" : "warning"} className="rounded-lg capitalize">
                    {item.severity}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-4 text-[var(--color-primary)]" aria-hidden />
            <h2 className="font-display text-xl">Recent marketplace orders</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">Order management</Link>
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
              <tr>
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Brand</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {data.recentOrders.map((order) => (
                <tr key={order.orderNumber}>
                  <td className="py-3">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="font-medium hover:text-[var(--color-primary)]"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">{order.brandName}</td>
                  <td className="py-3 capitalize">{order.status}</td>
                  <td className="py-3">{formatPrice(order.total, order.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { formatPrice } from "@/lib/commerce/format-price";
import { LineChart } from "@/components/charts/line-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandDashboard } from "@/lib/brand/queries";
import { AlertTriangle, Package, ShoppingBag, TrendingUp, Truck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Brand Dashboard",
  description: "Brand Manager overview for sales, inventory, and fulfillment.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function BrandDashboardPage() {
  const data = await getBrandDashboard();
  const { analytics } = data;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Brand Manager"
        title="Dashboard"
        description={`${data.workspace.brandName} — scoped to your managed brand only.`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/brand/products">Manage products</Link>
            </Button>
            <Button asChild>
              <Link href="/brand/orders">Fulfill orders</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Sales today"
          value={formatPrice(analytics.salesToday, "NGN")}
          change={8}
          icon={<TrendingUp className="size-4" />}
        />
        <KpiCard label="Orders today" value={String(analytics.ordersToday)} icon={<ShoppingBag className="size-4" />} />
        <KpiCard
          label="Pending shipments"
          value={String(data.pendingShipments)}
          icon={<Truck className="size-4" />}
        />
        <KpiCard
          label="Inventory alerts"
          value={String(analytics.inventoryAlerts)}
          icon={<AlertTriangle className="size-4" />}
        />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <LineChart
          title="Revenue (7 days)"
          description="Brand-scoped gross revenue and order volume."
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
          title="Recent activity"
          items={data.activity.map((log) => ({
            id: log.id,
            title: log.summary,
            description: `${log.actor} · ${log.action}`,
            timestamp: formatDate(log.createdAt),
            icon: <Package className="size-4" />,
          }))}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section
          aria-labelledby="recent-orders-heading"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="recent-orders-heading" className="font-display text-xl">
              Recent orders
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/brand/orders">View all</Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-[var(--color-border)]">
            {data.recentOrders.map((order) => (
              <li key={order.orderNumber} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link
                    href={`/brand/orders/${order.orderNumber}`}
                    className="font-medium hover:text-[var(--color-primary)]"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {order.customerName} · {order.itemCount} items
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <Price amount={order.total} currency={order.currency} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="alerts-heading"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="alerts-heading" className="font-display text-xl">
              Inventory alerts
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/brand/inventory">Inventory</Link>
            </Button>
          </div>
          {data.lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">All variants are healthy.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.lowStock.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {row.productName} · {row.variant}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {row.available} available · SKU {row.sku}
                    </p>
                  </div>
                  <Badge variant={row.status === "out" ? "error" : "warning"} className="rounded-lg capitalize">
                    {row.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section
        aria-labelledby="top-products-heading"
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="top-products-heading" className="font-display text-xl">
            Top products (30 days)
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/brand/analytics">Full analytics</Link>
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
              <tr>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Units</th>
                <th className="pb-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {data.topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="py-3 font-medium">{product.name}</td>
                  <td className="py-3">{product.units}</td>
                  <td className="py-3">
                    <Price amount={product.revenue} />
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

import type { Metadata } from "next";
import { BellRing, RotateCcw, ShoppingCart, Wallet } from "lucide-react";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/components/commerce/price";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingAbandonedCarts } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Abandoned Cart Recovery",
  description: "Track recovery queue health and trigger demo reminder actions for carts that need follow-up.",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: string) {
  if (status === "recovered") return "success";
  if (status === "open") return "warning";
  return "outline";
}

export default async function MarketingAbandonedCartPage() {
  const carts = await getMarketingAbandonedCarts();

  const openCarts = carts.filter((cart) => cart.status === "open");
  const recoveredCarts = carts.filter((cart) => cart.status === "recovered");
  const openValue = openCarts.reduce((sum, cart) => sum + cart.value, 0);
  const totalReminders = carts.reduce((sum, cart) => sum + cart.remindersSent, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Abandoned cart"
        description="Keep recovery workflows moving by prioritizing open carts, monitoring queue value, and triggering reminder sends from the admin surface."
        actions={
          <AdminDemoButton
            label="Send reminder"
            message="Abandoned cart reminder sent in demo mode."
            variant="default"
          />
        }
      />

      <section aria-label="Abandoned cart KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open carts" value={openCarts.length.toLocaleString()} icon={ShoppingCart} />
        <KpiCard label="Recovered carts" value={recoveredCarts.length.toLocaleString()} icon={RotateCcw} />
        <KpiCard label="Open cart value" value={formatPrice(openValue, "EUR")} icon={Wallet} />
        <KpiCard label="Reminders sent" value={totalReminders.toLocaleString()} icon={BellRing} />
      </section>

      {carts.length ? (
        <section className="space-y-4">
          {carts.map((cart) => (
            <article
              key={cart.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{cart.customer}</h2>
                    <Badge variant={getStatusBadge(cart.status)} className="rounded-lg capitalize">
                      {cart.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] md:grid-cols-2 xl:grid-cols-3">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Email:</span> {cart.email}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Basket value:</span>{" "}
                      {formatPrice(cart.value, cart.currency)}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Items:</span> {cart.items}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Abandoned:</span>{" "}
                      {formatDateTime(cart.abandonedAt)}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Reminders sent:</span>{" "}
                      {cart.remindersSent}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <AdminDemoButton label="Send email" message={`Recovery email sent to ${cart.email} (demo)`} />
                  <AdminDemoButton label="Send push" message={`Push reminder sent for ${cart.id} (demo)`} />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No carts in recovery"
          description="Open and recovered abandoned carts will appear here as soon as recovery tracking starts collecting sessions."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

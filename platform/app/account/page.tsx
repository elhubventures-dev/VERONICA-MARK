import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Gift,
  Heart,
  ShoppingBag,
  Ticket,
  Wallet,
} from "lucide-react";

import { OrderCard } from "@/components/commerce/order-card";
import { Price } from "@/components/commerce/price";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getAccountOverview } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your VERONICA MARK account overview.",
};

function formatPlacedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AccountDashboardPage() {
  const data = await getAccountOverview();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Account"
        title="Welcome back"
        description="Orders, rewards, and your private edit — in one place."
        actions={
          <Button asChild>
            <Link href="/shop">Shop the edit</Link>
          </Button>
        }
      />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Reward points" value={data.rewardsBalance.toLocaleString()} icon={Gift} />
        <KpiCard label="Wishlist" value={String(data.wishlistCount)} icon={Heart} />
        <KpiCard label="Open coupons" value={String(data.availableCoupons)} icon={Ticket} />
        <KpiCard
          label="Wallet"
          value={`€${data.walletBalance.toFixed(2)}`}
          icon={Wallet}
        />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="recent-orders-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="recent-orders-heading" className="font-display text-2xl">
                Recent orders
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Track fulfillment and open invoices.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/account/orders">View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <OrderCard
                key={order.orderNumber}
                orderNumber={order.orderNumber}
                placedAt={formatPlacedAt(order.placedAt)}
                status={order.status}
                itemCount={order.items.reduce((n, i) => n + i.quantity, 0)}
                total={order.total}
                currency={order.currency}
                previews={order.items.map((item) => ({
                  imageSrc: item.image,
                  imageAlt: item.title,
                }))}
                href={`/account/orders/${order.orderNumber}`}
              />
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <ActivityFeed
            title="Updates"
            items={[
              {
                id: "a1",
                title: `${data.unreadNotifications} unread notification${data.unreadNotifications === 1 ? "" : "s"}`,
                description: "Order and offer updates",
                timestamp: "Inbox",
                icon: Bell,
              },
              {
                id: "a2",
                title: `${data.rewardsTier} member`,
                description: `${data.rewardsBalance.toLocaleString()} points available`,
                timestamp: "Rewards",
                icon: Gift,
              },
              {
                id: "a3",
                title: "Continue browsing",
                description: "Return to the fragrance edit",
                timestamp: "Shop",
                icon: ShoppingBag,
              },
            ]}
          />

          <section
            aria-labelledby="quick-links-heading"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <h2 id="quick-links-heading" className="font-display text-lg">
              Quick links
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {([
                ["/account/invoices", "Invoices"],
                ["/account/returns", "Returns"],
                ["/account/coupons", "Coupons"],
                ["/account/referral", "Referral"],
                ["/account/addresses", "Addresses"],
                ["/account/settings", "Settings"],
              ] as const).map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="recommended-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="recommended-heading" className="font-display text-2xl">
              Recommended for you
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Based on your recent fragrance preferences.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/shop">Browse all</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.recommended.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-[var(--shadow-subtle)]"
            >
              <div className="relative aspect-[4/5] bg-[var(--color-muted)]">
                <Image
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                  {product.brand}
                </p>
                <p className="mt-1 font-medium">{product.name}</p>
                <p className="mt-2 text-sm">
                  <Price amount={product.price} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

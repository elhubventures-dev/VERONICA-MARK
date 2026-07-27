import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingCoupons } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Marketing Coupons",
  description: "Review Stage 9 coupon performance, minimum-order gates, and lifecycle status across admin campaigns.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusVariant(status: "active" | "scheduled" | "exhausted" | "expired") {
  switch (status) {
    case "active":
      return "success";
    case "scheduled":
      return "warning";
    case "exhausted":
      return "secondary";
    case "expired":
    default:
      return "outline";
  }
}

export default async function MarketingCouponsPage() {
  const coupons = await getMarketingCoupons();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Coupons"
        description="Monitor promotional code usage, minimum basket controls, and expiry posture for campaign-led demand capture."
        actions={
          <AdminDemoButton label="Create coupon" message="Coupon created in demo mode." variant="default" />
        }
      />

      {coupons.length ? (
        <section aria-label="Coupon list" className="grid gap-4 xl:grid-cols-2">
          {coupons
            .slice()
            .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
            .map((coupon) => (
              <article
                key={coupon.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl text-[var(--color-foreground)]">{coupon.code}</h2>
                      <Badge variant={getStatusVariant(coupon.status)} className="rounded-lg capitalize">
                        {coupon.status}
                      </Badge>
                    </div>

                    <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{coupon.promotionName}</p>

                    <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Uses:</span>{" "}
                        {coupon.uses.toLocaleString()}
                        {coupon.maxUses ? ` / ${coupon.maxUses.toLocaleString()}` : " uncapped"}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Min order:</span>{" "}
                        {coupon.minOrder > 0 ? formatPrice(coupon.minOrder, "EUR") : "None"}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Starts:</span>{" "}
                        {formatDate(coupon.startsAt)}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Ends:</span>{" "}
                        {formatDate(coupon.endsAt)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 px-4 py-3 text-sm">
                    <p className="text-[var(--color-muted-foreground)]">Status</p>
                    <p className="mt-1 font-medium text-[var(--color-foreground)] capitalize">{coupon.status}</p>
                  </div>
                </div>
              </article>
            ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No coupons configured"
          description="Campaign codes will appear here once Stage 9 coupon generation and distribution rules are active."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { CouponForm } from "@/components/brand/coupon-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandCoupons } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Coupons",
  description: "Manage coupon campaigns, monitor status, and stage new promotional codes for the brand.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCouponStatusVariant(status: "active" | "scheduled" | "expired") {
  switch (status) {
    case "active":
      return "success";
    case "scheduled":
      return "warning";
    default:
      return "outline";
  }
}

function formatCouponValue(type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING", value: number) {
  switch (type) {
    case "PERCENTAGE":
      return `${value}% off`;
    case "FIXED_AMOUNT":
      return `€${value} off`;
    default:
      return "Free shipping";
  }
}

export default async function BrandCouponsPage() {
  const coupons = await getBrandCoupons();
  const sortedCoupons = [...coupons].sort((a, b) => a.startsAt.localeCompare(b.startsAt) * -1);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Brand Manager"
        title="Coupons"
        description="Monitor live and upcoming offers, then stage new promotional campaigns for merchandising reviews."
        actions={
          <Button asChild variant="outline">
            <Link href="/brand/flash-sales">Flash sales</Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_24rem]">
        <section className="space-y-4" aria-label="Coupons list">
          {sortedCoupons.length ? (
            sortedCoupons.map((coupon) => (
              <article
                key={coupon.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-xl">{coupon.code}</p>
                      <Badge
                        variant={getCouponStatusVariant(coupon.status)}
                        className={coupon.status !== "active" ? "capitalize" : undefined}
                      >
                        {coupon.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{coupon.title}</p>
                  </div>
                  <Badge variant="outline">{formatCouponValue(coupon.type, coupon.value)}</Badge>
                </div>

                <div className="mt-5 grid gap-4 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-3">
                  <div>
                    <p>Uses</p>
                    <p className="mt-1 font-medium text-[var(--color-foreground)]">
                      {coupon.uses}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : " uncapped"}
                    </p>
                  </div>
                  <div>
                    <p>Starts</p>
                    <p className="mt-1 font-medium text-[var(--color-foreground)]">{formatDate(coupon.startsAt)}</p>
                  </div>
                  <div>
                    <p>Ends</p>
                    <p className="mt-1 font-medium text-[var(--color-foreground)]">{formatDate(coupon.endsAt)}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <BrandEmptyState
              title="No coupons scheduled"
              description="Create a new promotional code to support launches, CRM campaigns, or private brand events."
            />
          )}
        </section>

        <aside>
          <CouponForm />
        </aside>
      </div>
    </div>
  );
}

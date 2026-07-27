import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Ticket } from "lucide-react";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { CopyCodeButton } from "@/components/account/copy-code-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountCoupons } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Manage available, used, and expired VERONICA MARK coupon codes.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCouponValueLabel(
  coupon: Awaited<ReturnType<typeof getAccountCoupons>>[number],
) {
  switch (coupon.type) {
    case "PERCENTAGE":
      return `${coupon.value}% off`;
    case "FIXED_AMOUNT":
      return `€${coupon.value.toFixed(0)} off`;
    case "FREE_SHIPPING":
      return "Free shipping";
    default:
      return coupon.title;
  }
}

export default async function AccountCouponsPage() {
  const coupons = await getAccountCoupons();
  const availableCoupons = coupons.filter((coupon) => coupon.status === "available");
  const pastCoupons = coupons.filter((coupon) => coupon.status !== "available");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Benefits"
        title="Coupons"
        description="Keep your active codes close at hand and revisit previous offers whenever you need context."
        actions={
          <Button asChild>
            <Link href="/cart">Apply in cart</Link>
          </Button>
        }
      />

      <section aria-labelledby="available-coupons-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="available-coupons-heading" className="font-display text-2xl">
              Available coupons
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Copy a code now or head to the bag when you are ready to apply it.
            </p>
          </div>
        </div>

        {availableCoupons.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {availableCoupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Badge variant="accent">{getCouponValueLabel(coupon)}</Badge>
                      <CardTitle className="flex items-center gap-2">
                        <Ticket className="size-5 text-[var(--color-primary)]" aria-hidden />
                        {coupon.title}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">Expires {formatDate(coupon.expiresAt)}</Badge>
                  </div>
                  <CardDescription>{coupon.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40 px-4 py-3">
                    <p className="text-xs tracking-[0.14em] text-[var(--color-muted-foreground)] uppercase">
                      Coupon code
                    </p>
                    <p className="mt-1 font-display text-2xl tracking-[0.18em]">{coupon.code}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <CopyCodeButton
                      value={coupon.code}
                      label="Copy code"
                      copiedLabel="Code copied"
                      successMessage={`${coupon.code} copied`}
                    />
                    <Button asChild>
                      <Link href="/cart">
                        Apply in cart
                        <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link href="/shop">Browse shop</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AccountEmptyState
            title="No active coupons right now"
            description="When new codes are unlocked through offers or purchases, they will appear here."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        )}
      </section>

      <section aria-labelledby="coupon-history-heading" className="space-y-4">
        <div>
          <h2 id="coupon-history-heading" className="font-display text-2xl">
            Used and expired
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            A simple record of codes that are no longer available.
          </p>
        </div>

        {pastCoupons.length ? (
          <div className="space-y-3">
            {pastCoupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{coupon.title}</p>
                      <Badge variant={coupon.status === "used" ? "outline" : "warning"} className="capitalize">
                        {coupon.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{coupon.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-lg bg-[var(--color-muted)] px-3 py-2 font-medium">{coupon.code}</span>
                    <span className="text-[var(--color-muted-foreground)]">{formatDate(coupon.expiresAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AccountEmptyState
            title="No previous coupon history"
            description="Used and expired codes will appear here for reference once you start redeeming offers."
            actionLabel="View available products"
            actionHref="/shop"
          />
        )}
      </section>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium">Need a basket before you redeem?</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Start shopping now and apply your preferred code when you are ready to check out.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">
              <ShoppingBag aria-hidden />
              Go to shop
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

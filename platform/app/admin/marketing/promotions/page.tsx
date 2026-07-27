import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingPromotions } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Promotion Engine",
  description: "Control Stage 9 promotion logic, priority, targeting, and attributed revenue from the admin marketing platform.",
};

function formatDateRange(startsAt: string, endsAt: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(new Date(startsAt))} to ${formatter.format(new Date(endsAt))}`;
}

function getStatusVariant(status: "draft" | "scheduled" | "active" | "ended" | "paused") {
  switch (status) {
    case "active":
      return "success";
    case "scheduled":
      return "warning";
    case "paused":
      return "secondary";
    case "ended":
      return "outline";
    case "draft":
    default:
      return "accent";
  }
}

function formatPromotionValue(type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING" | "BXGY", value: number) {
  switch (type) {
    case "PERCENTAGE":
      return `${value}% off`;
    case "FIXED_AMOUNT":
      return `${formatPrice(value, "EUR")} off`;
    case "FREE_SHIPPING":
      return "Free shipping";
    case "BXGY":
    default:
      return `Buy X Get Y x${value}`;
  }
}

export default async function MarketingPromotionsPage() {
  const promotions = await getMarketingPromotions();
  const activePromotions = promotions.filter((promotion) => promotion.status === "active").length;
  const stackablePromotions = promotions.filter((promotion) => promotion.stackable).length;
  const totalRedemptions = promotions.reduce((sum, promotion) => sum + promotion.redemptions, 0);
  const totalRevenue = promotions.reduce((sum, promotion) => sum + promotion.revenueAttributed, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Promotion engine"
        description="Operate the Stage 9 rule stack for discounts, thresholds, and catalog targeting across marketplace campaigns."
        actions={
          <>
            <AdminDemoButton
              label="Create promotion"
              message="Promotion draft created in demo mode."
              variant="default"
            />
            <AdminDemoButton label="Pause active rules" message="Active promotions paused in demo mode." />
          </>
        }
      />

      {promotions.length ? (
        <>
          <section aria-label="Promotion overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Active rules</p>
              <p className="mt-2 font-display text-3xl text-[var(--color-foreground)]">{activePromotions}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Stackable offers</p>
              <p className="mt-2 font-display text-3xl text-[var(--color-foreground)]">{stackablePromotions}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Redemptions</p>
              <p className="mt-2 font-display text-3xl text-[var(--color-foreground)]">
                {totalRedemptions.toLocaleString()}
              </p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Attributed revenue</p>
              <p className="mt-2 font-display text-3xl text-[var(--color-foreground)]">
                {formatPrice(totalRevenue, "EUR")}
              </p>
            </article>
          </section>

          <section aria-label="Promotion rules" className="grid gap-4 2xl:grid-cols-2">
            {promotions
              .slice()
              .sort((a, b) => b.priority - a.priority)
              .map((promotion) => (
                <article
                  key={promotion.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-2xl text-[var(--color-foreground)]">{promotion.name}</h2>
                        <Badge variant={getStatusVariant(promotion.status)} className="rounded-lg capitalize">
                          {promotion.status}
                        </Badge>
                        <Badge variant="outline" className="rounded-lg">
                          {promotion.type.replaceAll("_", " ")}
                        </Badge>
                      </div>

                      <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
                        {formatPromotionValue(promotion.type, promotion.value)} applied to {promotion.targeting}.
                      </p>

                      <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-3">
                        <p>
                          <span className="font-medium text-[var(--color-foreground)]">Priority:</span>{" "}
                          {promotion.priority}
                        </p>
                        <p>
                          <span className="font-medium text-[var(--color-foreground)]">Stackable:</span>{" "}
                          {promotion.stackable ? "Yes" : "No"}
                        </p>
                        <p>
                          <span className="font-medium text-[var(--color-foreground)]">Window:</span>{" "}
                          {formatDateRange(promotion.startsAt, promotion.endsAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-full gap-3 text-sm xl:min-w-[15rem]">
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                        <p className="text-[var(--color-muted-foreground)]">Redemptions</p>
                        <p className="mt-1 font-medium text-[var(--color-foreground)]">
                          {promotion.redemptions.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                        <p className="text-[var(--color-muted-foreground)]">Revenue</p>
                        <p className="mt-1 font-medium text-[var(--color-foreground)]">
                          {formatPrice(promotion.revenueAttributed, "EUR")}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AdminDemoButton
                          label="Pause"
                          message={`${promotion.name} paused in demo mode.`}
                          variant="outline"
                        />
                        <AdminDemoButton
                          label="Duplicate"
                          message={`${promotion.name} duplicated in demo mode.`}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </section>
        </>
      ) : (
        <AdminEmptyState
          title="No promotion rules yet"
          description="Discount logic, threshold campaigns, and launch-specific rule stacks will appear here once Stage 9 promotions are configured."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

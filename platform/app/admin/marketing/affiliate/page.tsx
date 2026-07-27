import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingAffiliates } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Marketing Affiliate",
  description:
    "Review the Stage 9 partner-program extension for affiliates, including commission performance and payout posture, before a Prisma Affiliate model exists.",
};

function getStatusVariant(status: "pending" | "active" | "paused" | "rejected") {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "paused":
      return "secondary";
    case "rejected":
    default:
      return "outline";
  }
}

export default async function MarketingAffiliatePage() {
  const affiliates = await getMarketingAffiliates();
  const activePartners = affiliates.filter((affiliate) => affiliate.status === "active").length;
  const pendingPartners = affiliates.filter((affiliate) => affiliate.status === "pending").length;
  const totalPayouts = affiliates.reduce((sum, affiliate) => sum + affiliate.payoutDue, 0);
  const avgCommission = affiliates.length
    ? affiliates.reduce((sum, affiliate) => sum + affiliate.commissionPercent, 0) / affiliates.length
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Affiliate"
        description="Affiliate is a Stage 9 partner program extension with demo-backed workflows only for now; no Prisma Affiliate model exists yet."
        actions={
          <>
            <AdminDemoButton
              label="Approve partner"
              message="Affiliate partner approved in demo mode."
              variant="default"
            />
            <AdminDemoButton label="Pause payouts" message="Affiliate payouts paused in demo mode." />
          </>
        }
      />

      {affiliates.length ? (
        <>
          <section aria-label="Affiliate KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Partners</p>
              <p className="mt-2 font-display text-3xl">{affiliates.length}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Active</p>
              <p className="mt-2 font-display text-3xl">{activePartners}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Pending</p>
              <p className="mt-2 font-display text-3xl">{pendingPartners}</p>
            </article>
            <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">Payouts due</p>
              <p className="mt-2 font-display text-3xl">{formatPrice(totalPayouts, "NGN")}</p>
            </article>
          </section>

          <section aria-label="Affiliate partner list" className="space-y-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-subtle)]">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Average commission{" "}
                <span className="font-medium text-[var(--color-foreground)]">{avgCommission.toFixed(1)}%</span>
              </p>
            </div>

            {affiliates.map((affiliate) => (
              <article
                key={affiliate.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl text-[var(--color-foreground)]">{affiliate.name}</h2>
                      <Badge variant={getStatusVariant(affiliate.status)} className="rounded-lg capitalize">
                        {affiliate.status}
                      </Badge>
                      <Badge variant="outline" className="rounded-lg">
                        {affiliate.commissionPercent}% commission
                      </Badge>
                    </div>

                    <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Email:</span>{" "}
                        {affiliate.email}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Clicks:</span>{" "}
                        {affiliate.clicks.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Conversions:</span>{" "}
                        {affiliate.conversions.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Payout due:</span>{" "}
                        {formatPrice(affiliate.payoutDue, affiliate.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    {affiliate.status === "pending" ? (
                      <AdminDemoButton
                        label="Approve"
                        message={`${affiliate.name} approved in demo mode.`}
                        variant="default"
                      />
                    ) : null}
                    {affiliate.status !== "paused" ? (
                      <AdminDemoButton label="Pause" message={`${affiliate.name} paused in demo mode.`} />
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <AdminEmptyState
          title="No affiliate partners yet"
          description="Stage 9 partner records will appear here as the affiliate extension begins onboarding publishers and creators."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

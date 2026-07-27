import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { formatPrice } from "@/lib/commerce/format-price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingReferral } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Marketing Referral",
  description: "Review Stage 9 referral program performance, invitation conversion, and top-performing customer codes.",
};

export default async function MarketingReferralPage() {
  const referral = await getMarketingReferral();
  const conversionRate =
    referral.invitationsSent > 0 ? (referral.conversions / referral.invitationsSent) * 100 : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Referral"
        description="Measure invitation efficiency, code usage, and paid referral rewards across the marketplace growth loop."
      />

      <section aria-label="Referral KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Codes issued</p>
          <p className="mt-2 font-display text-3xl">{referral.codesIssued.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Invitations sent</p>
          <p className="mt-2 font-display text-3xl">{referral.invitationsSent.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Conversions</p>
          <p className="mt-2 font-display text-3xl">{referral.conversions.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]">
          <p className="text-sm text-[var(--color-muted-foreground)]">Conversion rate</p>
          <p className="mt-2 font-display text-3xl">{conversionRate.toFixed(1)}%</p>
        </article>
      </section>

      <section aria-label="Top referral codes" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Top codes</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Highest-performing referral owners ranked by completed conversions and earned rewards.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm shadow-[var(--shadow-subtle)]">
            <span className="text-[var(--color-muted-foreground)]">Rewards paid:</span>{" "}
            <span className="font-medium text-[var(--color-foreground)]">
              {formatPrice(referral.rewardsPaid, referral.currency)}
            </span>
          </div>
        </div>

        {referral.topCodes.length ? (
          <div className="space-y-3">
            {referral.topCodes.map((entry, index) => (
              <article
                key={entry.code}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl text-[var(--color-foreground)]">{entry.code}</h3>
                      <Badge variant="outline" className="rounded-lg">
                        Top {index + 1}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{entry.owner}</p>
                  </div>

                  <div className="grid gap-2 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 sm:text-right">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Conversions:</span>{" "}
                      {entry.conversions}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Earned:</span>{" "}
                      {formatPrice(entry.earned, referral.currency)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No referral codes yet"
            description="Top-performing referrers will appear here as soon as customer referral issuance is active."
            actionLabel="Back to marketing"
            actionHref="/admin/marketing"
          />
        )}
      </section>
    </div>
  );
}

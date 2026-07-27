import type { Metadata } from "next";
import { CheckCircle2, MessageSquareQuote, ShieldCheck, XCircle } from "lucide-react";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingReviews } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Review System",
  description: "Moderate marketplace reviews, verify trust signals, and keep product feedback flowing with fast approve or reject actions.",
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
  if (status === "approved") return "success";
  if (status === "rejected") return "error";
  if (status === "pending") return "warning";
  return "outline";
}

export default async function MarketingReviewsPage() {
  const reviews = await getMarketingReviews();

  const pendingCount = reviews.filter((review) => review.status === "pending").length;
  const approvedCount = reviews.filter((review) => review.status === "approved").length;
  const rejectedCount = reviews.filter((review) => review.status === "rejected").length;
  const verifiedCount = reviews.filter((review) => review.verifiedPurchase).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Review system"
        description="Keep shopper-generated feedback high quality with quick moderation and visibility into approval outcomes."
      />

      <section aria-label="Review system KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pending" value={pendingCount.toLocaleString()} icon={MessageSquareQuote} />
        <KpiCard label="Approved" value={approvedCount.toLocaleString()} icon={CheckCircle2} />
        <KpiCard label="Rejected" value={rejectedCount.toLocaleString()} icon={XCircle} />
        <KpiCard label="Verified purchases" value={verifiedCount.toLocaleString()} icon={ShieldCheck} />
      </section>

      {reviews.length ? (
        <section className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{review.productName}</h2>
                    <Badge variant={getStatusBadge(review.status)} className="rounded-lg capitalize">
                      {review.status}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg">
                      {review.rating}★
                    </Badge>
                    {review.verifiedPurchase ? (
                      <Badge variant="success" className="rounded-lg">
                        Verified
                      </Badge>
                    ) : null}
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)]">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Author:</span> {review.author}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Submitted:</span>{" "}
                      {formatDateTime(review.submittedAt)}
                    </p>
                    <p className="max-w-3xl leading-6">{review.excerpt}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <AdminDemoButton
                    label="Approve"
                    message={`${review.productName} review approved (demo)`}
                    variant="default"
                  />
                  <AdminDemoButton
                    label="Reject"
                    message={`${review.productName} review rejected (demo)`}
                    variant="destructive"
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No reviews to moderate"
          description="New shopper feedback will appear here once the review pipeline starts receiving submissions."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

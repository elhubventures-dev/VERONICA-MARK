import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminFraudCases } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Fraud Monitoring",
  description: "Review flagged marketplace activity, prioritize high-severity cases, and trigger trust operations follow-up.",
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSeverityVariant(severity: "low" | "medium" | "high") {
  switch (severity) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
    default:
      return "outline";
  }
}

function getStatusVariant(status: "open" | "reviewing" | "resolved" | "blocked") {
  switch (status) {
    case "blocked":
      return "error";
    case "resolved":
      return "success";
    case "reviewing":
      return "warning";
    case "open":
    default:
      return "outline";
  }
}

export default async function AdminFraudPage() {
  const cases = await getAdminFraudCases();
  const sortedCases = [...cases].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Fraud monitoring"
        description="Triage suspicious payments, account anomalies, and promotional abuse with clear severity scoring and fast containment actions."
      />

      {sortedCases.length ? (
        <section aria-label="Fraud case queue" className="space-y-4">
          {sortedCases.map((caseItem) => (
            <article
              key={caseItem.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{caseItem.subject}</h2>
                    <Badge variant={getSeverityVariant(caseItem.severity)} className="rounded-lg capitalize">
                      {caseItem.severity}
                    </Badge>
                    <Badge variant={getStatusVariant(caseItem.status)} className="rounded-lg capitalize">
                      {caseItem.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2 xl:grid-cols-4">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Type:</span> {caseItem.type}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Risk score:</span> {caseItem.score}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Created:</span>{" "}
                      {formatTimestamp(caseItem.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Queue state:</span> {caseItem.status}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <AdminDemoButton
                    label="Resolve"
                    message={`${caseItem.subject} marked resolved in demo mode.`}
                    variant="default"
                  />
                  <AdminDemoButton
                    label="Block"
                    message={`${caseItem.subject} blocked in demo mode.`}
                    variant="destructive"
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No fraud cases"
          description="Flagged payments, velocity anomalies, and promo abuse alerts will surface here when the risk engine opens a case."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}

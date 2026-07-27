import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminReports } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Reports",
  description: "Generate and download cross-platform reporting packs for finance, operations, and trust reviews.",
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

export default async function AdminReportsPage() {
  const reports = await getAdminReports();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Reports"
        description="Prepare board-ready exports for marketplace growth, payments reliability, and trust operations without leaving the admin workspace."
      />

      {reports.length ? (
        <section aria-label="Available reports" className="grid gap-4 xl:grid-cols-2">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{report.title}</h2>
                    <Badge variant="outline" className="rounded-lg">
                      {report.format}
                    </Badge>
                  </div>

                  <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted-foreground)]">
                    {report.description}
                  </p>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Format:</span> {report.format}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Last generated:</span>{" "}
                      {formatTimestamp(report.lastGeneratedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <AdminDemoButton
                    label="Generate"
                    message={`${report.title} queued for generation in demo mode.`}
                    variant="default"
                  />
                  <AdminDemoButton
                    label="Download"
                    message={`${report.title} download started in demo mode.`}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No reports available"
          description="Scheduled finance, analytics, and compliance exports will appear here once report definitions are configured."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}

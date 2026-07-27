import type { Metadata } from "next";

import { ReportActions } from "@/components/brand/report-actions";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBrandReports } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Reports",
  description: "Generate and download operational and performance reports for the VERONICA MARK brand workspace.",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function getFormatVariant(format: "CSV" | "XLSX" | "PDF") {
  if (format === "PDF") return "accent";
  if (format === "XLSX") return "secondary";
  return "outline";
}

export default async function BrandReportsPage() {
  const reports = await getBrandReports();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Brand Manager"
        title="Reports"
        description="Prepare executive-ready exports for sales, inventory, promotions, and customer performance."
      />

      <section aria-label="Available reports" className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="h-full">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <CardTitle>{report.title}</CardTitle>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{report.description}</p>
                </div>
                <Badge variant={getFormatVariant(report.format)}>{report.format}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-6">
              <dl className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">Format</dt>
                  <dd className="mt-1 font-medium text-[var(--color-foreground)]">{report.format}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                    Last generated
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--color-foreground)]">{formatDate(report.lastGeneratedAt)}</dd>
                </div>
              </dl>

              <div className="mt-auto">
                <ReportActions reportTitle={report.title} reportFormat={report.format} href={report.href} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

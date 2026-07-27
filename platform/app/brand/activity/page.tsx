import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getBrandActivityLogs } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Activity",
  description: "Review an audit-style timeline of actions taken across the brand workspace.",
};

function formatTimestamp(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function BrandActivityPage() {
  const logs = (await getBrandActivityLogs()).slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Brand Manager"
        title="Activity logs"
        description="Chronological audit activity for product, inventory, order, promotion, and media events."
      />

      <section
        aria-labelledby="activity-feed-heading"
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="activity-feed-heading" className="font-display text-2xl text-[var(--color-foreground)]">
              Audit trail
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Conceptually aligned with a Prisma `AuditLog` stream for brand-scoped operations.
            </p>
          </div>
          <span className="text-sm text-[var(--color-muted-foreground)]">{logs.length} total events</span>
        </div>

        <ol className="mt-8 space-y-4">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/70 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[var(--color-foreground)]">{log.actor}</p>
                    <Badge variant="outline" className="rounded-lg">
                      {log.action}
                    </Badge>
                    <Badge variant="secondary" className="rounded-lg">
                      {log.resource}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="font-display text-lg text-[var(--color-foreground)]">{log.summary}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      Resource record: <span className="font-medium text-[var(--color-foreground)]">{log.recordId}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-sm text-[var(--color-muted-foreground)]">{formatTimestamp(log.createdAt)}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminSystemLogs } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin System Logs",
  description: "Inspect recent platform service logs with quick visual emphasis for informational, warning, and error events.",
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

function getLevelVariant(level: "info" | "warn" | "error") {
  switch (level) {
    case "info":
      return "secondary";
    case "warn":
      return "warning";
    case "error":
    default:
      return "error";
  }
}

export default async function AdminLogsPage() {
  const logs = await getAdminSystemLogs();
  const sortedLogs = [...logs].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="System logs"
        description="Track recent events across authentication, checkout, payments, and shipping with immediate level-based signal for incident response."
      />

      {sortedLogs.length ? (
        <section aria-label="System log stream" className="space-y-4">
          {sortedLogs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getLevelVariant(log.level)} className="rounded-lg uppercase">
                      {log.level}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg">
                      {log.service}
                    </Badge>
                  </div>

                  <p className="font-medium text-[var(--color-foreground)]">{log.message}</p>
                </div>

                <p className="text-sm text-[var(--color-muted-foreground)] lg:text-right">
                  {formatTimestamp(log.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No log events available"
          description="System activity from core marketplace services will appear here once observability streams are connected."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}

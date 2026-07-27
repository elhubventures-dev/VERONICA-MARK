import type { Metadata } from "next";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminAuditLogs } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Audit Logs",
  description: "Inspect the chronological platform audit trail for administrative actions, automated jobs, and security-sensitive changes.",
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

export default async function AdminAuditLogsPage() {
  const logs = await getAdminAuditLogs();
  const sortedLogs = [...logs].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Audit logs"
        description="Trace who changed what, when it happened, and from which IP address so compliance, trust, and ops teams can investigate confidently."
      />

      {sortedLogs.length ? (
        <section aria-label="Chronological audit list" className="space-y-4">
          {sortedLogs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-lg">
                      {log.action}
                    </Badge>
                    <Badge variant="secondary" className="rounded-lg">
                      {log.resource}
                    </Badge>
                  </div>

                  <div>
                    <h2 className="font-medium text-[var(--color-foreground)]">{log.summary}</h2>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                      Actor: {log.actor} · Record: {log.recordId}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-[var(--color-muted-foreground)] lg:text-right">
                  <p>
                    <span className="font-medium text-[var(--color-foreground)]">Time:</span>{" "}
                    {formatTimestamp(log.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--color-foreground)]">IP:</span> {log.ip}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="Audit trail is empty"
          description="Administrative actions and system-generated changes will be recorded here as the platform scales."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}

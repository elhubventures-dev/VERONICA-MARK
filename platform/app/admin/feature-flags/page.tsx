import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminFeatureFlags } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Feature Flags",
  description: "Control staged platform rollouts, environment targeting, and operational toggles across the marketplace.",
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

export default async function AdminFeatureFlagsPage() {
  const flags = await getAdminFeatureFlags();
  const enabledCount = flags.filter((flag) => flag.enabled).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Feature flags"
        description="Roll out critical product changes progressively, isolate environment-specific behavior, and reduce release risk across VERONICA MARK."
      />

      <section aria-label="Feature flag overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Total flags</p>
          <p className="mt-2 font-display text-3xl">{flags.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Enabled</p>
          <p className="mt-2 font-display text-3xl">{enabledCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Progressive rollouts</p>
          <p className="mt-2 font-display text-3xl">
            {flags.filter((flag) => flag.rolloutPercent > 0 && flag.rolloutPercent < 100).length}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Production exposure</p>
          <p className="mt-2 font-display text-3xl">
            {flags.filter((flag) => flag.environments.includes("production")).length}
          </p>
        </div>
      </section>

      {flags.length ? (
        <section aria-label="Feature flag registry" className="space-y-4">
          {flags.map((flag) => (
            <article
              key={flag.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{flag.key}</h2>
                    <Badge variant={flag.enabled ? "success" : "outline"} className="rounded-lg">
                      {flag.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg">
                      {flag.rolloutPercent}% rollout
                    </Badge>
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-[var(--color-muted-foreground)]">
                    {flag.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="text-[var(--color-muted-foreground)]">Rollout progress</span>
                        <span className="font-medium text-[var(--color-foreground)]">{flag.rolloutPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--color-muted)]">
                        <div
                          className="h-2 rounded-full bg-[var(--color-primary)] transition-[width]"
                          style={{ width: `${flag.rolloutPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Environments:</span>{" "}
                        {flag.environments.join(", ")}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Updated:</span>{" "}
                        {formatTimestamp(flag.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <AdminDemoButton
                    label={flag.enabled ? "Disable" : "Enable"}
                    message={`${flag.key} ${flag.enabled ? "disabled" : "enabled"} in demo mode.`}
                    variant={flag.enabled ? "destructive" : "default"}
                  />
                  <AdminDemoButton
                    label="Adjust rollout"
                    message={`${flag.key} rollout updated in demo mode.`}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No feature flags configured"
          description="Operational and product release toggles will appear here once the platform team registers controlled rollouts."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}

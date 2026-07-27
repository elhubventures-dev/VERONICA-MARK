import type { Metadata } from "next";
import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingAutomations } from "@/lib/marketing/queries";
import { PauseCircle, PlayCircle, Radar, Workflow } from "@/components/icons";

export const metadata: Metadata = {
  title: "Marketing Automation",
  description: "Operate Stage 9 lifecycle automations, track run volume, and pause or activate demo workflows from admin.",
};

export default async function MarketingAutomationPage() {
  const automations = await getMarketingAutomations();

  const activeCount = automations.filter((automation) => automation.status === "active").length;
  const pausedCount = automations.filter((automation) => automation.status === "paused").length;
  const totalRuns = automations.reduce((sum, automation) => sum + automation.runs30d, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Automation"
        description="Manage lifecycle rules that trigger reminders, launch sequences, and retention follow-ups without manual intervention."
        actions={
          <>
            <AdminDemoButton label="Activate flow" message="Automation activated (demo)" variant="default" />
            <AdminDemoButton label="Pause flow" message="Automation paused (demo)" />
          </>
        }
      />

      <section aria-label="Automation KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Automations" value={automations.length.toLocaleString()} icon={<Workflow className="size-4" />} />
        <KpiCard label="Active" value={activeCount.toLocaleString()} icon={<PlayCircle className="size-4" />} />
        <KpiCard label="Paused" value={pausedCount.toLocaleString()} icon={<PauseCircle className="size-4" />} />
        <KpiCard label="Runs (30d)" value={totalRuns.toLocaleString()} icon={<Radar className="size-4" />} />
      </section>

      {automations.length ? (
        <section className="space-y-4">
          {automations.map((automation) => (
            <article
              key={automation.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{automation.name}</h2>
                    <Badge
                      variant={automation.status === "active" ? "success" : "outline"}
                      className="rounded-lg capitalize"
                    >
                      {automation.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] md:grid-cols-2">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Trigger:</span> {automation.trigger}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Action:</span> {automation.action}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Runs in last 30 days:</span>{" "}
                      {automation.runs30d.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <AdminDemoButton
                    label={automation.status === "active" ? "Pause" : "Activate"}
                    message={`${automation.name} ${automation.status === "active" ? "paused" : "activated"} (demo)`}
                    variant={automation.status === "active" ? "outline" : "default"}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No automation workflows"
          description="Lifecycle and promotional automations will appear here once Stage 9 workflow rules are configured."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

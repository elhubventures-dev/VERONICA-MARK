import type { Metadata } from "next";
import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingRecommendations } from "@/lib/marketing/queries";
import { Bot, MousePointerClick, Sparkles, ToggleLeft } from "@/components/icons";

export const metadata: Metadata = {
  title: "Recommendations",
  description: "Review recommendation placements, activation status, and click-through performance across key storefront modules.",
};

export default async function MarketingRecommendationsPage() {
  const configs = await getMarketingRecommendations();

  const enabledCount = configs.filter((config) => config.enabled).length;
  const disabledCount = configs.filter((config) => !config.enabled).length;
  const averageCtr = configs.length > 0 ? configs.reduce((sum, config) => sum + config.ctr, 0) / configs.length : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Recommendations"
        description="Manage recommendation placements that drive discovery from home, product detail, and cart contexts."
        actions={
          <>
            <AdminDemoButton label="Enable module" message="Recommendation module enabled (demo)" variant="default" />
            <AdminDemoButton label="Disable module" message="Recommendation module disabled (demo)" />
          </>
        }
      />

      <section aria-label="Recommendation KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Placements" value={configs.length.toLocaleString()} icon={<Sparkles className="size-4" />} />
        <KpiCard label="Enabled" value={enabledCount.toLocaleString()} icon={<ToggleLeft className="size-4" />} />
        <KpiCard label="Disabled" value={disabledCount.toLocaleString()} icon={<Bot className="size-4" />} />
        <KpiCard label="Average CTR" value={`${averageCtr.toFixed(1)}%`} icon={<MousePointerClick className="size-4" />} />
      </section>

      {configs.length ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {configs.map((config) => (
            <article
              key={config.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{config.name}</h2>
                    <Badge variant={config.enabled ? "success" : "outline"} className="rounded-lg">
                      {config.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)]">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Placement:</span> {config.placement}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Algorithm:</span> {config.algorithm}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">CTR:</span> {config.ctr.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <AdminDemoButton
                    label={config.enabled ? "Disable" : "Enable"}
                    message={`${config.name} ${config.enabled ? "disabled" : "enabled"} (demo)`}
                    variant={config.enabled ? "outline" : "default"}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No recommendation modules"
          description="Recommendation placements will appear here once personalization modules are configured for the storefront."
          actionLabel="Back to dashboard"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

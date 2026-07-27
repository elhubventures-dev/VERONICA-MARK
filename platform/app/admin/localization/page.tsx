import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminLocales } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Localization",
  description: "Track locale readiness, language coverage, and currency defaults for international expansion.",
};

export default async function AdminLocalizationPage() {
  const locales = await getAdminLocales();
  const averageCoverage = locales.length
    ? Math.round(locales.reduce((sum, locale) => sum + locale.coveragePercent, 0) / locales.length)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Localization"
        description="Monitor translation coverage, control which languages are live, and keep regional storefront defaults aligned with launch readiness."
      />

      <section aria-label="Localization overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Locales tracked</p>
          <p className="mt-2 font-display text-3xl">{locales.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Enabled</p>
          <p className="mt-2 font-display text-3xl">{locales.filter((locale) => locale.enabled).length}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Average coverage</p>
          <p className="mt-2 font-display text-3xl">{averageCoverage}%</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Launch ready</p>
          <p className="mt-2 font-display text-3xl">
            {locales.filter((locale) => locale.coveragePercent >= 80).length}
          </p>
        </div>
      </section>

      {locales.length ? (
        <section aria-label="Locale coverage registry" className="grid gap-4 xl:grid-cols-2">
          {locales.map((locale) => (
            <article
              key={locale.code}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{locale.name}</h2>
                    <Badge variant={locale.enabled ? "success" : "outline"} className="rounded-lg uppercase">
                      {locale.code}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg">
                      {locale.defaultCurrency}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="text-[var(--color-muted-foreground)]">Translation coverage</span>
                        <span className="font-medium text-[var(--color-foreground)]">{locale.coveragePercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--color-muted)]">
                        <div
                          className="h-2 rounded-full bg-[var(--color-accent)] transition-[width]"
                          style={{ width: `${locale.coveragePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Status:</span>{" "}
                        {locale.enabled ? "Live storefront locale" : "Hidden until ready"}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Default currency:</span>{" "}
                        {locale.defaultCurrency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <AdminDemoButton
                    label={locale.enabled ? "Disable" : "Enable"}
                    message={`${locale.name} ${locale.enabled ? "disabled" : "enabled"} in demo mode.`}
                    variant={locale.enabled ? "destructive" : "default"}
                  />
                  <AdminDemoButton
                    label="Review coverage"
                    message={`${locale.name} coverage review opened in demo mode.`}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No locales configured"
          description="Language packs and regional storefront settings will appear here once international rollout planning begins."
          actionLabel="Back to dashboard"
          actionHref="/admin"
        />
      )}
    </div>
  );
}

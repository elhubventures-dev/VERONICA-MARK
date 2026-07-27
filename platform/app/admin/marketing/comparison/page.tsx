import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingComparison } from "@/lib/marketing/queries";
import { GitCompareArrows, TrendingUp, Users } from "@/components/icons";

export const metadata: Metadata = {
  title: "Product Comparison",
  description: "Monitor comparison behavior, pair popularity, and the conversion impact of side-by-side product evaluation.",
};

export default async function MarketingComparisonPage() {
  const comparison = await getMarketingComparison();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Product comparison"
        description="Track how shoppers use the comparison experience and which combinations most often drive evaluation."
      />

      <section aria-label="Comparison KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Comparison sessions" value={comparison.sessions.toLocaleString()} icon={<Users className="size-4" />} />
        <KpiCard
          label="Average products compared"
          value={comparison.productsComparedAvg.toFixed(1)}
          icon={<GitCompareArrows className="size-4" />}
        />
        <KpiCard label="Conversion lift" value={`${comparison.conversionLift.toFixed(1)}%`} icon={<TrendingUp className="size-4" />} />
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Top product pairs</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Focus merchandising and recommendation logic around the combinations shoppers compare most often.
            </p>
          </div>
          <Badge variant="outline" className="rounded-lg">
            {comparison.topPairs.length} tracked pairs
          </Badge>
        </div>

        <div className="mt-6 grid gap-4">
          {comparison.topPairs.map((pair, index) => (
            <article key={`${pair.a}-${pair.b}`} className="rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-lg">
                      #{index + 1}
                    </Badge>
                    <h3 className="font-medium text-[var(--color-foreground)]">
                      {pair.a} <span className="text-[var(--color-muted-foreground)]">vs</span> {pair.b}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Shared comparison exposure for high-intent product evaluation journeys.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                  <ShoppingBag className="size-4 text-[var(--color-primary)]" aria-hidden />
                  <span>
                    <span className="font-medium text-[var(--color-foreground)]">{pair.count.toLocaleString()}</span>{" "}
                    sessions
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getMarketingRewardRules } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Marketing Rewards",
  description: "Manage Stage 9 reward earn, redeem, and expiry rules that shape wallet and loyalty behavior.",
};

function getTypeVariant(type: "earn" | "redeem" | "expire") {
  switch (type) {
    case "earn":
      return "success";
    case "redeem":
      return "accent";
    case "expire":
    default:
      return "warning";
  }
}

export default async function MarketingRewardsPage() {
  const rules = await getMarketingRewardRules();
  const sections: Array<{ type: "earn" | "redeem" | "expire"; title: string; description: string }> = [
    {
      type: "earn",
      title: "Earn rules",
      description: "Point accrual logic used across purchases, reviews, and campaign-triggered customer actions.",
    },
    {
      type: "redeem",
      title: "Redeem rules",
      description: "How customers convert points into wallet or checkout value inside the Stage 9 loyalty flow.",
    },
    {
      type: "expire",
      title: "Expire rules",
      description: "Time-based rules that keep liabilities controlled and customer expectations explicit.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Rewards"
        description="Define the loyalty operating model with clear earn, redeem, and expiry rules for points-backed retention."
        actions={<AdminDemoButton label="Toggle rule" message="Reward rule toggled in demo mode." variant="default" />}
      />

      {rules.length ? (
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionRules = rules.filter((rule) => rule.type === section.type);

            return (
              <section key={section.type} aria-label={section.title} className="space-y-4">
                <div>
                  <h2 className="font-display text-2xl text-[var(--color-foreground)]">{section.title}</h2>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{section.description}</p>
                </div>

                {sectionRules.length ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {sectionRules.map((rule) => (
                      <article
                        key={rule.id}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-xl text-[var(--color-foreground)]">{rule.name}</h3>
                              <Badge variant={getTypeVariant(rule.type)} className="rounded-lg capitalize">
                                {rule.type}
                              </Badge>
                              <Badge variant={rule.active ? "success" : "outline"} className="rounded-lg">
                                {rule.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
                              {rule.description}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 px-4 py-3 text-sm">
                            <p className="text-[var(--color-muted-foreground)]">Rule value</p>
                            <p className="mt-1 font-medium text-[var(--color-foreground)]">
                              {rule.points ? `${rule.points.toLocaleString()} pts` : "Policy-based"}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState
                    title={`No ${section.type} rules`}
                    description={`Stage 9 ${section.type} configuration will appear here once loyalty rules are defined.`}
                    className="py-10"
                  />
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState
          title="No reward rules found"
          description="Stage 9 loyalty rules will appear here once rewards configuration is available."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

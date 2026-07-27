import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MousePointerClick, ScrollText } from "lucide-react";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { BrandComplianceChecklist } from "@/components/marketing/brand-compliance-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMarketingEmailCampaigns } from "@/lib/marketing/queries";

export const metadata: Metadata = {
  title: "Email Campaigns",
  description: "Review scheduled, draft, and recently sent email campaigns across platform lifecycle and promotional flows.",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: string) {
  if (status === "sent") return "success";
  if (status === "scheduled") return "warning";
  if (status === "draft") return "outline";
  return "secondary";
}

export default async function MarketingEmailCampaignsPage() {
  const campaigns = await getMarketingEmailCampaigns();

  const draftCount = campaigns.filter((campaign) => campaign.status === "draft").length;
  const scheduledCount = campaigns.filter((campaign) => campaign.status === "scheduled").length;
  const averageOpenRate =
    campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / campaigns.length : 0;
  const averageClickRate =
    campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.clickRate, 0) / campaigns.length : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Email campaigns"
        description="Manage launch messaging, lifecycle nudges, and loyalty communications with clear visibility into planned and recent sends."
        actions={
          <>
            <AdminDemoButton
              label="New campaign"
              message="Email campaign draft created (demo). Complete brand compliance before scheduling."
              variant="default"
            />
            <Button asChild variant="outline">
              <Link href="/admin/marketing/brand-standards">Brand standards</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/email-templates">Templates</Link>
            </Button>
          </>
        }
      />

      <BrandComplianceChecklist
        compact
        storageKey="vm-email-campaign-compliance"
        className="shadow-[var(--shadow-subtle)]"
      />

      <section aria-label="Email campaign KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Campaigns" value={campaigns.length.toLocaleString()} icon={Mail} />
        <KpiCard label="Drafts" value={draftCount.toLocaleString()} icon={ScrollText} />
        <KpiCard label="Scheduled" value={scheduledCount.toLocaleString()} icon={Clock3} />
        <KpiCard label="Average click rate" value={`${averageClickRate.toFixed(1)}%`} icon={MousePointerClick} />
      </section>

      {campaigns.length ? (
        <section className="space-y-4">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-[var(--color-foreground)]">{campaign.name}</h2>
                    <Badge variant={getStatusBadge(campaign.status)} className="rounded-lg capitalize">
                      {campaign.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] md:grid-cols-2 xl:grid-cols-3">
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Audience:</span> {campaign.audience}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Template:</span>{" "}
                      {campaign.templateKey}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Scheduled:</span>{" "}
                      {formatDateTime(campaign.scheduledAt)}
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Open rate:</span>{" "}
                      {campaign.openRate.toFixed(1)}%
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Click rate:</span>{" "}
                      {campaign.clickRate.toFixed(1)}%
                    </p>
                    <p>
                      <span className="font-medium text-[var(--color-foreground)]">Performance:</span>{" "}
                      {campaign.openRate > averageOpenRate ? "Above baseline" : "Needs optimization"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <AdminDemoButton label="Edit draft" message={`${campaign.name} opened in demo editor.`} />
                  <AdminDemoButton label="Duplicate" message={`${campaign.name} duplicated (demo)`} />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No email campaigns yet"
          description="Campaigns will appear here once lifecycle, launch, or promotional sends are scheduled for delivery."
          actionLabel="Open templates"
          actionHref="/admin/email-templates"
        />
      )}
    </div>
  );
}

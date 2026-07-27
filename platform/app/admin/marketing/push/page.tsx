import type { Metadata } from "next";
import Link from "next/link";
import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { BrandComplianceChecklist } from "@/components/marketing/brand-compliance-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMarketingPush } from "@/lib/marketing/queries";
import { Bell, CalendarClock, Send, Users } from "@/components/icons";

export const metadata: Metadata = {
  title: "Push Notifications",
  description: "Plan and review push notification sends for lifecycle, promotional, and flash sale engagement.",
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
  return "outline";
}

export default async function MarketingPushPage() {
  const campaigns = await getMarketingPush();

  const scheduledCount = campaigns.filter((campaign) => campaign.status === "scheduled").length;
  const sentCount = campaigns.filter((campaign) => campaign.status === "sent").length;
  const totalRecipients = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0);
  const averageOpenRate =
    campaigns.length > 0
      ? campaigns.reduce((sum, campaign) => sum + (campaign.sent ? (campaign.opens / campaign.sent) * 100 : 0), 0) /
        campaigns.length
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Push notifications"
        description="Coordinate time-sensitive push sends for launches, reminders, and repeat engagement across opted-in shoppers."
        actions={
          <>
            <AdminDemoButton
              label="Compose push"
              message="Push draft created (demo). Complete brand compliance before sending."
              variant="default"
            />
            <Button asChild variant="outline">
              <Link href="/admin/marketing/brand-standards">Brand standards</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/marketing/scheduling">Open schedule</Link>
            </Button>
          </>
        }
      />

      <BrandComplianceChecklist compact storageKey="vm-push-campaign-compliance" />

      <section aria-label="Push notification KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Scheduled" value={scheduledCount.toLocaleString()} icon={<CalendarClock className="size-4" />} />
        <KpiCard label="Sent campaigns" value={sentCount.toLocaleString()} icon={<Bell className="size-4" />} />
        <KpiCard label="Sent recipients" value={totalRecipients.toLocaleString()} icon={<Send className="size-4" />} />
        <KpiCard label="Average open rate" value={`${averageOpenRate.toFixed(1)}%`} icon={<Users className="size-4" />} />
      </section>

      {campaigns.length ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {campaigns.map((campaign) => {
            const openRate = campaign.sent ? (campaign.opens / campaign.sent) * 100 : 0;
            return (
              <article
                key={campaign.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl text-[var(--color-foreground)]">{campaign.title}</h2>
                      <Badge variant={getStatusBadge(campaign.status)} className="rounded-lg capitalize">
                        {campaign.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-[var(--color-muted-foreground)]">{campaign.audience}</p>

                    <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Scheduled:</span>{" "}
                        {formatDateTime(campaign.scheduledAt)}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Recipients:</span>{" "}
                        {campaign.sent.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Opens:</span>{" "}
                        {campaign.opens.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-[var(--color-foreground)]">Open rate:</span>{" "}
                        {openRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <AdminDemoButton label="Duplicate" message={`${campaign.title} duplicated (demo)`} />
                    <AdminDemoButton
                      label={campaign.status === "scheduled" ? "Send now" : "Resend"}
                      message={`${campaign.title} queued in demo mode.`}
                      variant="default"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <AdminEmptyState
          title="No push campaigns yet"
          description="Push messages for launches, flash drops, and lifecycle reminders will appear here once they are configured."
          actionLabel="Open campaign schedule"
          actionHref="/admin/marketing/scheduling"
        />
      )}
    </div>
  );
}

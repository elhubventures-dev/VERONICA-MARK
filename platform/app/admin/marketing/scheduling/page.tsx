import type { Metadata } from "next";
import Link from "next/link";
import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { BrandComplianceChecklist } from "@/components/marketing/brand-compliance-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMarketingSchedule } from "@/lib/marketing/queries";
import { CalendarDays, Clock3, Radio, TimerReset } from "@/components/icons";

export const metadata: Metadata = {
  title: "Campaign Scheduling",
  description: "Review the Stage 9 campaign calendar by date, owner, and campaign type across scheduled and live activations.",
};

function formatDateHeading(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: string) {
  if (status === "live") return "success";
  if (status === "scheduled") return "warning";
  return "outline";
}

export default async function MarketingSchedulingPage() {
  const schedule = await getMarketingSchedule();

  const grouped = Object.entries(
    schedule.reduce<Record<string, typeof schedule>>((acc, item) => {
      const dateKey = new Date(item.startsAt).toISOString().slice(0, 10);
      acc[dateKey] ??= [];
      acc[dateKey].push(item);
      return acc;
    }, {}),
  ).sort(([a], [b]) => a.localeCompare(b));

  const scheduledCount = schedule.filter((item) => item.status === "scheduled").length;
  const liveCount = schedule.filter((item) => item.status === "live").length;
  const owners = new Set(schedule.map((item) => item.owner)).size;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stage 9"
        title="Campaign scheduling"
        description="Use a calendar-style operating view to coordinate launch timing, ownership, and campaign overlaps."
        actions={
          <>
            <AdminDemoButton
              label="Schedule campaign"
              message="Campaign added to calendar (demo). Confirm brand compliance before go-live."
              variant="default"
            />
            <Button asChild variant="outline">
              <Link href="/admin/marketing/brand-standards">Brand standards</Link>
            </Button>
          </>
        }
      />

      <BrandComplianceChecklist compact storageKey="vm-schedule-compliance" />

      <section aria-label="Campaign schedule KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Calendar items" value={schedule.length.toLocaleString()} icon={<CalendarDays className="size-4" />} />
        <KpiCard label="Scheduled" value={scheduledCount.toLocaleString()} icon={<Clock3 className="size-4" />} />
        <KpiCard label="Live" value={liveCount.toLocaleString()} icon={<Radio className="size-4" />} />
        <KpiCard label="Owners" value={owners.toLocaleString()} icon={<TimerReset className="size-4" />} />
      </section>

      {grouped.length ? (
        <section className="space-y-6">
          {grouped.map(([dateKey, items]) => (
            <div
              key={dateKey}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-[var(--color-foreground)]">{formatDateHeading(dateKey)}</h2>
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    {items.length} scheduled activation{items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-lg">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </Badge>
              </div>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-xl border border-[var(--color-border)] p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-[var(--color-foreground)]">{item.title}</h3>
                          <Badge variant={getStatusBadge(item.status)} className="rounded-lg capitalize">
                            {item.status}
                          </Badge>
                          <Badge variant="outline" className="rounded-lg capitalize">
                            {item.campaignType.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="grid gap-3 text-sm text-[var(--color-muted-foreground)] md:grid-cols-2 xl:grid-cols-3">
                          <p>
                            <span className="font-medium text-[var(--color-foreground)]">Window:</span>{" "}
                            {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
                          </p>
                          <p>
                            <span className="font-medium text-[var(--color-foreground)]">Owner:</span> {item.owner}
                          </p>
                        </div>
                      </div>

                      <AdminDemoButton label="Reschedule" message={`${item.title} rescheduled (demo)`} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <AdminEmptyState
          title="No campaign schedule"
          description="Scheduled and live campaign windows will appear here once Stage 9 launches are planned."
          actionLabel="Back to marketing"
          actionHref="/admin/marketing"
        />
      )}
    </div>
  );
}

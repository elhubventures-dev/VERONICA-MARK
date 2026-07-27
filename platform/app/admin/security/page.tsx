import type { Metadata } from "next";

import { AdminDemoButton } from "@/components/admin/admin-demo-button";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminSecurity } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Security Center",
  description: "Monitor authentication posture, admin session hygiene, and policy controls for the super admin environment.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminSecurityPage() {
  const security = await getAdminSecurity();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Security center"
        description="Keep administrative access tightly controlled with a clear view of MFA enforcement, active sessions, failed logins, and policy baselines."
      />

      <section aria-label="Security KPIs" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">MFA enforcement</p>
          <p className="mt-2 font-display text-3xl">{security.mfaEnforced ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Active admin sessions</p>
          <p className="mt-2 font-display text-3xl">{security.activeAdminSessions}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Failed logins (24h)</p>
          <p className="mt-2 font-display text-3xl">{security.failedLogins24h}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Session timeout</p>
          <p className="mt-2 font-display text-3xl">{security.sessionTimeoutMinutes}m</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="font-display text-2xl text-[var(--color-foreground)]">Policy summary</h2>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Current baseline controls applied to the super admin surface.
              </p>
            </div>
            <Badge variant={security.mfaEnforced ? "success" : "warning"} className="rounded-lg">
              {security.mfaEnforced ? "Protected" : "Needs review"}
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Password minimum length</p>
              <p className="mt-2 font-display text-2xl">{security.passwordMinLength} characters</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">IP allowlist</p>
              <p className="mt-2 font-display text-2xl">{security.ipAllowlistEnabled ? "Enabled" : "Disabled"}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4 md:col-span-2">
              <p className="text-sm text-[var(--color-muted-foreground)]">Last security review</p>
              <p className="mt-2 font-display text-2xl">{formatDate(security.lastSecurityReview)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
          <div>
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Demo actions</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Simulate common response and hardening workflows.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <AdminDemoButton
              label="Enforce MFA reset"
              message="Admin MFA reset enforced in demo mode."
              variant="default"
            />
            <AdminDemoButton
              label="Revoke sessions"
              message="All active admin sessions revoked in demo mode."
              variant="destructive"
            />
            <AdminDemoButton
              label="Start policy review"
              message="Security policy review started in demo mode."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

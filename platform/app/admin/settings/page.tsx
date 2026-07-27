import type { Metadata } from "next";

import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminSettings } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Manage operational defaults, appearance preferences, and regional storefront behavior for the platform.",
};

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="System settings"
        description="Keep platform-wide operational controls, commerce defaults, and support channels aligned for a reliable customer and admin experience."
        actions={
          <Badge variant={settings.maintenanceMode ? "warning" : "success"} className="rounded-lg">
            {settings.maintenanceMode ? "Maintenance mode enabled" : "Platform live"}
          </Badge>
        }
      />

      <section aria-label="Settings summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Default currency</p>
          <p className="mt-2 font-display text-3xl">{settings.defaultCurrency}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Default locale</p>
          <p className="mt-2 font-display text-3xl uppercase">{settings.defaultLocale}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Guest checkout</p>
          <p className="mt-2 font-display text-3xl">{settings.guestCheckout ? "On" : "Off"}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Tax display</p>
          <p className="mt-2 font-display text-3xl">{settings.taxInclusiveDisplay ? "Inclusive" : "Exclusive"}</p>
        </div>
      </section>

      <AdminSettingsForm initialSettings={settings} />
    </div>
  );
}

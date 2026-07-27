import type { Metadata } from "next";

import { SettingsForm } from "@/components/account/settings-form";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountSettings } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Settings",
  description: "Control your VERONICA MARK notifications, consent, and appearance preferences.",
};

export default async function AccountSettingsPage() {
  const settings = await getAccountSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Choose how you hear from us and how your account experience looks across devices."
      />
      <SettingsForm initialSettings={settings} />
    </div>
  );
}

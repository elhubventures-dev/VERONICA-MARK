import type { Metadata } from "next";

import { BrandSettingsForm } from "@/components/brand/brand-settings-form";
import { PageHeader } from "@/components/layout/page-header";
import { getBrandSettings } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Settings",
  description: "Control notifications, review automation, fulfillment targets, currency, and appearance.",
};

export default async function BrandSettingsPage() {
  const settings = await getBrandSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Choose which operational events trigger alerts and how the brand workspace behaves day to day."
      />
      <BrandSettingsForm initialSettings={settings} />
    </div>
  );
}

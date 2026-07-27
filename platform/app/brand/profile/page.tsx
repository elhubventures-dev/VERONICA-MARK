import type { Metadata } from "next";

import { BrandProfileForm } from "@/components/brand/brand-profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { getBrandProfile } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Profile",
  description: "Update the brand manager profile, contact details, and workspace preferences.",
};

export default async function BrandProfilePage() {
  const profile = await getBrandProfile();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Profile"
        description="Maintain the manager identity, workspace contact details, and regional defaults for your brand."
      />
      <BrandProfileForm initialProfile={profile} />
    </div>
  );
}

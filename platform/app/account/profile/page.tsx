import type { Metadata } from "next";

import { ProfileForm } from "@/components/account/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountProfile } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your VERONICA MARK account profile details.",
};

export default async function AccountProfilePage() {
  const profile = await getAccountProfile();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Keep your personal details, regional preferences, and contact information up to date."
      />
      <ProfileForm initialProfile={profile} />
    </div>
  );
}

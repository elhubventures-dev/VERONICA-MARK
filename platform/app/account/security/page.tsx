import type { Metadata } from "next";

import { SecurityPanel } from "@/components/account/security-panel";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountSecurity } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Security",
  description: "Review password, recovery, two-factor authentication, and active sessions.",
};

export default async function AccountSecurityPage() {
  const security = await getAccountSecurity();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Security"
        description="Protect your account with stronger sign-in settings and session management."
      />
      <SecurityPanel initialSecurity={security} />
    </div>
  );
}

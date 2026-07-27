import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Share2, Users } from "lucide-react";

import { CopyCodeButton } from "@/components/account/copy-code-button";
import { ReferralInviteForm } from "@/components/account/referral-invite-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountReferral } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Referral",
  description: "Share your VERONICA MARK referral link, invite friends, and track referral performance.",
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default async function AccountReferralPage() {
  const referral = await getAccountReferral();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Benefits"
        title="Referral"
        description="Invite friends to discover the edit and keep track of each conversion from one place."
        actions={
          <Button asChild>
            <Link href="/shop">View referral-worthy products</Link>
          </Button>
        }
      />

      <section aria-label="Referral summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total invited</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Users className="size-5 text-[var(--color-primary)]" aria-hidden />
              {referral.invited}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Converted</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Share2 className="size-5 text-[var(--color-primary)]" aria-hidden />
              {referral.converted}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rewards earned</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Gift className="size-5 text-[var(--color-primary)]" aria-hidden />
              {formatCurrency(referral.earned, referral.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Share your referral</CardTitle>
            <CardDescription>
              Use your code or direct link whenever you want to invite someone into the VERONICA MARK world.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4">
              <p className="text-xs tracking-[0.14em] text-[var(--color-muted-foreground)] uppercase">
                Referral code
              </p>
              <p className="font-display text-2xl tracking-[0.16em]">{referral.code}</p>
            </div>
            <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">
              <p className="text-xs tracking-[0.14em] text-[var(--color-muted-foreground)] uppercase">
                Share URL
              </p>
              <p className="break-all text-sm text-[var(--color-muted-foreground)]">{referral.shareUrl}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CopyCodeButton
                value={referral.code}
                label="Copy code"
                copiedLabel="Code copied"
                successMessage="Referral code copied"
              />
              <CopyCodeButton
                value={referral.shareUrl}
                label="Copy link"
                copiedLabel="Link copied"
                successMessage="Referral link copied"
              />
            </div>
          </CardContent>
        </Card>

        <ReferralInviteForm initialInvitations={referral.invitations} />
      </div>
    </div>
  );
}

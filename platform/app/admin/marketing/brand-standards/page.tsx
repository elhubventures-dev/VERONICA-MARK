import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { BrandComplianceChecklist } from "@/components/marketing/brand-compliance-checklist";
import { PhotographyBriefPanel } from "@/components/marketing/photography-brief-panel";
import { Button } from "@/components/ui/button";
import {
  CAMPAIGN_AVOID_PHRASES,
  CAMPAIGN_PREFERRED_WORDS,
  GOVERNANCE_NOTE,
} from "@/lib/marketing/brand-compliance";

export const metadata: Metadata = {
  title: "Brand Standards",
  description:
    "Campaign compliance checklist, photography brief, and Brand Management governance for VERONICA MARK marketing.",
};

export default function MarketingBrandStandardsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Volume VI–VII"
        title="Brand standards"
        description="Protect the VERONICA MARK identity across campaigns, creatives, and media uploads. Complete compliance before any public release."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/marketing/email-campaigns">Email campaigns</Link>
          </Button>
        }
      />

      <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
        {GOVERNANCE_NOTE}
      </p>

      <div className="grid gap-8 xl:grid-cols-2">
        <BrandComplianceChecklist storageKey="vm-admin-marketing-compliance" />
        <PhotographyBriefPanel />
      </div>

      <section className="grid gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl">Preferred language</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CAMPAIGN_PREFERRED_WORDS.map((word) => (
              <li
                key={word}
                className="rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] px-2.5 py-1 text-sm capitalize text-[var(--color-primary)]"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl">Avoid in campaigns</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CAMPAIGN_AVOID_PHRASES.map((phrase) => (
              <li
                key={phrase}
                className="rounded-lg bg-[color-mix(in_srgb,var(--color-error)_8%,var(--color-surface))] px-2.5 py-1 text-sm text-[var(--color-error)]"
              >
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="font-display text-xl">Seasonal & channel notes</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          <li>
            Position VERONICA MARK as Africa&apos;s premier global luxury marketplace — storytelling and
            authenticity over price competition.
          </li>
          <li>
            Seasonal campaigns (Valentine&apos;s, Mother&apos;s/Father&apos;s Day, Black Friday, Christmas,
            New Year, Eid, and regional occasions) must still pass the compliance checklist.
          </li>
          <li>
            Email: elegant templates, personalized greeting, curated recommendations, signature
            “VERONICA MARK · Curated for the Exceptional.”
          </li>
          <li>
            Social: curated feed mixing product, education, founder stories, and lifestyle — minimal
            hard selling.
          </li>
        </ul>
      </section>
    </div>
  );
}

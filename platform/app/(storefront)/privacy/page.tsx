import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/storefront/legal-page";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { privacySections } from "@/lib/storefront/legal-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy",
  description:
    "How VERONICA MARK collects, uses and protects personal information when you shop or contact us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Privacy policy"
      description="We treat your personal information with care and use it to provide, protect and improve the VERONICA MARK experience."
      sections={privacySections}
      relatedHref="/terms"
      relatedLabel="Terms of use"
    />
  );
}

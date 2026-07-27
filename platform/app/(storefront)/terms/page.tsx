import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/storefront/legal-page";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { termsSections } from "@/lib/storefront/legal-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms",
  description:
    "Terms of use for the VERONICA MARK storefront — orders, shipping, returns, promotions and acceptable use.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalDocumentPage
      eyebrow="Legal"
      title="Terms of use"
      description="These terms govern access to the VERONICA MARK storefront and purchases made through it."
      sections={termsSections}
      relatedHref="/privacy"
      relatedLabel="Privacy policy"
    />
  );
}

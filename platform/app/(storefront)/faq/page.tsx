import type { Metadata } from "next";

import { FaqContent } from "@/components/storefront/faq-content";
import { PageBanner } from "@/components/storefront/page-banner";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = buildPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about VERONICA MARK authenticity, orders, shipping rates, returns, payments and client services.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <article className="bg-[var(--color-background)]">
      <PageBanner
        src={siteMedia.contactPageBanner}
        eyebrow="Client services"
        title="Frequently asked questions"
        description="Essential answers for shopping the VERONICA MARK edit — authenticity, delivery, returns and more."
        priority
      />
      <FaqContent />
    </article>
  );
}

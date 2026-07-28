import type { Metadata } from "next";

import { HeroPreview } from "@/components/storefront/hero-preview";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Hero Preview",
  description: "Preview of the alternate VERONICA MARK homepage hero concept before homepage integration.",
  path: "/hero-preview",
  noIndex: true,
});

export default function HeroPreviewPage() {
  return <HeroPreview />;
}

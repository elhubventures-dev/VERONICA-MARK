import type { Metadata } from "next";

import { CompareTable } from "@/components/storefront/compare-table";

export const metadata: Metadata = {
  title: "Compare Fragrances",
  description:
    "Compare up to four VERONICA MARK fragrances side by side — specifications, pricing, and client ratings at a glance.",
};

export default function ComparePage() {
  return <CompareTable />;
}

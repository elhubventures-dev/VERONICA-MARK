import type { Metadata } from "next";
import { Suspense } from "react";

import { PageBanner } from "@/components/storefront/page-banner";
import { CheckoutFlow } from "@/components/storefront/checkout-flow";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your VERONICA MARK order — secure Paystack payment. Guest checkout available.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageBanner
        src={siteMedia.checkoutBanner}
        eyebrow="Secure checkout"
        title="Checkout"
        description="Secure payment · Clear delivery updates"
        compact
        priority
      />
      <Suspense fallback={<div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8">Loading checkout…</div>}>
        <CheckoutFlow hideTitle />
      </Suspense>
    </>
  );
}

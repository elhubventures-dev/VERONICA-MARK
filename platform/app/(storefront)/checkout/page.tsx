import type { Metadata } from "next";

import { PageBanner } from "@/components/storefront/page-banner";
import { CheckoutFlow } from "@/components/storefront/checkout-flow";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your VERONICA MARK order — guest checkout with secure Paystack payment.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageBanner
        src={siteMedia.checkoutBanner}
        eyebrow="Secure checkout"
        title="Checkout"
        description="Guest checkout · Secure payment · Clear delivery updates"
        compact
        priority
      />
      <CheckoutFlow hideTitle />
    </>
  );
}

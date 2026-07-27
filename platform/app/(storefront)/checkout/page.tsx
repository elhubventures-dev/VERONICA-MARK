import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageBanner } from "@/components/storefront/page-banner";
import { CheckoutFlow } from "@/components/storefront/checkout-flow";
import { auth } from "@/lib/auth";
import { checkoutSignUpUrl } from "@/lib/auth/checkout-gate";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your VERONICA MARK order — secure Paystack payment for registered members.",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect(checkoutSignUpUrl());
  }

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
      <CheckoutFlow hideTitle />
    </>
  );
}

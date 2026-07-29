import type { Metadata } from "next";
import { Suspense } from "react";

import { CheckoutConfirmationContent } from "@/components/storefront/checkout-confirmation-content";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Thank you for choosing VERONICA MARK. Your order is confirmed — view your invoice or track delivery at any time.",
};

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={<div className="px-5 py-20 text-center">Loading confirmation…</div>}>
      <CheckoutConfirmationContent />
    </Suspense>
  );
}

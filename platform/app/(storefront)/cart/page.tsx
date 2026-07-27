import type { Metadata } from "next";

import { CartPageContent } from "@/components/storefront/cart-page-content";

export const metadata: Metadata = {
  title: "Your Bag",
  description:
    "Review your VERONICA MARK bag — authenticated luxury fragrances with complimentary gift wrapping on qualifying orders.",
};

export default function CartPage() {
  return <CartPageContent />;
}

import type { Metadata } from "next";

import { WishlistContent } from "@/components/storefront/wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "Your saved fragrances at VERONICA MARK — return when you're ready to indulge in your signature scent.",
};

export default function WishlistPage() {
  return <WishlistContent />;
}

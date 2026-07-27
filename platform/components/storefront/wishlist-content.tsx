"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { Reveal } from "@/components/storefront/reveal";
import { EmptyState } from "@/components/data/empty-state";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { demoProducts } from "@/lib/storefront/demo-catalog";
import { Heart } from "lucide-react";

export function WishlistContent() {
  const router = useRouter();
  const { slugs, remove } = useWishlist();

  const products = slugs
    .map((slug) => demoProducts.find((p) => p.slug === slug))
    .filter((p): p is (typeof demoProducts)[number] => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save fragrances you love and return when you're ready to indulge."
          actionLabel="Explore the collection"
          onAction={() => router.push("/shop")}
        />
        <div className="mt-4 text-center">
          <Button asChild variant="outline">
            <Link href="/flash-sale">View flash sale</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl">Wishlist</h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          {products.length} saved {products.length === 1 ? "fragrance" : "fragrances"}
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <CatalogProductCard product={product} />
            <button
              type="button"
              onClick={() => remove(product.slug)}
              className="absolute bottom-24 right-4 text-xs text-[var(--color-muted-foreground)] underline underline-offset-4 transition-colors hover:text-[var(--color-error)]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { Reveal } from "@/components/storefront/reveal";
import { EmptyState } from "@/components/data/empty-state";
import { Button } from "@/components/ui/button";
import { resolveWishlistProducts } from "@/features/wishlist/actions";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";
import { Heart } from "lucide-react";

export function WishlistContent() {
  const router = useRouter();
  const { ready, slugs, remove } = useWishlist();
  const [products, setProducts] = React.useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const slugsKey = slugs.join("|");

  React.useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    if (slugs.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    void resolveWishlistProducts(slugs).then((resolved) => {
      if (cancelled) return;
      setProducts(resolved);
      setLoading(false);

      const resolvedSet = new Set(resolved.map((p) => p.slug));
      for (const slug of slugs) {
        if (!resolvedSet.has(slug)) remove(slug);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: avoid re-fetch loops on remove
  }, [ready, slugsKey]);

  if (!ready || loading) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <div
          className="flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] px-6 py-12 text-center"
          aria-busy="true"
          aria-live="polite"
        >
          <Heart className="size-10 animate-pulse text-[var(--color-muted-foreground)]" aria-hidden />
          <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">Loading wishlist…</p>
        </div>
      </div>
    );
  }

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

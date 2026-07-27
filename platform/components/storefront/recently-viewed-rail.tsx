"use client";

import * as React from "react";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { Reveal } from "@/components/storefront/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import { demoProducts } from "@/lib/storefront/demo-catalog";

const RECENTLY_VIEWED_KEY = "vm-recently-viewed";
const MAX_RECENT = 8;

export function recordRecentlyViewed(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]") as string[];
    const next = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

export function useRecentlyViewed(excludeSlug?: string) {
  const [slugs, setSlugs] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]") as string[];
      setSlugs(stored.filter((s) => s !== excludeSlug));
    } catch {
      setSlugs([]);
    }
  }, [excludeSlug]);

  return slugs
    .map((slug) => demoProducts.find((p) => p.slug === slug))
    .filter((p): p is (typeof demoProducts)[number] => Boolean(p));
}

type RecentlyViewedRailProps = {
  excludeSlug?: string;
  title?: string;
};

export function RecentlyViewedRail({
  excludeSlug,
  title = "Recently viewed",
}: RecentlyViewedRailProps) {
  const products = useRecentlyViewed(excludeSlug);

  if (products.length === 0) return null;

  return (
    <section className="border-t border-[var(--color-border)] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading eyebrow="Your journey" title={title} />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {products.slice(0, 4).map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

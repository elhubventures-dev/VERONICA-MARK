import type { Metadata } from "next";
import { Suspense } from "react";

import { ShopCatalog } from "@/components/storefront/shop-catalog";
import {
  getFilterFacets,
  queryCatalog,
  sanitizeCatalogPriceFilters,
} from "@/lib/storefront/catalog-queries";
import type { SortValue } from "@/lib/storefront/demo-catalog";

export const metadata: Metadata = {
  title: "Shop Fragrances",
  description:
    "Browse carefully selected luxury perfumes from trusted brands — curated by VERONICA MARK for discerning taste.",
};

type ShopPageProps = {
  searchParams: Promise<{
    brand?: string;
    category?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const facets = await getFilterFacets();
  const page = Number(params.page ?? 1);
  const priceFilters = sanitizeCatalogPriceFilters(
    {
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
    },
    facets.priceRange,
  );

  const result = await queryCatalog({
    brand: params.brand?.split(",").filter(Boolean),
    category: params.category?.split(",").filter(Boolean),
    ...priceFilters,
    sort: (params.sort as SortValue) ?? "featured",
    page,
  });

  return (
    <Suspense fallback={<div className="px-5 py-16 text-center">Loading collection…</div>}>
      <ShopCatalog
        products={result.items}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        facets={facets}
      />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { Reveal } from "@/components/storefront/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import { ActiveFilters } from "@/components/search/active-filters";
import { FacetedFilter } from "@/components/search/faceted-filter";
import { FilterPanel } from "@/components/search/filter-panel";
import { PaginationNav } from "@/components/navigation/pagination-nav";
import { PriceRangeFilter } from "@/components/search/price-range-filter";
import { SortSelect } from "@/components/search/sort-select";
import { Button } from "@/components/ui/button";
import { luxuryCardClass } from "@/lib/motion";
import { SORT_OPTIONS, type SortValue, type StorefrontProduct } from "@/lib/storefront/demo-catalog";

type Facets = {
  brands: { value: string; label: string; count?: number }[];
  categories: { value: string; label: string; count?: number }[];
  priceRange: { min: number; max: number };
};

type ShopCatalogProps = {
  products: StorefrontProduct[];
  total: number;
  page: number;
  totalPages: number;
  facets: Facets;
  basePath?: string;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

function parseArray(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function ShopCatalog({
  products,
  total,
  page,
  totalPages,
  facets,
  basePath = "/shop",
  title = "The Collection",
  description = "Authenticated luxury fragrances from trusted maisons — curated and presented by VERONICA MARK.",
  emptyTitle = "No fragrances match your selection",
  emptyDescription = "Refine your filters or explore our full collection to discover your next signature scent.",
}: ShopCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBrands = parseArray(searchParams.get("brand"));
  const selectedCategories = parseArray(searchParams.get("category"));
  const sort = (searchParams.get("sort") as SortValue) ?? "featured";
  const rawPriceMin = searchParams.get("priceMin");
  const rawPriceMax = searchParams.get("priceMax");
  const parsedPriceMin = rawPriceMin !== null ? Number(rawPriceMin) : undefined;
  const parsedPriceMax = rawPriceMax !== null ? Number(rawPriceMax) : undefined;
  const priceMinInRange =
    parsedPriceMin !== undefined &&
    Number.isFinite(parsedPriceMin) &&
    parsedPriceMin >= facets.priceRange.min &&
    parsedPriceMin <= facets.priceRange.max;
  const priceMaxInRange =
    parsedPriceMax !== undefined &&
    Number.isFinite(parsedPriceMax) &&
    parsedPriceMax >= facets.priceRange.min &&
    parsedPriceMax <= facets.priceRange.max;
  const priceMin = priceMinInRange ? parsedPriceMin : facets.priceRange.min;
  const priceMax = priceMaxInRange ? parsedPriceMax : facets.priceRange.max;

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!("page" in updates)) {
        params.delete("page");
      }
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    },
    [basePath, router, searchParams],
  );

  const setPriceRange = React.useCallback(
    ([min, max]: [number, number]) => {
      const atFullRange = min <= facets.priceRange.min && max >= facets.priceRange.max;
      updateParams({
        priceMin: atFullRange ? null : String(min),
        priceMax: atFullRange ? null : String(max),
      });
    },
    [facets.priceRange.max, facets.priceRange.min, updateParams],
  );

  const activeFilters = [
    ...selectedBrands.map((b) => ({
      id: `brand-${b}`,
      label: facets.brands.find((f) => f.value === b)?.label ?? b,
    })),
    ...selectedCategories.map((c) => ({
      id: `category-${c}`,
      label: facets.categories.find((f) => f.value === c)?.label ?? c,
    })),
  ];

  const hrefForPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
      <Reveal>
        <SectionHeading eyebrow="VERONICA MARK" title={title} description={description} />
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Reveal variant="left" className="lg:sticky lg:top-24 lg:self-start">
          <FilterPanel
            className={luxuryCardClass}
            footer={
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push(basePath)}
              >
                Reset filters
              </Button>
            }
          >
            <FacetedFilter
              title="Brand"
              options={facets.brands}
              selected={selectedBrands}
              onChange={(selected) => updateParams({ brand: selected.join(",") || null })}
            />
            <FacetedFilter
              title="Category"
              options={facets.categories}
              selected={selectedCategories}
              onChange={(selected) => updateParams({ category: selected.join(",") || null })}
            />
            <PriceRangeFilter
              min={facets.priceRange.min}
              max={facets.priceRange.max}
              value={[priceMin, priceMax]}
              onChange={setPriceRange}
            />
          </FilterPanel>
        </Reveal>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {total} {total === 1 ? "fragrance" : "fragrances"}
            </p>
            <SortSelect
              value={sort}
              options={[...SORT_OPTIONS]}
              onValueChange={(value) => updateParams({ sort: value })}
            />
          </div>

          <ActiveFilters
            filters={activeFilters}
            onRemove={(id) => {
              if (id.startsWith("brand-")) {
                const slug = id.replace("brand-", "");
                updateParams({
                  brand: selectedBrands.filter((b) => b !== slug).join(",") || null,
                });
              } else if (id.startsWith("category-")) {
                const slug = id.replace("category-", "");
                updateParams({
                  category: selectedCategories.filter((c) => c !== slug).join(",") || null,
                });
              }
            }}
            onClearAll={() => router.push(basePath)}
          />

          {products.length === 0 ? (
            <Reveal className="flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
              <h3 className="font-display text-xl">{emptyTitle}</h3>
              <p className="mt-2 max-w-md text-sm text-[var(--color-muted-foreground)]">
                {emptyDescription}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
                  Clear filters
                </Button>
                <Button asChild>
                  <Link href="/shop">Browse all fragrances</Link>
                </Button>
              </div>
            </Reveal>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
                {products.map((product) => (
                  <CatalogProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 ? (
                <PaginationNav page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

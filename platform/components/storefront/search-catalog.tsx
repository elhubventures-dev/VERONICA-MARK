"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SearchBar } from "@/components/search/search-bar";
import { SearchEmpty } from "@/components/search/search-empty";
import { SortSelect } from "@/components/search/sort-select";
import { PaginationNav } from "@/components/navigation/pagination-nav";
import { SORT_OPTIONS, type SortValue, type StorefrontProduct } from "@/lib/storefront/demo-catalog";

type SearchCatalogProps = {
  products: StorefrontProduct[];
  query: string;
  total: number;
  page: number;
  totalPages: number;
};

export function SearchCatalog({ products, query, total, page, totalPages }: SearchCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get("sort") as SortValue) ?? "featured";

  const hrefForPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    return `/search?${params.toString()}`;
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => router.push("/search");

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
      <SectionHeading
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Find your fragrance"}
        description="Search by name, brand, or category across the VERONICA MARK collection."
      />

      <div className="mb-8 max-w-xl">
        <SearchBar
          value={query}
          placeholder="Search fragrances, brands…"
          onSubmit={handleSearch}
        />
      </div>

      {query ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {total} {total === 1 ? "result" : "results"}
          </p>
          <SortSelect
            value={sort}
            options={[...SORT_OPTIONS]}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("sort", value);
              router.push(`/search?${params.toString()}`);
            }}
          />
        </div>
      ) : null}

      {!query ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] px-6 py-12 text-center">
          <p className="text-[var(--color-muted-foreground)]">
            Enter a search term to explore the collection.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)] underline underline-offset-4"
          >
            Browse all fragrances
          </Link>
        </div>
      ) : products.length === 0 ? (
        <SearchEmpty query={query} onClear={handleClear} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 ? (
            <PaginationNav className="mt-10" page={page} totalPages={totalPages} hrefForPage={hrefForPage} />
          ) : null}
        </>
      )}
    </div>
  );
}

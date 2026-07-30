import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchCatalog } from "@/components/storefront/search-catalog";
import { searchCatalog } from "@/lib/storefront/catalog-queries";
import { CATALOG_PAGE_SIZE, type SortValue } from "@/lib/storefront/demo-catalog";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the VERONICA MARK fragrance collection by name, brand, or category — discover your next signature scent.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Number(params.page ?? 1);

  const result = query
    ? await searchCatalog(query, {
        sort: (params.sort as SortValue) ?? "featured",
        page,
      })
    : { items: [], total: 0, page: 1, pageSize: CATALOG_PAGE_SIZE, totalPages: 1 };

  return (
    <Suspense fallback={<div className="px-5 py-16 text-center">Searching…</div>}>
      <SearchCatalog
        products={result.items}
        query={query}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
      />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ShopCatalog } from "@/components/storefront/shop-catalog";
import { getCategoryDetail, getCategoryProducts, getFilterFacets } from "@/lib/storefront/catalog-queries";
import { demoCategories, type SortValue } from "@/lib/storefront/demo-catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryDetail(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} Fragrances`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const category = await getCategoryDetail(slug);
  if (!category) notFound();

  const result = await getCategoryProducts(slug, {
    sort: (query.sort as SortValue) ?? "featured",
    page: Number(query.page ?? 1),
  });
  const facets = await getFilterFacets();

  return (
    <Suspense fallback={<div className="px-5 py-16 text-center">Loading…</div>}>
      <ShopCatalog
        products={result.items}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        facets={facets}
        basePath={`/categories/${slug}`}
        title={category.name}
        description={category.description}
        emptyTitle={`No fragrances in ${category.name}`}
        emptyDescription="This category is being refreshed. Explore our full collection or browse another category."
      />
    </Suspense>
  );
}

export function generateStaticParams() {
  return demoCategories.map((category) => ({ slug: category.slug }));
}

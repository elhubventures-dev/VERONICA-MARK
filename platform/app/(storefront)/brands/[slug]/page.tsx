import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BrandPageHero } from "@/components/storefront/brand-page-hero";
import { ShopCatalog } from "@/components/storefront/shop-catalog";
import { getBrandDetail, getBrandProducts, getFilterFacets } from "@/lib/storefront/catalog-queries";
import { demoBrands, type SortValue } from "@/lib/storefront/demo-catalog";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandDetail(slug);
  if (!brand) return { title: "Brand not found" };

  return {
    title: `${brand.name} Fragrances`,
    description: brand.description,
  };
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const brand = await getBrandDetail(slug);
  if (!brand) notFound();

  const result = await getBrandProducts(slug, {
    sort: (query.sort as SortValue) ?? "featured",
    page: Number(query.page ?? 1),
  });
  const facets = await getFilterFacets();

  return (
    <>
      <BrandPageHero name={brand.name} description={brand.description} image={brand.image} />

      <Suspense fallback={<div className="px-5 py-16 text-center">Loading…</div>}>
        <ShopCatalog
          products={result.items}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
          facets={facets}
          basePath={`/brands/${slug}`}
          title={`${brand.name} collection`}
          description={`Every ${brand.name} composition in the VERONICA MARK edit — authenticated and ready to ship.`}
          emptyTitle={`No ${brand.name} fragrances available`}
          emptyDescription="This house is being restocked. Browse our full collection or discover another maison."
        />
      </Suspense>
    </>
  );
}

export function generateStaticParams() {
  return demoBrands.map((brand) => ({ slug: brand.slug }));
}

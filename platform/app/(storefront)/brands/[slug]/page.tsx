import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ShopCatalog } from "@/components/storefront/shop-catalog";
import { MediaScrim } from "@/components/storefront/media-scrim";
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
      <div className="relative mx-auto max-w-[1440px] px-5 pt-12 sm:px-8">
        <div className="relative isolate h-48 overflow-hidden rounded-xl bg-[var(--color-brand-deep)] md:h-64">
          <Image
            src={brand.image}
            alt=""
            fill
            className="-z-20 object-cover"
            sizes="100vw"
            priority
          />
          <MediaScrim variant="left" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase">Maison</p>
            <h1 className="font-display text-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] md:text-4xl">
              {brand.name}
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-[var(--color-muted-foreground)]">{brand.description}</p>
      </div>

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

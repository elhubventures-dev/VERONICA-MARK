import Image from "next/image";
import Link from "next/link";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { SectionHeading } from "@/components/storefront/section-heading";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

type ProductRailProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  products: StorefrontProduct[];
  /** Optional section banner (e.g. New Arrival / Best Seller assets) */
  bannerSrc?: string;
};

export function ProductRail({ eyebrow, title, description, products, bannerSrc }: ProductRailProps) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        {bannerSrc ? (
          <div className="relative mb-10 isolate aspect-[21/7] min-h-[160px] overflow-hidden bg-[var(--color-brand-deep)] sm:min-h-[200px]">
            <Image
              src={bannerSrc}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              quality={70}
              className="-z-20 object-cover"
            />
            <MediaScrim variant="left" />
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Link
            href="/shop"
            className="mb-8 hidden min-h-11 items-center text-sm font-semibold underline decoration-accent underline-offset-4 sm:inline-flex"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 4).map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

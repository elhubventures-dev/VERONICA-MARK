import Link from "next/link";
import Image from "next/image";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { RailBanner } from "@/components/storefront/rail-banner";
import { Reveal } from "@/components/storefront/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

type ProductRailProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  products: StorefrontProduct[];
  /** Optional section banner (e.g. New Arrival / Best Seller assets) */
  bannerSrc?: string;
  /** Overlay copy for the banner (left side over media) */
  bannerTitle?: string;
  bannerDescription?: string;
  bannerCtaLabel?: string;
  bannerCtaHref?: string;
};

export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  bannerSrc,
  bannerTitle,
  bannerDescription,
  bannerCtaLabel,
  bannerCtaHref = "/categories/perfumes",
}: ProductRailProps) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        {bannerSrc && bannerTitle ? (
          <RailBanner
            src={bannerSrc}
            title={bannerTitle}
            description={bannerDescription}
            ctaLabel={bannerCtaLabel}
            ctaHref={bannerCtaHref}
          />
        ) : bannerSrc ? (
          <div className="relative mb-10 isolate min-h-[200px] overflow-hidden bg-[var(--color-brand-deep)] sm:min-h-[240px] lg:min-h-[280px]">
            <Image
              src={bannerSrc}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              quality={70}
              className="-z-20 object-cover object-[78%_center]"
            />
            <MediaScrim variant="left" />
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </Reveal>
          <Link
            href="/shop"
            className="mb-8 hidden min-h-11 items-center text-sm font-semibold underline decoration-accent underline-offset-4 transition-opacity hover:opacity-70 sm:inline-flex"
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

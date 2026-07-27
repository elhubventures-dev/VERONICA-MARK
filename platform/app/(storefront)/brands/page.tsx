import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageBanner } from "@/components/storefront/page-banner";
import { Reveal } from "@/components/storefront/reveal";
import { staggerDelay } from "@/lib/motion";
import { getBrands } from "@/lib/storefront/catalog-queries";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Discover the fragrance houses of VERONICA MARK — independent maisons and enduring signatures, authenticated and managed with care.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <PageBanner
        src={siteMedia.brandPartnersBanner}
        eyebrow="The houses"
        title="Featured brands"
        description="Each maison is selected for its distinctive voice and uncompromising quality — curated exclusively for VERONICA MARK."
        priority
      />
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {brands.map((brand, index) => (
            <Reveal key={brand.id} delay={staggerDelay(index)}>
              <Link
                href={`/brands/${brand.slug}`}
                className="group relative block min-h-[420px] overflow-hidden rounded-xl bg-[var(--color-brand-deep)] transition-[transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
              >
                <Image
                  src={brand.image}
                  alt=""
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="z-0 object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(58,1,60,0.96) 0%, rgba(58,1,60,0.78) 42%, rgba(58,1,60,0.35) 68%, transparent 100%)",
                  }}
                />
                <span className="relative z-[2] flex h-full min-h-[420px] flex-col justify-end p-7 text-white">
                  <span className="font-display text-3xl">{brand.name}</span>
                  <span className="mt-2 block max-w-sm text-sm leading-6 text-white/95">
                    {brand.description}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

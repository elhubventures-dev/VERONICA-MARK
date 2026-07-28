import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/storefront/reveal";
import { luxuryCardClass, luxuryFrameClass, staggerDelay } from "@/lib/motion";
import { SectionHeading } from "@/components/storefront/section-heading";
import type { StorefrontBrand } from "@/lib/storefront/demo-catalog";
import { siteMedia } from "@/lib/storefront/site-media";

export function BrandShowcase({ brands }: { brands: StorefrontBrand[] }) {
  return (
    <section className="relative isolate overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
      <Image
        src={siteMedia.brandPartnersBanner}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-35"
      />
      <div className="absolute inset-0 -z-10 bg-[color-mix(in_srgb,var(--color-background)_88%,transparent)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHeading
            eyebrow="The houses"
            title="Featured brands"
            description="Trusted maisons and distinctive signatures, carefully curated under the VERONICA MARK name."
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {brands.slice(0, 3).map((brand, index) => (
            <Reveal key={brand.id} delay={staggerDelay(index)} variant="zoom">
              <Link
                href={`/brands/${brand.slug}`}
                className={`group relative block min-h-[420px] overflow-hidden bg-[var(--color-brand-deep)] text-white ${luxuryCardClass} ${luxuryFrameClass}`}
              >
                <Image
                  src={brand.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
                <span className="relative z-[2] flex h-full min-h-[420px] flex-col justify-end p-7">
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
    </section>
  );
}

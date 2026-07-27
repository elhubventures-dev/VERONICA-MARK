import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BrandShowcase } from "@/components/storefront/brand-showcase";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { FlashSaleCountdown } from "@/components/storefront/flash-sale-countdown";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { NewsletterForm } from "@/components/storefront/newsletter-form";
import { ProductRail } from "@/components/storefront/product-rail";
import { SectionHeading } from "@/components/storefront/section-heading";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { getStorefrontBrands, getStorefrontProducts } from "@/lib/storefront/catalog";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = buildPageMetadata({
  title: "Curated for the Exceptional",
  description:
    "Discover carefully selected luxury perfumes, fashion, accessories and lifestyle products from trusted brands around the world.",
  path: "/",
});

const reviews = [
  ["“A beautifully edited selection — every bottle feels considered.”", "Amelia R."],
  ["“My order arrived impeccably wrapped, and the scent is extraordinary.”", "Sofia M."],
  ["“VERONICA MARK made finding a signature fragrance feel effortless.”", "Daniel K."],
];

export default async function HomePage() {
  const [products, brands] = await Promise.all([getStorefrontProducts(), getStorefrontBrands()]);
  const jsonLd = [organizationJsonLd(), websiteJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HeroBanner />
      <FlashSaleCountdown />
      <div id="brands">
        <BrandShowcase brands={brands} />
      </div>
      <CategoryGrid />
      <ProductRail
        eyebrow="New to the edit"
        title="Recent arrivals"
        description="Thoughtfully added fragrances chosen for craftsmanship and character."
        products={products}
        bannerSrc={siteMedia.newArrivalBanner}
        bannerTitle="Discover Your Signature Scent"
        bannerDescription="Where elegance meets exceptional craftsmanship."
        bannerCtaLabel="Browse Fragrances"
        bannerCtaHref="/categories/perfumes"
      />
      <div className="bg-muted">
        <ProductRail
          eyebrow="Client favourites"
          title="Enduring signatures"
          description="Compositions our clients return to — refined, authentic, timeless."
          products={[...products].reverse()}
          bannerSrc={siteMedia.bestSellerSection}
          bannerTitle="Every Fragrance Tells a Story"
          bannerDescription="Find the scent that defines yours"
          bannerCtaLabel="Shop Luxury Perfumes"
          bannerCtaHref="/categories/perfumes"
        />
      </div>

      <section className="relative isolate min-h-[520px] overflow-hidden bg-[var(--color-brand-deep)] text-white">
        <Image
          src={siteMedia.featuredCollectionBanner}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          quality={70}
          className="-z-20 object-cover"
        />
        <MediaScrim variant="left" />
        <div className="relative mx-auto flex min-h-[520px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              Featured collection
            </p>
            <h2 className="mt-4 font-display text-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-6xl">
              After dark
            </h2>
            <p className="mt-5 leading-7 text-white/90">
              Incense, velvet woods and skin-warm amber. A collection designed for entrances that
              linger.
            </p>
            <Link
              href="/categories/perfumes"
              className="mt-8 inline-flex min-h-11 items-center border border-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
            >
              Discover the collection
            </Link>
          </div>
        </div>
      </section>

      <section className="relative min-h-[420px] overflow-hidden bg-[var(--color-brand-deep)] text-white">
        <Image
          src={siteMedia.premiumGiftCollection}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to left, rgba(58,1,60,0.96) 0%, rgba(58,1,60,0.78) 32%, rgba(58,1,60,0.35) 62%, transparent 100%)",
          }}
        />
        <div className="relative z-[2] mx-auto flex min-h-[420px] max-w-[1440px] items-center justify-end px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-lg text-right">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              Gifting
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">Premium gift collection</h2>
            <p className="mt-5 leading-7 text-white/95">
              Considered presents for the people who appreciate presence — wrapped with the same care
              we bring to every VERONICA MARK order.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex min-h-11 items-center border border-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
            >
              Shop the edit
            </Link>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--color-brand-deep)] text-white">
        <Image
          src={siteMedia.luxuryPerfumeCollection}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <MediaScrim variant="left" />
        <div className="relative mx-auto flex min-h-[420px] max-w-[1440px] items-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              The perfume edit
            </p>
            <h2 className="mt-4 font-display text-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-5xl">
              Luxury perfume collection
            </h2>
            <p className="mt-5 leading-7 text-white/90">
              An edited world of fragrance — from luminous florals to smoky woods — authenticated and
              ready to ship.
            </p>
            <Link
              href="/categories/perfumes"
              className="mt-8 inline-flex min-h-11 items-center border border-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
            >
              Browse perfumes
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading eyebrow="Client notes" title="What they say" align="center" />
          <div className="grid gap-px bg-border md:grid-cols-3">
            {reviews.map(([quote, author]) => (
              <figure key={author} className="bg-background p-8 text-center sm:p-10">
                <blockquote className="font-display text-2xl leading-9">{quote}</blockquote>
                <figcaption className="mt-5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-5 py-20 text-center text-white sm:px-8">
        <Image
          src={siteMedia.newsletterBackground}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <MediaScrim variant="center" />
        <p className="relative text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
          The private list
        </p>
        <h2 className="relative mt-3 font-display text-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-5xl">
          Stay close to the exceptional.
        </h2>
        <div className="relative">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";

import { BrandShowcase } from "@/components/storefront/brand-showcase";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { EditorialBanner } from "@/components/storefront/editorial-banner";
import { FlashSaleCountdown } from "@/components/storefront/flash-sale-countdown";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { NewsletterForm } from "@/components/storefront/newsletter-form";
import { ProductRail } from "@/components/storefront/product-rail";
import { Reveal } from "@/components/storefront/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import { staggerDelay } from "@/lib/motion";
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

      <EditorialBanner
        src={siteMedia.featuredCollectionBanner}
        eyebrow="Featured collection"
        title="After dark"
        description="Incense, velvet woods and skin-warm amber. A collection designed for entrances that linger."
        ctaLabel="Discover the collection"
        ctaHref="/categories/perfumes"
        minHeight="lg"
      />

      <EditorialBanner
        src={siteMedia.premiumGiftCollection}
        eyebrow="Gifting"
        title="Premium gift collection"
        description="Considered presents for the people who appreciate presence — wrapped with the same care we bring to every VERONICA MARK order."
        ctaLabel="Shop the edit"
        ctaHref="/shop"
        align="right"
      />

      <EditorialBanner
        src={siteMedia.luxuryPerfumeCollection}
        eyebrow="The perfume edit"
        title="Luxury perfume collection"
        description="An edited world of fragrance — from luminous florals to smoky woods — authenticated and ready to ship."
        ctaLabel="Browse perfumes"
        ctaHref="/categories/perfumes"
      />

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHeading eyebrow="Client notes" title="What they say" align="center" />
          </Reveal>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {reviews.map(([quote, author], index) => (
              <Reveal key={author} delay={staggerDelay(index)}>
                <figure className="bg-background p-8 text-center sm:p-10">
                  <blockquote className="font-display text-2xl leading-9">{quote}</blockquote>
                  <figcaption className="mt-5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                    {author}
                  </figcaption>
                </figure>
              </Reveal>
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
        <Reveal className="relative">
          <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
            The private list
          </p>
          <h2 className="mt-3 font-display text-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-5xl">
            Stay close to the exceptional.
          </h2>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}

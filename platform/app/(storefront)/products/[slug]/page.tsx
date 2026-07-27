import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/commerce/product-gallery";
import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { PdpPurchasePanel } from "@/components/storefront/pdp-purchase-panel";
import { RecentlyViewedRail } from "@/components/storefront/recently-viewed-rail";
import { SectionHeading } from "@/components/storefront/section-heading";
import { TrustSignals } from "@/components/storefront/trust-signals";
import { getPublicEnv } from "@/lib/env";
import { getProductDetail, queryCatalog } from "@/lib/storefront/catalog-queries";
import { demoProductDetails } from "@/lib/storefront/demo-catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} · ${product.brand}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) notFound();

  const relatedResult = await queryCatalog({ page: 1, pageSize: 8 });
  const relatedProducts = relatedResult.items
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        product.relatedSlugs.includes(p.slug) ||
        p.brandSlug === product.brandSlug ||
        p.categorySlug === product.categorySlug,
    )
    .slice(0, 4);

  const publicEnv = getPublicEnv();
  const avgRating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / (product.reviews.length || 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.src),
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: product.reviews.length,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${publicEnv.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
    },
  };

  const noteSpec = product.specs.find((s) => /note|olfactive|family/i.test(s.label));
  const fragranceNotes =
    noteSpec?.value ??
    "A refined composition selected for craftsmanship, character and lasting presence.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} />
          <div className="space-y-8">
            <PdpPurchasePanel product={product} />
            <TrustSignals variant="pdp" />
          </div>
        </div>

        <section className="mt-16 border-t border-[var(--color-border)] pt-16">
          <SectionHeading eyebrow="The story" title="Product story" />
          <div className="max-w-3xl space-y-4 text-base leading-8 text-[var(--color-muted-foreground)]">
            <p>{product.description}</p>
            <p>
              <span className="font-medium text-[var(--color-foreground)]">Fragrance notes. </span>
              {fragranceNotes}
            </p>
            <p>
              Each bottle in the VERONICA MARK edit is presented with authenticity assurance and the
              care of a managed-brand partnership — so you can purchase with confidence.
            </p>
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--color-border)] pt-16">
          <SectionHeading eyebrow="Details" title="Specifications" />
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.specs.map((spec) => (
              <div key={spec.label} className="rounded-xl border border-[var(--color-border)] p-4">
                <dt className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">
                  {spec.label}
                </dt>
                <dd className="mt-1 font-medium">{spec.value}</dd>
              </div>
            ))}
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <dt className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">
                Delivery
              </dt>
              <dd className="mt-1 font-medium">Standard 3–5 days · Express 1–2 days</dd>
            </div>
          </dl>
        </section>

        <section className="mt-16 border-t border-[var(--color-border)] pt-16">
          <SectionHeading
            eyebrow="Verified reviews"
            title="Client impressions"
            description={`${product.reviews.length} verified reviews · ${avgRating.toFixed(1)} average rating`}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <p className="mt-0.5 text-[10px] tracking-[0.14em] text-[var(--color-accent)] uppercase">
                      Verified purchase
                    </p>
                  </div>
                  <p
                    className="text-sm text-[var(--color-muted-foreground)]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                </div>
                <h3 className="mt-2 font-display text-lg">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {review.body}
                </p>
                <time
                  className="mt-3 block text-xs text-[var(--color-muted-foreground)]"
                  dateTime={review.date}
                >
                  {new Date(review.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </article>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-16 border-t border-[var(--color-border)] pt-16">
            <SectionHeading
              eyebrow="Related collections"
              title="You may also love"
              description="Further signatures from the same house or olfactive family."
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <CatalogProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <RecentlyViewedRail excludeSlug={slug} />
    </>
  );
}

export function generateStaticParams() {
  return demoProductDetails.map((product) => ({ slug: product.slug }));
}

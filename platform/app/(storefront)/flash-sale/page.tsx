import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { FlashSaleCouponCopy } from "@/components/storefront/flash-sale-coupon-copy";
import { FlashSaleLanding } from "@/components/storefront/flash-sale-landing";
import { FlashSaleProductMarquee } from "@/components/storefront/flash-sale-product-marquee";
import { FlashSaleSocialProof } from "@/components/storefront/flash-sale-social-proof";
import { FlashSaleSpotlightCards } from "@/components/storefront/flash-sale-spotlight-cards";
import { FlashSaleStatsStrip } from "@/components/storefront/flash-sale-stats-strip";
import { Reveal } from "@/components/storefront/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import {
  accentFillCtaClass,
  brandFillCtaClass,
  ghostOnDarkCtaClass,
  luxuryCardClass,
} from "@/lib/motion";
import { type StorefrontProduct, flashSale } from "@/lib/storefront/demo-catalog";
import { getFlashSaleCatalog } from "@/lib/storefront/catalog-queries";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = {
  title: "Private Opening Edit",
  description:
    "August Grand Opening — 20% off with code VM5AUG-20 on signature VERONICA MARK fragrances. Limited days only.",
};

function uniqueById(products: StorefrontProduct[]) {
  return products.filter((product, index, list) => list.findIndex((item) => item.id === product.id) === index);
}

function pickProducts(
  products: StorefrontProduct[],
  predicate: (product: StorefrontProduct) => boolean,
  limit: number,
) {
  const matched = uniqueById(products.filter(predicate)).slice(0, limit);
  if (matched.length >= limit) return matched;
  const fillers = products.filter((product) => !matched.some((item) => item.id === product.id));
  return uniqueById([...matched, ...fillers]).slice(0, limit);
}

export default async function FlashSalePage() {
  const products = (await getFlashSaleCatalog()).slice(0, 50);
  const spotlightProducts = products.slice(0, 3);
  const saleProducts = pickProducts(products, (product) => Boolean(product.compareAt), 4);
  const accessibleLuxuries = pickProducts(products, (product) => product.price <= 150_000, 4);
  const bestsellerProducts = pickProducts(
    products,
    (product) => product.badge === "bestseller" || product.badge === "exclusive",
    4,
  );
  const discoveryProducts = pickProducts(products, (product) => product.badge === "new", 2);
  const participatingBrands = Array.from(new Set(products.map((product) => product.brand))).slice(0, 6);
  const inStockCount = products.filter((product) => product.inStock !== false).length;
  const savingsProducts = products.filter(
    (product): product is StorefrontProduct & { compareAt: number } =>
      typeof product.compareAt === "number" && product.compareAt > product.price,
  );
  const averageDiscount = savingsProducts.length
    ? Math.round(
        savingsProducts.reduce(
          (sum, product) => sum + ((product.compareAt - product.price) / product.compareAt) * 100,
          0,
        ) / savingsProducts.length,
      )
    : flashSale.discountPercent ?? 20;
  const stats = [
    { label: "Products in this drop", value: `${products.length}` },
    { label: "Available now", value: `${inStockCount}` },
    { label: "Average markdown", value: `${averageDiscount}%` },
    { label: "Participating brands", value: `${participatingBrands.length}` },
  ];

  return (
    <>
      <FlashSaleLanding
        productCount={products.length}
        highlightedCount={spotlightProducts.length}
        brands={participatingBrands}
      />

      {products.length ? <FlashSaleProductMarquee products={products} /> : null}

      <FlashSaleStatsStrip stats={stats} />

      {spotlightProducts.length ? (
        <section className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
            <Reveal>
              <SectionHeading
                eyebrow="Campaign spotlight"
                title="Promotional hero picks"
                description="Lead with high-attention bottles first: bold visual cards, visible savings, and direct paths into the flash-sale grid."
              />
            </Reveal>

            <FlashSaleSpotlightCards products={spotlightProducts} />
          </div>
        </section>
      ) : null}

      <section className="border-t border-[var(--color-border)] bg-[var(--color-muted)]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-[2rem] bg-[var(--color-brand-deep)] text-white">
                <Image
                  src={siteMedia.premiumGiftCollection}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="-z-20 object-cover object-center"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(8, 4, 12, 0.96) 0%, rgba(8, 4, 12, 0.9) 38%, rgba(8, 4, 12, 0.62) 62%, rgba(8, 4, 12, 0.2) 100%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full max-w-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(58, 1, 60, 0.55) 0%, transparent 78%)",
                  }}
                />
                <div className="relative max-w-xl px-6 py-12 sm:px-8 sm:py-14">
                  <div
                    className="rounded-2xl border border-white/10 p-5 sm:p-6"
                    style={{
                      background:
                        "linear-gradient(155deg, rgba(8, 4, 12, 0.82) 0%, rgba(58, 1, 60, 0.72) 100%)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-[var(--color-accent)] uppercase">
                      Promotional takeover
                    </p>
                    <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
                      More urgency, more movement, more reasons to convert.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-white/92 sm:text-base">
                      This page now behaves more like a real campaign landing page: stronger hero treatment,
                      animated promo tape, spotlight product adverts, conversion strips, and a larger live
                      product edit built from the real catalog.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href="#opening-edit" className={accentFillCtaClass}>
                        Enter the sale
                      </a>
                      <Link href="/shop" className={ghostOnDarkCtaClass}>
                        Browse full shop
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-5">
              <Reveal>
                <div className={`rounded-[1.5rem] p-6 ${luxuryCardClass}`}>
                  <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    Code at checkout
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Copy once — paste at checkout for {flashSale.discountPercent ?? 20}% off while the edit is live.
                  </p>
                  <div className="mt-4">
                    <FlashSaleCouponCopy variant="light" />
                  </div>
                </div>
              </Reveal>
              {[
                {
                  eyebrow: "Trust signal",
                  title: "Real products only",
                  description: "This page now pulls from the published storefront catalog, not just a tiny demo subset.",
                },
                {
                  eyebrow: "Conversion focus",
                  title: "Multiple advert styles",
                  description: "Large image spots, dark conversion bands, curated deal modules, and grid merchandising all work together here.",
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={(index + 1) * 0.05}>
                  <div className={`rounded-[1.5rem] p-6 ${luxuryCardClass}`}>
                    <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="opening-edit"
        className="scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-background)]"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="In this edit"
              title="50 real products in the flash-sale edit"
              description={`Exclusive opening prices across live catalog items — use code ${flashSale.couponCode ?? "VM5AUG-20"} for ${flashSale.discountPercent ?? 20}% off while the event remains live.`}
            />
          </Reveal>

          {products.length === 0 ? (
            <Reveal className="border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
              <h3 className="font-display text-xl">This opening edit has closed</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                Explore the full collection for recent arrivals and enduring signatures.
              </p>
              <Link href="/shop" className={`mt-6 ${brandFillCtaClass}`}>
                Explore the collection
              </Link>
            </Reveal>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-muted)]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Curated selling blocks"
            title="More advert styles across the page"
            description="These supporting edits let the campaign speak to different buyer intents without losing urgency."
          />

          <div className="mt-2 grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Markdown moments",
                description: "Products already showing visible price cuts.",
                products: saleProducts.length ? saleProducts : products.slice(0, 4),
              },
              {
                title: "Accessible luxury",
                description: "Lower-entry signatures for quick impulse conversion.",
                products: accessibleLuxuries.length ? accessibleLuxuries : products.slice(4, 8),
              },
              {
                title: "Most wanted",
                description: "Exclusive and bestseller-led attention magnets.",
                products: bestsellerProducts.length
                  ? bestsellerProducts
                  : spotlightProducts.length
                    ? spotlightProducts
                    : products.slice(8, 12),
              },
            ].map((group) => (
              <div key={group.title} className="space-y-5">
                <div>
                  <h3 className="font-display text-2xl">{group.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{group.description}</p>
                </div>
                <div className="grid gap-4">
                  {group.products.map((product) => (
                    <CatalogProductCard key={`${group.title}-${product.id}`} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-brand-deep)] p-6 text-white">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
                Fresh discovery
              </p>
              <h2 className="mt-4 font-display text-3xl">New names, stronger campaign rhythm.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
                Beyond the main sale grid, this page now includes a discovery layer so users keep
                moving deeper into the offer instead of bouncing after the first fold.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {participatingBrands.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-medium text-white/82"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(discoveryProducts.length ? discoveryProducts : products.slice(0, 2)).map((product) => (
                <CatalogProductCard key={`discovery-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-brand-deep)] text-white">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              1–7 August only
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Secure your opening selection before the edit closes.
            </h2>
          </div>
          <div className="w-full max-w-sm">
            <FlashSaleCouponCopy variant="dark" />
          </div>
          <a href="#opening-edit" className={accentFillCtaClass}>
            Shop now
          </a>
        </Reveal>
      </section>

      {products.length ? <FlashSaleSocialProof products={products} /> : null}
    </>
  );
}

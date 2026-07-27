import type { Metadata } from "next";
import Link from "next/link";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { FlashSaleLanding } from "@/components/storefront/flash-sale-landing";
import { Reveal } from "@/components/storefront/reveal";
import { SectionHeading } from "@/components/storefront/section-heading";
import { accentFillCtaClass, brandFillCtaClass } from "@/lib/motion";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { getFlashSaleCatalog } from "@/lib/storefront/catalog-queries";

export const metadata: Metadata = {
  title: "Private Opening Edit",
  description:
    "August Grand Opening — 20% off with code VM5AUG-20 on signature VERONICA MARK fragrances. Limited days only.",
};

export default async function FlashSalePage() {
  const products = await getFlashSaleCatalog();

  return (
    <>
      <FlashSaleLanding />

      <section
        id="opening-edit"
        className="scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-background)]"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="In this edit"
              title="Selected compositions"
              description={`Exclusive opening prices — ${flashSale.discountPercent ?? 20}% off with code ${flashSale.couponCode ?? "VM5AUG-20"} while the event remains live.`}
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
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
          <a href="#opening-edit" className={accentFillCtaClass}>
            Shop now
          </a>
        </Reveal>
      </section>
    </>
  );
}

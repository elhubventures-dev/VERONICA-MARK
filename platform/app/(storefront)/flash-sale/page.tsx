import type { Metadata } from "next";
import Link from "next/link";

import { CatalogProductCard } from "@/components/storefront/catalog-product-card";
import { FlashSaleLanding } from "@/components/storefront/flash-sale-landing";
import { SectionHeading } from "@/components/storefront/section-heading";
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
          <SectionHeading
            align="center"
            eyebrow="In this edit"
            title="Selected compositions"
            description={`Exclusive opening prices — ${flashSale.discountPercent ?? 20}% off with code ${flashSale.couponCode ?? "VM5AUG-20"} while the event remains live.`}
          />

          {products.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
              <h3 className="font-display text-xl">This opening edit has closed</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                Explore the full collection for recent arrivals and enduring signatures.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex min-h-11 items-center bg-[var(--color-brand-deep)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color-mix(in_srgb,var(--color-brand-deep)_88%,black)]"
              >
                Explore the collection
              </Link>
            </div>
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
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              1–7 August only
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Secure your opening selection before the edit closes.
            </h2>
          </div>
          <a
            href="#opening-edit"
            className="inline-flex min-h-11 shrink-0 items-center justify-center border border-[var(--color-accent)] bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]"
          >
            Shop now
          </a>
        </div>
      </section>
    </>
  );
}

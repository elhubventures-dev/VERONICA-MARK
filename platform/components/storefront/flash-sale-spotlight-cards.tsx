"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Price } from "@/components/commerce/price";
import { accentFillCtaClass, ghostOnDarkCtaClass, motionTransition } from "@/lib/motion";
import { type StorefrontProduct, flashSale } from "@/lib/storefront/demo-catalog";

type FlashSaleSpotlightCardsProps = {
  products: StorefrontProduct[];
};

export function FlashSaleSpotlightCards({ products }: FlashSaleSpotlightCardsProps) {
  const reduceMotion = useReducedMotion();

  if (!products.length) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {products.map((product, index) => (
        <motion.article
          key={product.id}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            ...motionTransition(reduceMotion, 0.45),
            delay: reduceMotion ? 0 : index * 0.08,
          }}
          whileHover={reduceMotion ? undefined : { y: -10, scale: 1.03 }}
          className="group relative overflow-hidden rounded-[1.75rem] border border-white/12 text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          style={{
            background:
              "linear-gradient(160deg, rgba(8, 4, 12, 0.98) 0%, rgba(58, 1, 60, 0.96) 55%, rgba(42, 0, 44, 0.98) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl"
            style={{
              background: "color-mix(in srgb, var(--color-accent) 28%, transparent)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full blur-3xl"
            style={{
              background: "color-mix(in srgb, white 10%, transparent)",
            }}
          />

          <div className="relative flex h-full flex-col p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-white uppercase">
                {product.badge ?? "flash pick"}
              </span>
              <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-foreground)]">
                Save {flashSale.discountPercent ?? 20}%
              </span>
            </div>

            <p className="mt-8 text-xs tracking-[0.18em] text-white/75 uppercase">{product.brand}</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">{product.name}</h2>

            <div className="mt-4">
              <Price
                amount={product.price}
                compareAt={product.compareAt}
                size="lg"
                className="[&>span]:!text-[var(--color-accent)] [&>span.line-through]:!text-white/45 [&>span:last-child]:!text-[var(--color-accent)]"
              />
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Link href={`/products/${product.slug}`} className={accentFillCtaClass}>
                View product
              </Link>
              <a href="#opening-edit" className={ghostOnDarkCtaClass}>
                Shop more deals
              </a>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

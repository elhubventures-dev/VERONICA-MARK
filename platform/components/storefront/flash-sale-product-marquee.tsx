"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Price } from "@/components/commerce/price";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";
import { flashSale } from "@/lib/storefront/demo-catalog";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FlashSaleProductMarqueeProps = {
  products: StorefrontProduct[];
  className?: string;
};

function MarqueeCard({
  product,
  loopKey,
  tone,
  active,
  onHoverStart,
  onHoverEnd,
}: {
  product: StorefrontProduct;
  loopKey: string;
  tone: "white" | "gold";
  active: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const isGold = tone === "gold";
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative shrink-0"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      animate={
        reduceMotion
          ? undefined
          : active
            ? { y: -14, scale: 1.08, zIndex: 40 }
            : { y: 0, scale: 1, zIndex: 1 }
      }
      transition={motionTransition(reduceMotion, 0.28)}
      style={{ zIndex: active ? 40 : 1 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "group relative block w-[11.5rem] overflow-hidden rounded-2xl border sm:w-[13.5rem]",
          active && "shadow-[0_22px_48px_rgba(0,0,0,0.42)]",
          isGold
            ? "border-[color-mix(in_srgb,var(--color-accent)_40%,#ffffff)]"
            : "border-[color-mix(in_srgb,#ffffff_70%,var(--color-accent))]",
        )}
        style={{
          backgroundColor: isGold ? "var(--color-accent)" : "#ffffff",
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-brand-deep)]">
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(5,5,5,0.55), transparent 50%)",
            }}
          />
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase",
              isGold
                ? "text-[var(--color-brand-deep)]"
                : "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]",
            )}
            style={{
              backgroundColor: isGold ? "#ffffff" : "var(--color-accent)",
            }}
          >
            −{flashSale.discountPercent ?? 20}%
          </span>
        </div>
        <div
          className="space-y-1 p-3"
          style={{
            backgroundColor: isGold ? "var(--color-accent)" : "#ffffff",
          }}
        >
          <p
            className="truncate text-[0.62rem] tracking-[0.16em] uppercase"
            style={{
              color: isGold ? "rgba(26, 26, 26, 0.7)" : "rgba(58, 1, 60, 0.55)",
            }}
          >
            {product.brand}
          </p>
          <p
            className="truncate font-display text-base"
            style={{
              color: isGold ? "#1a1a1a" : "var(--color-brand-deep)",
            }}
          >
            {product.name}
          </p>
          <Price
            amount={product.price}
            compareAt={product.compareAt}
            size="sm"
            className={
              isGold
                ? "[&>span]:!text-[var(--color-brand-deep)] [&>span.line-through]:!text-[var(--color-brand-deep)]/45 [&>span:last-child]:!text-[var(--color-brand-deep)]/70"
                : "[&>span]:!text-[var(--color-accent)] [&>span.line-through]:!text-[var(--color-brand-deep)]/35 [&>span:last-child]:!text-[color-mix(in_srgb,var(--color-accent)_70%,var(--color-brand-deep))]"
            }
          />
        </div>
        <span className="sr-only">{loopKey}</span>
      </Link>
    </motion.div>
  );
}

/**
 * Full-bleed auto-scrolling product strip for campaign urgency.
 * Hover pauses the track and lifts the active card above neighbors.
 */
export function FlashSaleProductMarquee({ products, className }: FlashSaleProductMarqueeProps) {
  const reduceMotion = useReducedMotion();
  const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);
  const items = React.useMemo(() => products.slice(0, 16), [products]);
  const track = React.useMemo(() => [...items, ...items], [items]);
  const duration = Math.max(28, items.length * 2.4);
  const paused = Boolean(hoveredKey) || Boolean(reduceMotion);

  if (items.length < 4) return null;

  return (
    <section
      aria-label="Flash sales product highlights"
      className={cn(
        "border-y border-white/10 bg-[var(--color-brand-deep)] py-8 text-white",
        className,
      )}
    >
      <div className="mb-5 px-5 text-center sm:px-8">
        <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-[var(--color-accent)] uppercase">
          Moving fast
        </p>
        <p className="mt-2 font-display text-2xl sm:text-3xl">Live picks from the opening edit</p>
      </div>

      <div className="relative overflow-x-hidden overflow-y-visible px-0 py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-50 w-12 bg-[linear-gradient(to_right,var(--color-brand-deep),transparent)] sm:w-20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-50 w-12 bg-[linear-gradient(to_left,var(--color-brand-deep),transparent)] sm:w-20"
        />

        <div
          className="vm-flash-marquee-track flex w-max items-end gap-4 px-5 sm:gap-5 sm:px-8"
          data-paused={paused ? "true" : "false"}
          style={
            {
              "--vm-marquee-duration": `${duration}s`,
              animationPlayState: paused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          {track.map((product, index) => {
            const key = `${product.id}-${index}`;
            return (
              <MarqueeCard
                key={key}
                product={product}
                loopKey={`marquee-${index}`}
                tone={index % 2 === 0 ? "white" : "gold"}
                active={hoveredKey === key}
                onHoverStart={() => setHoveredKey(key)}
                onHoverEnd={() => setHoveredKey((current) => (current === key ? null : current))}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

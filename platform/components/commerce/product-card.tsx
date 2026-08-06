/**
 * @file ProductCard — catalog tile for luxury fragrance listings.
 * Displays image, brand, title, price, badges, and quick actions.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { ProductBadge, type ProductBadgeVariant } from "@/components/commerce/product-badge";
import { Price } from "@/components/commerce/price";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { luxuryCardClass, luxuryFrameClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  href: string;
  title: string;
  brand: string;
  price: number;
  compareAt?: number;
  imageSrc: string;
  imageAlt: string;
  badge?: ProductBadgeVariant;
  /** When false, product remains visible but marked out of stock. */
  inStock?: boolean;
  /** Units left for customers to buy. */
  stock?: number;
  className?: string;
  onAddToWishlist?: () => void;
  wishlisted?: boolean;
  onAddToBag?: () => void;
  addingToBag?: boolean;
}

export function ProductCard({
  href,
  title,
  brand,
  price,
  compareAt,
  imageSrc,
  imageAlt,
  badge,
  inStock = true,
  stock,
  className,
  onAddToWishlist,
  wishlisted = false,
  onAddToBag,
  addingToBag = false,
}: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const displayBadge: ProductBadgeVariant | undefined = !inStock ? "sold-out" : badge;
  const soldOut = !inStock || stock === 0;
  const stockText =
    stock === undefined
      ? null
      : stock <= 0
        ? "Out of stock"
        : stock === 1
          ? "1 left"
          : `${stock} left`;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={motionTransition(reduceMotion)}
      className={cn(
        `group relative flex flex-col overflow-hidden rounded-xl ${luxuryCardClass}`,
        !inStock && "opacity-90",
        className,
      )}
    >
      <div
        className={cn("relative w-full shrink-0 overflow-hidden bg-[var(--color-muted)]", luxuryFrameClass)}
        style={{ aspectRatio: "1 / 1" }}
      >
        <Link href={href} className="absolute inset-0 block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width:768px) 50vw, 320px"
            quality={70}
            className={cn(
              "object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]",
              !inStock && "grayscale-[0.35]",
            )}
          />
        </Link>
        {displayBadge ? (
          <div className="absolute top-3 left-3 z-10">
            <ProductBadge variant={displayBadge} />
          </div>
        ) : null}
        {onAddToWishlist ? (
          <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <WishlistButton active={wishlisted} onToggle={onAddToWishlist} size="sm" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
          {brand}
        </p>
        <Link href={href} className="font-display text-lg leading-snug hover:text-[var(--color-primary)]">
          {title}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price amount={price} compareAt={compareAt} size="sm" />
          {stockText ? (
            <span
              className={cn(
                "text-xs tabular-nums",
                !inStock || stock === 0
                  ? "text-[var(--color-error)]"
                  : stock !== undefined && stock <= 3
                    ? "font-medium text-[var(--color-foreground)]"
                    : "text-[var(--color-muted-foreground)]",
              )}
            >
              {stockText}
            </span>
          ) : null}
        </div>
        {onAddToBag ? (
          <div className="pt-3">
            <AddToCartButton
              size="sm"
              className="w-full sm:w-full"
              loading={addingToBag}
              soldOut={soldOut}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onAddToBag();
              }}
            />
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

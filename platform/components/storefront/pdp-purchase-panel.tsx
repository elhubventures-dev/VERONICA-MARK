"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { Price } from "@/components/commerce/price";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { VariantSelector } from "@/components/commerce/variant-selector";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { recordRecentlyViewed } from "@/components/storefront/recently-viewed-rail";
import { Button } from "@/components/ui/button";
import { productToSnapshot, useCart } from "@/features/cart/cart-context";
import { useCompare } from "@/features/compare/compare-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import type { StorefrontProductDetail } from "@/lib/storefront/demo-catalog";

type PdpPurchasePanelProps = {
  product: StorefrontProductDetail;
};

function stockLabel(stock: number): string {
  if (stock <= 0) return "Out of stock";
  if (stock === 1) return "1 left in stock";
  return `${stock} left in stock`;
}

export function PdpPurchasePanel({ product }: PdpPurchasePanelProps) {
  const router = useRouter();
  const { addItem, getLineQuantity } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isCompared, toggle: toggleCompare, isFull } = useCompare();

  const defaultVariant = product.variants.find((v) => v.available) ?? product.variants[0];
  const [variantId, setVariantId] = React.useState(defaultVariant?.id ?? "");
  const [quantity, setQuantity] = React.useState(1);
  const [adding, setAdding] = React.useState(false);

  const selectedVariant = product.variants.find((v) => v.id === variantId) ?? defaultVariant;
  const stock = selectedVariant?.stock ?? 0;
  const soldOut = !selectedVariant?.available || stock < 1;
  const inCart = getLineQuantity(variantId);
  const remaining = Math.max(0, stock - inCart);
  const maxSelectable = Math.max(1, remaining || (soldOut ? 1 : stock));

  React.useEffect(() => {
    recordRecentlyViewed(product.slug);
  }, [product.slug]);

  React.useEffect(() => {
    setQuantity((prev) => Math.min(prev, Math.max(1, remaining || 1)));
  }, [variantId, remaining]);

  const handleAddToCart = async () => {
    if (!selectedVariant || soldOut || remaining < 1) {
      toast.error("This fragrance is out of stock");
      return;
    }

    setAdding(true);
    const result = addItem(
      selectedVariant.id,
      quantity,
      productToSnapshot(
        product,
        selectedVariant.id,
        selectedVariant.label,
        selectedVariant.price,
        stock,
      ),
    );
    setAdding(false);

    if (result.added < 1) {
      toast.message("Stock limit reached", {
        description: `Only ${stock} ${stock === 1 ? "unit is" : "units are"} available for ${product.name}.`,
      });
      return;
    }

    if (result.limited && result.added < quantity) {
      toast.success(`Added ${result.added} to your bag`, {
        description: `Only ${stock} available — bag updated to the maximum.`,
      });
      return;
    }

    toast.success(`${product.name} added to your bag`);
  };

  const handleCompare = () => {
    const added = toggleCompare(product.slug);
    if (!added && !isCompared(product.slug)) {
      toast.message("Compare list is full", {
        description: `You can compare up to 4 fragrances. Remove one to add ${product.name}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
          {product.brand}
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight sm:text-4xl">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
          <Price
            amount={selectedVariant?.price ?? product.price}
            compareAt={selectedVariant?.compareAt ?? product.compareAt}
            size="lg"
          />
          <p
            className={
              soldOut
                ? "text-sm font-medium text-[var(--color-error)]"
                : stock <= 3
                  ? "text-sm font-medium text-[var(--color-warning,var(--color-primary))]"
                  : "text-sm text-[var(--color-muted-foreground)]"
            }
            aria-live="polite"
          >
            {stockLabel(stock)}
          </p>
        </div>
      </div>

      <p className="text-base leading-relaxed text-[var(--color-muted-foreground)]">
        {product.description}
      </p>

      <VariantSelector
        variants={product.variants.map((v) => ({
          id: v.id,
          label: v.label,
          available: v.available && v.stock > 0,
        }))}
        value={variantId}
        onChange={setVariantId}
      />

      <div className="flex flex-wrap items-center gap-4">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={maxSelectable}
          disabled={soldOut || remaining < 1}
        />
        <WishlistButton
          active={isWishlisted(product.slug)}
          onToggle={() => toggle(product)}
          size="md"
        />
        <Button type="button" variant="outline" onClick={handleCompare} aria-pressed={isCompared(product.slug)}>
          {isCompared(product.slug) ? "In compare" : isFull ? "Compare full" : "Compare"}
        </Button>
      </div>

      {inCart > 0 && !soldOut ? (
        <p className="text-xs text-[var(--color-muted-foreground)]">
          {inCart} already in your bag
          {remaining > 0 ? ` · you can add up to ${remaining} more` : " · stock limit reached"}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <AddToCartButton
          loading={adding}
          soldOut={soldOut || remaining < 1}
          onClick={handleAddToCart}
        />
        <Button type="button" variant="outline" onClick={() => router.push("/cart")}>
          View bag
        </Button>
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)]">
        Complimentary gift wrapping available at checkout · Authenticity assured ·{" "}
        <Link href="/contact" className="underline underline-offset-4 hover:text-[var(--color-primary)]">
          Speak with client services
        </Link>
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/commerce/product-card";
import { productToSnapshot, useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

type CatalogProductCardProps = {
  product: StorefrontProduct;
};

function resolveDefaultVariant(product: StorefrontProduct) {
  return {
    id: product.defaultVariantId ?? `${product.id}-100ml`,
    label: product.defaultVariantLabel ?? "100 ml",
  };
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem, getLineQuantity } = useCart();
  const [adding, setAdding] = React.useState(false);

  const inStock = product.inStock !== false;
  const stock = product.stock ?? (inStock ? 6 : 0);
  const variant = resolveDefaultVariant(product);

  const handleAddToBag = () => {
    if (!inStock || stock < 1) {
      toast.error("This fragrance is out of stock");
      return;
    }

    setAdding(true);
    const result = addItem(
      variant.id,
      1,
      productToSnapshot(product, variant.id, variant.label, product.price, stock),
    );
    setAdding(false);

    if (result.added < 1) {
      const inCart = getLineQuantity(variant.id);
      toast.message("Stock limit reached", {
        description:
          inCart > 0
            ? `You already have the maximum available (${stock}) in your bag.`
            : `Only ${stock} ${stock === 1 ? "unit is" : "units are"} available for ${product.name}.`,
      });
      return;
    }

    toast.success(`${product.name} added to your bag`);
  };

  return (
    <ProductCard
      href={`/products/${product.slug}`}
      title={product.name}
      brand={product.brand}
      price={product.price}
      compareAt={product.compareAt}
      imageSrc={product.image}
      imageAlt={`${product.brand} ${product.name} perfume`}
      badge={product.badge}
      inStock={inStock}
      stock={product.stock}
      wishlisted={isWishlisted(product.slug)}
      onAddToWishlist={() => toggle(product)}
      onAddToBag={handleAddToBag}
      addingToBag={adding}
    />
  );
}

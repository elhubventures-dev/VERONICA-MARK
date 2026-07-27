import "server-only";

import { brandRepository } from "@/lib/repositories/brand.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import {
  demoBrands,
  demoProducts,
  type StorefrontBrand,
  type StorefrontProduct,
} from "@/lib/storefront/demo-catalog";

export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  try {
    const result = await productRepository.listPublished({ page: 1, pageSize: 12 });
    if (!result.items.length) return demoProducts;

    return result.items.map((product) => {
      const firstVariant = product.variants[0];
      const firstMedia = product.media[0];
      const stock = product.variants.reduce((sum, v) => sum + (v.inventory?.available ?? 0), 0);

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand.name,
        brandSlug: product.brand.slug,
        category: product.category.name,
        categorySlug: product.category.name.toLowerCase().replace(/\s+/g, "-"),
        price: Number(firstVariant?.salePrice ?? firstVariant?.price ?? 0),
        compareAt: firstVariant?.salePrice ? Number(firstVariant.price) : undefined,
        image: firstMedia?.url ?? demoProducts[0]?.image ?? "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
        badge: product.featured ? "exclusive" as const : "new" as const,
        inStock: stock > 0,
        stock,
        defaultVariantId: firstVariant?.id,
        defaultVariantLabel: firstVariant?.sizeLabel ?? firstVariant?.colorLabel ?? "Standard",
      };
    });
  } catch {
    return demoProducts;
  }
}

export async function getStorefrontBrands(): Promise<StorefrontBrand[]> {
  try {
    const result = await brandRepository.list({ page: 1, pageSize: 6 });
    if (!result.items.length) return demoBrands;

    const brands = result.items.map((brand, index) => {
      const bySlug = demoBrands.find((b) => b.slug === brand.slug)?.image;
      return {
        id: brand.id,
        slug: brand.slug,
        name: brand.name,
        description: brand.description ?? "A distinctive house in the VERONICA MARK edit.",
        image: brand.logo ?? bySlug ?? demoBrands[index % demoBrands.length]?.image ?? "",
      };
    });

    return [...brands].sort((a, b) => {
      if (a.slug === "veronica-mark-atelier") return -1;
      if (b.slug === "veronica-mark-atelier") return 1;
      return a.name.localeCompare(b.name);
    });
  } catch {
    return demoBrands;
  }
}

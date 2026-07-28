"use server";

import { getProductDetail } from "@/lib/storefront/catalog-queries";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

/**
 * Resolve wishlist slugs against the live catalog (DB, with demo fallback).
 * Preserves input order; skips slugs that no longer resolve.
 */
export async function resolveWishlistProducts(slugs: string[]): Promise<StorefrontProduct[]> {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  if (!unique.length) return [];

  const results = await Promise.all(unique.map((slug) => getProductDetail(slug)));
  return unique
    .map((_, i) => results[i])
    .filter((p): p is NonNullable<(typeof results)[number]> => Boolean(p));
}

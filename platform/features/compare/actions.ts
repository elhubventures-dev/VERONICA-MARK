"use server";

import { getProductDetail } from "@/lib/storefront/catalog-queries";
import type { StorefrontProductDetail } from "@/lib/storefront/demo-catalog";

const MAX_COMPARE = 4;

/**
 * Resolve compare-list slugs against the live catalog (DB, with demo fallback).
 * Preserves input order; skips slugs that no longer resolve.
 */
export async function resolveCompareProducts(
  slugs: string[],
): Promise<StorefrontProductDetail[]> {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))].slice(0, MAX_COMPARE);
  if (!unique.length) return [];

  const results = await Promise.all(unique.map((slug) => getProductDetail(slug)));
  return unique
    .map((slug, i) => results[i])
    .filter((p): p is StorefrontProductDetail => Boolean(p));
}

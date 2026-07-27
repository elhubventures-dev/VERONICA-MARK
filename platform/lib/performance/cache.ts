/**
 * Server-side cache helpers for catalog/marketing reads.
 * Prefer Next.js `unstable_cache` / `revalidateTag` once Prisma queries replace demo façades.
 */

export const CACHE_TAGS = {
  products: "catalog:products",
  brands: "catalog:brands",
  categories: "catalog:categories",
  sitemap: "seo:sitemap",
  promotions: "marketing:promotions",
} as const;

export const CACHE_TTL = {
  catalogSeconds: 60 * 5,
  sitemapSeconds: 60 * 60,
  marketingSeconds: 60,
} as const;

export function catalogCacheKey(...parts: string[]) {
  return ["vm", "catalog", ...parts].join(":");
}

import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";
import { getStorefrontBrands, getStorefrontProducts } from "@/lib/storefront/catalog";
import { demoCategories } from "@/lib/storefront/demo-catalog";

const staticRoutes = ["/", "/about", "/contact", "/faq", "/privacy", "/terms", "/track-order"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands] = await Promise.all([getStorefrontProducts(), getStorefrontBrands()]);
  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.6,
    })),
    {
      url: absoluteUrl("/shop"),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: absoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: absoluteUrl("/flash-sale"),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...brands.map((brand) => ({
      url: absoluteUrl(`/brands/${brand.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...demoCategories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

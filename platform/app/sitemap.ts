import type { MetadataRoute } from "next";
import { ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo/metadata";
import { demoBrands, demoCategories, demoProducts } from "@/lib/storefront/demo-catalog";

const staticRoutes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/flash-sale", changeFrequency: "daily", priority: 0.8 },
  { path: "/search", changeFrequency: "weekly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.6 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.6 },
  { path: "/track-order", changeFrequency: "monthly", priority: 0.6 },
];

function latestDate(dates: Array<Date | null | undefined>, fallback: Date): Date {
  let max = 0;
  for (const date of dates) {
    if (!date) continue;
    const time = date.getTime();
    if (time > max) max = time;
  }
  return max > 0 ? new Date(max) : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let products: Array<{ slug: string; updatedAt: Date; publishedAt: Date | null }> = [];
  let brands: Array<{ slug: string; updatedAt: Date }> = [];
  let categories: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    const [dbProducts, dbBrands, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          deletedAt: null,
          visible: true,
          status: ProductStatus.PUBLISHED,
        },
        select: { slug: true, updatedAt: true, publishedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.brand.findMany({
        where: { deletedAt: null, status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 1000,
      }),
      prisma.category.findMany({
        where: { deletedAt: null },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 1000,
      }),
    ]);

    products = dbProducts;
    brands = dbBrands;
    categories = dbCategories;
  } catch {
    // Fall back to demo catalog timestamps when DB is unavailable.
  }

  if (!products.length) {
    products = demoProducts.map((product) => ({
      slug: product.slug,
      updatedAt: now,
      publishedAt: now,
    }));
  }

  if (!brands.length) {
    brands = demoBrands.map((brand) => ({
      slug: brand.slug,
      updatedAt: now,
    }));
  }

  if (!categories.length) {
    categories = demoCategories.map((category) => ({
      slug: category.slug,
      updatedAt: now,
    }));
  }

  const catalogLastModified = latestDate(
    [
      ...products.map((p) => p.updatedAt),
      ...brands.map((b) => b.updatedAt),
      ...categories.map((c) => c.updatedAt),
    ],
    now,
  );

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified:
        route.path === "/" || route.path === "/shop" || route.path === "/flash-sale"
          ? catalogLastModified
          : now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: latestDate([product.updatedAt, product.publishedAt], now),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...brands.map((brand) => ({
      url: absoluteUrl(`/brands/${brand.slug}`),
      lastModified: brand.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

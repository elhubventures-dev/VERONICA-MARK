import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageBanner } from "@/components/storefront/page-banner";
import { getCategories } from "@/lib/storefront/catalog-queries";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Explore VERONICA MARK by category — women's, men's, and unisex perfumes curated from the world's finest fragrance houses.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <PageBanner
        src={siteMedia.perfumeShelfDisplay}
        eyebrow="Discover"
        title="Shop by category"
        description="From luminous florals to smoky woods — find the olfactive world that speaks to you."
        priority
      />
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-2xl">{category.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

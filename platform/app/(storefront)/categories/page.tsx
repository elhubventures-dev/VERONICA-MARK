import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageBanner } from "@/components/storefront/page-banner";
import { Reveal } from "@/components/storefront/reveal";
import { staggerDelay } from "@/lib/motion";
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
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={staggerDelay(index)}>
              <Link
                href={`/categories/${category.slug}`}
                className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-[transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-2xl transition-colors group-hover:text-[var(--color-primary)]">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

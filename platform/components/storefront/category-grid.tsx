import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/storefront/section-heading";
import { demoCategories } from "@/lib/storefront/demo-catalog";
import { siteMedia } from "@/lib/storefront/site-media";

export function CategoryGrid() {
  return (
    <section className="relative isolate overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
      <Image
        src={siteMedia.categoryIconsBackground}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-[color-mix(in_srgb,var(--color-muted)_90%,transparent)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Discover"
          title="Shop by category"
          description="Begin with fragrance — with fashion, accessories and lifestyle collections to follow."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {demoCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group bg-surface/95 p-3 backdrop-blur-[2px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-2 py-5">
                <h3 className="text-2xl">{category.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

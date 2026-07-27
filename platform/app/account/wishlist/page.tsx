import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAccountWishlistProducts } from "@/lib/account/queries";
import type { StorefrontProductDetail } from "@/lib/storefront/demo-catalog";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Keep your saved VERONICA MARK products close for your next order.",
};

function getBadgeCopy(badge: StorefrontProductDetail["badge"]) {
  switch (badge) {
    case "new":
      return { label: "New", variant: "accent" as const };
    case "limited":
      return { label: "Limited", variant: "warning" as const };
    case "exclusive":
      return { label: "Exclusive", variant: "default" as const };
    case "bestseller":
      return { label: "Bestseller", variant: "secondary" as const };
    default:
      return null;
  }
}

export default async function AccountWishlistPage() {
  const rawProducts = await getAccountWishlistProducts();
  const products = rawProducts.filter(
    (product): product is NonNullable<(typeof rawProducts)[number]> => Boolean(product),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Wishlist"
        description="Return to the fragrances and edits you saved for later."
        actions={
          <Button asChild variant="outline">
            <Link href="/shop">Browse shop</Link>
          </Button>
        }
      />

      {products.length ? (
        <section aria-label="Wishlist products" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const badge = getBadgeCopy(product.badge);

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-[var(--shadow-subtle)]"
              >
                <div className="relative w-full bg-[var(--color-muted)]" style={{ aspectRatio: "1 / 1" }}>
                  <Image
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {badge ? (
                      <Badge variant={badge.variant} className="rounded-lg">
                        {badge.label}
                      </Badge>
                    ) : null}
                    <Badge variant="outline" className="rounded-lg">
                      {product.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                      {product.brand}
                    </p>
                    <p className="mt-1 font-display text-2xl">{product.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Price amount={product.price} size="md" />
                    {"compareAt" in product && product.compareAt ? (
                      <span className="text-sm text-[var(--color-muted-foreground)] line-through">
                        <Price amount={product.compareAt} size="sm" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <AccountEmptyState
          title="Your wishlist is empty"
          description="Save favorite fragrances and they will appear here for quick access from your account."
          actionLabel="Explore the shop"
          actionHref="/shop"
        />
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/brand/product-actions";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandProduct } from "@/lib/brand/queries";

type BrandProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

function getProductStatusVariant(status: "draft" | "published" | "archived") {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "outline";
  }
}

export async function generateMetadata({
  params,
}: BrandProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getBrandProduct(id);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: `${product.name} · Brand Product`,
    description: `Review pricing, stock, category, and storefront linkage for ${product.name}.`,
  };
}

export default async function BrandProductDetailPage({
  params,
}: BrandProductDetailPageProps) {
  const { id } = await params;
  const product = await getBrandProduct(id);

  if (!product) {
    notFound();
  }

  const available = Math.max(0, product.stock - product.reserved);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title={product.name}
        description={`${product.category} fragrance · SKU ${product.sku}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={`/products/${product.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden />
                View storefront
              </Link>
            </Button>
            <ProductActions
              productId={product.id}
              productName={product.name}
              initialStatus={product.status}
            />
          </>
        }
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="relative w-full bg-[var(--color-muted)]" style={{ aspectRatio: "1 / 1" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 55vw, 100vw"
            />
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Price</p>
              <Price amount={product.price} compareAt={product.compareAt} size="lg" className="mt-2" />
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">On hand</p>
              <p className="mt-2 text-2xl font-medium">{product.stock}</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">Sold 30d</p>
              <p className="mt-2 text-2xl font-medium">{product.sold30d}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl">Product summary</h2>
              <Badge variant={getProductStatusVariant(product.status)} className="rounded-lg capitalize">
                {product.status}
              </Badge>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                <dt className="text-[var(--color-muted-foreground)]">Category</dt>
                <dd className="text-right font-medium">{product.category}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                <dt className="text-[var(--color-muted-foreground)]">SKU</dt>
                <dd className="text-right font-medium">{product.sku}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                <dt className="text-[var(--color-muted-foreground)]">Reserved</dt>
                <dd className="text-right font-medium">{product.reserved}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                <dt className="text-[var(--color-muted-foreground)]">Available</dt>
                <dd
                  className={
                    available <= 10
                      ? "text-right font-medium text-[var(--color-error)]"
                      : "text-right font-medium"
                  }
                >
                  {available}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[var(--color-muted-foreground)]">Storefront URL</dt>
                <dd className="text-right font-medium">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    /products/{product.slug}
                  </Link>
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="font-display text-xl">Performance snapshot</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-sm text-[var(--color-muted-foreground)]">30-day revenue</p>
                <Price amount={product.revenue30d} size="lg" className="mt-2" />
              </div>
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-sm text-[var(--color-muted-foreground)]">Catalog status</p>
                <p className="mt-2 font-medium">
                  {product.status === "published"
                    ? "Live on the storefront"
                    : product.status === "draft"
                      ? "Pending review before publish"
                      : "Hidden from live catalog"}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

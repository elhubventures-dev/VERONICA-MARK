import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layers3, PackagePlus } from "lucide-react";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { DemoToastButton } from "@/components/brand/demo-toast-button";
import { Price } from "@/components/commerce/price";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandProducts } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Products",
  description: "Manage product assortment, stock posture, and 30-day sell-through for VERONICA MARK.",
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

export default async function BrandProductsPage() {
  const products = await getBrandProducts();

  const publishedCount = products.filter((product) => product.status === "published").length;
  const draftCount = products.filter((product) => product.status === "draft").length;
  const lowStockCount = products.filter((product) => product.stock - product.reserved <= 10).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Monitor assortment health, pricing, and recent sell-through across your managed product catalog."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/brand/inventory">
                <Layers3 aria-hidden />
                Inventory
              </Link>
            </Button>
            <DemoToastButton
              label="Add product"
              message="Product creation is in demo mode"
              description="Open the product workflow later to create a new draft."
              icon={<PackagePlus aria-hidden />}
            />
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-xl px-3 py-1">
          All · {products.length}
        </Badge>
        <Badge variant="success" className="rounded-xl px-3 py-1">
          Published · {publishedCount}
        </Badge>
        <Badge variant="warning" className="rounded-xl px-3 py-1">
          Draft · {draftCount}
        </Badge>
        <Badge variant={lowStockCount > 0 ? "error" : "outline"} className="rounded-xl px-3 py-1">
          Low stock · {lowStockCount}
        </Badge>
      </div>

      {products.length === 0 ? (
        <BrandEmptyState
          title="No products yet"
          description="Create your first catalog item to start merchandising and inventory planning for this brand."
          actionLabel="Go to inventory"
          actionHref="/brand/inventory"
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-[var(--color-muted)] text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                  <tr>
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">SKU</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Stock</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Sold 30d</th>
                    <th className="px-5 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {products.map((product) => {
                    const available = Math.max(0, product.stock - product.reserved);
                    const isLowStock = available <= 10;

                    return (
                      <tr
                        key={product.id}
                        className={isLowStock ? "bg-[color-mix(in_srgb,var(--color-warning)_10%,transparent)]" : undefined}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-[var(--color-border)]">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/brand/products/${product.id}`}
                                className="font-medium transition-colors hover:text-[var(--color-primary)]"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-[var(--color-muted-foreground)]">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[var(--color-muted-foreground)]">{product.sku}</td>
                        <td className="px-5 py-4">
                          <Badge variant={getProductStatusVariant(product.status)} className="rounded-lg capitalize">
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium">{product.stock}</div>
                          <p
                            className={
                              isLowStock ? "text-sm text-[var(--color-error)]" : "text-sm text-[var(--color-muted-foreground)]"
                            }
                          >
                            {available} available
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <Price amount={product.price} compareAt={product.compareAt} />
                        </td>
                        <td className="px-5 py-4 font-medium">{product.sold30d}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild size="sm" variant="ghost">
                              <Link href={`/brand/products/${product.id}/edit`}>Edit</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/brand/products/${product.id}`}>View details</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 lg:hidden">
            {products.map((product) => {
              const available = Math.max(0, product.stock - product.reserved);
              const isLowStock = available <= 10;

              return (
                <article
                  key={product.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)]">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/brand/products/${product.id}`}
                            className="font-display text-lg transition-colors hover:text-[var(--color-primary)]"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-[var(--color-muted-foreground)]">
                            {product.category} · {product.sku}
                          </p>
                        </div>
                        <Badge variant={getProductStatusVariant(product.status)} className="rounded-lg capitalize">
                          {product.status}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl border border-[var(--color-border)] p-3">
                          <p className="text-[var(--color-muted-foreground)]">Price</p>
                          <Price amount={product.price} compareAt={product.compareAt} className="mt-1" />
                        </div>
                        <div className="rounded-xl border border-[var(--color-border)] p-3">
                          <p className="text-[var(--color-muted-foreground)]">Sold 30d</p>
                          <p className="mt-1 font-medium">{product.sold30d}</p>
                        </div>
                        <div className="rounded-xl border border-[var(--color-border)] p-3">
                          <p className="text-[var(--color-muted-foreground)]">Stock</p>
                          <p className="mt-1 font-medium">{product.stock}</p>
                        </div>
                        <div className="rounded-xl border border-[var(--color-border)] p-3">
                          <p className="text-[var(--color-muted-foreground)]">Available</p>
                          <p className={isLowStock ? "mt-1 font-medium text-[var(--color-error)]" : "mt-1 font-medium"}>
                            {available}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/brand/products/${product.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/brand/products/${product.id}`}>View details</Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href="/brand/inventory">Open inventory</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

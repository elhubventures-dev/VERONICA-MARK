import type { Metadata } from "next";
import Link from "next/link";

import { BrandEmptyState } from "@/components/brand/brand-empty-state";
import { InventoryAdjust } from "@/components/brand/inventory-adjust";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrandInventory } from "@/lib/brand/queries";

export const metadata: Metadata = {
  title: "Brand Inventory",
  description: "Track on-hand, reserved, and available stock across VERONICA MARK product variants.",
};

function getInventoryStatusVariant(status: "healthy" | "low" | "out") {
  switch (status) {
    case "healthy":
      return "success";
    case "low":
      return "warning";
    case "out":
      return "error";
  }
}

function getInventoryRowClass(status: "healthy" | "low" | "out") {
  switch (status) {
    case "healthy":
      return undefined;
    case "low":
      return "bg-[color-mix(in_srgb,var(--color-warning)_10%,transparent)]";
    case "out":
      return "bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)]";
  }
}

export default async function BrandInventoryPage() {
  const inventory = await getBrandInventory();
  const lowCount = inventory.filter((row) => row.status === "low").length;
  const outCount = inventory.filter((row) => row.status === "out").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title="Inventory"
        description="Review availability by SKU, resolve low-stock exceptions, and simulate simple stock adjustments locally."
        actions={
          <Button asChild variant="outline">
            <Link href="/brand/products">Back to products</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-xl px-3 py-1">
          Total variants · {inventory.length}
        </Badge>
        <Badge variant={lowCount > 0 ? "warning" : "outline"} className="rounded-xl px-3 py-1">
          Low stock · {lowCount}
        </Badge>
        <Badge variant={outCount > 0 ? "error" : "outline"} className="rounded-xl px-3 py-1">
          Out of stock · {outCount}
        </Badge>
      </div>

      {inventory.length === 0 ? (
        <BrandEmptyState
          title="No inventory rows yet"
          description="Add products first to start tracking variant availability, reserve counts, and reorder thresholds."
          actionLabel="Open products"
          actionHref="/brand/products"
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-[var(--color-muted)] text-xs tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                  <tr>
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">Variant</th>
                    <th className="px-5 py-4 font-medium">SKU</th>
                    <th className="px-5 py-4 font-medium">On hand</th>
                    <th className="px-5 py-4 font-medium">Reserved</th>
                    <th className="px-5 py-4 font-medium">Available</th>
                    <th className="px-5 py-4 font-medium">Reorder at</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium text-right">Adjust stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {inventory.map((row) => (
                    <tr key={row.id} className={getInventoryRowClass(row.status)}>
                      <td className="px-5 py-4 font-medium">
                        <Link
                          href={`/brand/products/${row.productId}`}
                          className="transition-colors hover:text-[var(--color-primary)]"
                        >
                          {row.productName}
                        </Link>
                      </td>
                      <td className="px-5 py-4">{row.variant}</td>
                      <td className="px-5 py-4 text-[var(--color-muted-foreground)]">{row.sku}</td>
                      <td className="px-5 py-4 font-medium">{row.onHand}</td>
                      <td className="px-5 py-4">{row.reserved}</td>
                      <td
                        className={
                          row.status !== "healthy"
                            ? "px-5 py-4 font-medium text-[var(--color-error)]"
                            : "px-5 py-4 font-medium"
                        }
                      >
                        {row.available}
                      </td>
                      <td className="px-5 py-4">{row.reorderAt}</td>
                      <td className="px-5 py-4">
                        <Badge variant={getInventoryStatusVariant(row.status)} className="rounded-lg capitalize">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <InventoryAdjust
                          sku={row.sku}
                          variantId={row.variantId}
                          initialOnHand={row.onHand}
                          initialReserved={row.reserved}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 xl:hidden">
            {inventory.map((row) => (
              <article
                key={row.id}
                className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 ${getInventoryRowClass(row.status) ?? ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/brand/products/${row.productId}`}
                      className="font-display text-lg transition-colors hover:text-[var(--color-primary)]"
                    >
                      {row.productName}
                    </Link>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {row.variant} · {row.sku}
                    </p>
                  </div>
                  <Badge variant={getInventoryStatusVariant(row.status)} className="rounded-lg capitalize">
                    {row.status}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-[var(--color-muted-foreground)]">On hand</p>
                    <p className="mt-1 font-medium">{row.onHand}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-[var(--color-muted-foreground)]">Reserved</p>
                    <p className="mt-1 font-medium">{row.reserved}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-[var(--color-muted-foreground)]">Available</p>
                    <p className={row.status === "healthy" ? "mt-1 font-medium" : "mt-1 font-medium text-[var(--color-error)]"}>
                      {row.available}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] p-3">
                    <p className="text-[var(--color-muted-foreground)]">Reorder at</p>
                    <p className="mt-1 font-medium">{row.reorderAt}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <InventoryAdjust
                    sku={row.sku}
                    variantId={row.variantId}
                    initialOnHand={row.onHand}
                    initialReserved={row.reserved}
                  />
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

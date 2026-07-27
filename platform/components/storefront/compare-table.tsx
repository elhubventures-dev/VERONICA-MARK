"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Price } from "@/components/commerce/price";
import { EmptyState } from "@/components/data/empty-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompare } from "@/features/compare/compare-context";
import { demoProductDetails } from "@/lib/storefront/demo-catalog";
import { GitCompare } from "lucide-react";

export function CompareTable() {
  const router = useRouter();
  const { slugs, remove, clear } = useCompare();

  const products = slugs
    .map((slug) => demoProductDetails.find((p) => p.slug === slug))
    .filter((p): p is (typeof demoProductDetails)[number] => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <EmptyState
          icon={GitCompare}
          title="Nothing to compare yet"
          description="Add up to four fragrances from product pages to compare notes, pricing, and specifications side by side."
          actionLabel="Browse fragrances"
          onAction={() => router.push("/shop")}
        />
      </div>
    );
  }

  const specLabels = ["Concentration", "House", "Category", "Origin", "Authenticity"];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Compare</h1>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Side-by-side view of {products.length} fragrances
          </p>
        </div>
        <Button type="button" variant="outline" onClick={clear}>
          Clear all
        </Button>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Attribute</TableHead>
              {products.map((product) => (
                <TableHead key={product.slug} className="min-w-[180px]">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-display hover:text-[var(--color-primary)]"
                  >
                    {product.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(product.slug)}
                    className="ml-2 text-xs text-[var(--color-muted-foreground)] underline"
                  >
                    Remove
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Brand</TableCell>
              {products.map((p) => (
                <TableCell key={p.slug}>{p.brand}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Price</TableCell>
              {products.map((p) => (
                <TableCell key={p.slug}>
                  <Price amount={p.price} compareAt={p.compareAt} size="sm" />
                </TableCell>
              ))}
            </TableRow>
            {specLabels.map((label) => (
              <TableRow key={label}>
                <TableCell className="font-medium">{label}</TableCell>
                {products.map((p) => (
                  <TableCell key={p.slug}>
                    {p.specs.find((s) => s.label === label)?.value ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-medium">Rating</TableCell>
              {products.map((p) => {
                const avg =
                  p.reviews.reduce((sum, r) => sum + r.rating, 0) / (p.reviews.length || 1);
                return (
                  <TableCell key={p.slug}>
                    {avg.toFixed(1)} / 5 ({p.reviews.length} reviews)
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Action</TableCell>
              {products.map((p) => (
                <TableCell key={p.slug}>
                  <Button asChild size="sm">
                    <Link href={`/products/${p.slug}`}>View product</Link>
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {products.length < 4 ? (
        <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
          You can add {4 - products.length} more fragrance{4 - products.length === 1 ? "" : "s"} to compare.
        </p>
      ) : null}
    </div>
  );
}

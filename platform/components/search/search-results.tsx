/**
 * @file SearchResults — paginated result list for catalog search.
 */

"use client";

import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SearchResultItem {
  id: string;
  title: string;
  brand: string;
  href: string;
  price: string;
  badge?: string;
}

export interface SearchResultsProps {
  results: SearchResultItem[];
  query: string;
  total: number;
  className?: string;
}

export function SearchResults({ results, query, total, className }: SearchResultsProps) {
  return (
    <section className={cn("space-y-4", className)} aria-label="Search results">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        {total} result{total === 1 ? "" : "s"} for <strong className="text-[var(--color-foreground)]">&ldquo;{query}&rdquo;</strong>
      </p>
      <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {results.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-[var(--color-muted)]"
            >
              <div>
                <p className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">{item.brand}</p>
                <p className="font-medium text-[var(--color-foreground)]">{item.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.badge ? <Badge variant="accent">{item.badge}</Badge> : null}
                <span className="text-sm font-medium">{item.price}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

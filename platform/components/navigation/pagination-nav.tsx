/**
 * @file PaginationNav — accessible page navigation for catalog and order history lists.
 * Supports previous/next controls and numbered page links.
 */

import Link from "next/link";
import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PaginationNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page (1-indexed). */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  /** Build href for a given page number. */
  hrefForPage: (page: number) => string;
  /** Accessible label for the nav landmark. */
  label?: string;
}

function pageRange(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: Array<number | "ellipsis"> = [1];
  if (current > 3) pages.push("ellipsis");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function PaginationNav({
  className,
  page,
  totalPages,
  hrefForPage,
  label = "Pagination",
  ...props
}: PaginationNavProps) {
  const pages = pageRange(page, totalPages);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex size-10 items-center justify-center rounded-xl text-sm transition-colors",
      focusRingClass,
      active
        ? "bg-[var(--color-brand-deep)] font-medium text-white"
        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
    );

  return (
    <nav aria-label={label} className={cn("flex items-center justify-center gap-1", className)} {...props}>
      {prevDisabled ? (
        <span
          aria-disabled="true"
          className="inline-flex size-10 items-center justify-center rounded-xl text-[var(--color-muted-foreground)] opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden />
          <span className="sr-only">Previous page</span>
        </span>
      ) : (
        <Link href={hrefForPage(page - 1)} className={linkClass(false)} aria-label="Previous page">
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      )}

      <ul className="flex items-center gap-1">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden className="px-1 text-[var(--color-muted-foreground)]">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefForPage(item)}
                aria-current={item === page ? "page" : undefined}
                className={linkClass(item === page)}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {nextDisabled ? (
        <span
          aria-disabled="true"
          className="inline-flex size-10 items-center justify-center rounded-xl text-[var(--color-muted-foreground)] opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden />
          <span className="sr-only">Next page</span>
        </span>
      ) : (
        <Link href={hrefForPage(page + 1)} className={linkClass(false)} aria-label="Next page">
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}

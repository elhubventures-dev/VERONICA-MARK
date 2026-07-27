/**
 * @file SearchEmpty — empty state when no catalog results match the query.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SearchX } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SearchEmptyProps {
  query?: string;
  onClear?: () => void;
  className?: string;
}

export function SearchEmpty({ query, onClear, className }: SearchEmptyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center",
        className,
      )}
    >
      <SearchX className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold">No results found</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
        {query
          ? `We couldn't find any fragrances or brands matching "${query}". Try different keywords or filters.`
          : "Try searching by fragrance name, note, or brand."}
      </p>
      {onClear ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onClear}>
          Clear search
        </Button>
      ) : null}
    </motion.div>
  );
}

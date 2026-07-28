/**
 * @file ActiveFilters — row of applied filters with clear-all action.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/search/filter-chip";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  id: string;
  label: string;
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({ filters, onRemove, onClearAll, className }: ActiveFiltersProps) {
  const reduceMotion = useReducedMotion();

  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Active filters">
      <AnimatePresence initial={false} mode="popLayout">
        {filters.map((f) => (
          <motion.div
            key={f.id}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            transition={motionTransition(reduceMotion, 0.22)}
          >
            <FilterChip
              label={f.label}
              onRemove={onRemove ? () => onRemove(f.id) : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {onClearAll ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="transition-[transform,opacity] duration-300 hover:opacity-80 active:scale-[0.98]"
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}

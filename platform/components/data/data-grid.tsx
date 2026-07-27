/**
 * @file DataGrid — responsive card grid for structured data records.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DataGridItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  footer?: React.ReactNode;
}

export interface DataGridProps {
  items: DataGridItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

const cols = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" } as const;

export function DataGrid({ items, columns = 3, className }: DataGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={cn("grid gap-4", cols[columns], className)}>
      {items.map((item, i) => (
        <motion.li key={item.id} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={motionTransition(reduceMotion, 0.2 + i * 0.04)}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
              {item.subtitle ? <p className="text-sm text-[var(--color-muted-foreground)]">{item.subtitle}</p> : null}
            </CardHeader>
            <CardContent>
              {item.meta ? <p className="text-sm text-[var(--color-foreground)]">{item.meta}</p> : null}
              {item.footer}
            </CardContent>
          </Card>
        </motion.li>
      ))}
    </ul>
  );
}

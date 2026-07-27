/**
 * @file KpiCard — primary metric tile for brand performance dashboards.
 * Displays label, value, trend delta, and optional icon with motion entrance.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({ label, value, change, changeLabel, icon: Icon, className }: KpiCardProps) {
  const reduceMotion = useReducedMotion();
  const positive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">{label}</CardTitle>
          {Icon ? (
            <span className="rounded-xl bg-[var(--color-muted)] p-2 text-[var(--color-primary)]" aria-hidden>
              <Icon className="size-4" />
            </span>
          ) : null}
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">{value}</p>
          {change !== undefined ? (
            <p className="mt-2 flex items-center gap-1 text-sm">
              {positive ? (
                <ArrowUpRight className="size-4 text-[var(--color-success)]" aria-hidden />
              ) : (
                <ArrowDownRight className="size-4 text-[var(--color-error)]" aria-hidden />
              )}
              <span className={positive ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}>
                {Math.abs(change)}%
              </span>
              <span className="text-[var(--color-muted-foreground)]">{changeLabel ?? "vs last period"}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

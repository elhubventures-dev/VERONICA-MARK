/**
 * @file RevenueWidget — revenue summary with period comparison and sparkline slot.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import * as React from "react";

import { MetricSparkline } from "@/components/dashboard/metric-sparkline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface RevenueWidgetProps {
  title?: string;
  amount: string;
  change?: number;
  sparklineData?: number[];
  className?: string;
}

export function RevenueWidget({
  title = "Revenue",
  amount,
  change,
  sparklineData = [12, 18, 14, 22, 28, 24, 32],
  className,
}: RevenueWidgetProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={motionTransition(reduceMotion)}>
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">{title}</CardTitle>
          <TrendingUp className="size-4 text-[var(--color-accent)]" aria-hidden />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-3xl font-semibold">{amount}</p>
              {change !== undefined ? (
                <p className="mt-1 text-sm text-[var(--color-success)]">+{change}% from last month</p>
              ) : null}
            </div>
            <MetricSparkline data={sparklineData} className="w-28" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

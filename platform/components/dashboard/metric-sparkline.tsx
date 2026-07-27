/**
 * @file MetricSparkline — minimal inline sparkline for KPI and revenue widgets.
 */

"use client";

import * as React from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import { chartTheme } from "@/components/charts/chart-container";
import { cn } from "@/lib/utils";

export interface MetricSparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export function MetricSparkline({ data, className, color = chartTheme.primary }: MetricSparklineProps) {
  const chartData = React.useMemo(() => data.map((value, index) => ({ index, value })), [data]);

  return (
    <div className={cn("h-10", className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * @file BarChart — categorical bar visualization for brand performance metrics.
 */

"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, chartTheme } from "@/components/charts/chart-container";

export interface BarChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface BarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: BarChartSeries[];
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  stacked?: boolean;
  showLegend?: boolean;
}

export function BarChart({
  data,
  xKey,
  series,
  title,
  description,
  className,
  height = 280,
  stacked = false,
  showLegend = false,
}: BarChartProps) {
  return (
    <ChartContainer title={title} description={description} height={height} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              background: chartTheme.surface,
              border: `1px solid ${chartTheme.grid}`,
              borderRadius: "0.75rem",
            }}
          />
          {showLegend ? <Legend /> : null}
          {series.map((s, i) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              fill={s.color ?? (i === 0 ? chartTheme.primary : chartTheme.secondary)}
              radius={[6, 6, 0, 0]}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

/**
 * @file PieChart — proportional breakdown for category or channel share.
 */

"use client";

import * as React from "react";
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartContainer, chartTheme } from "@/components/charts/chart-container";

const DEFAULT_COLORS = [
  chartTheme.primary,
  chartTheme.secondary,
  chartTheme.accent,
  "var(--color-info)",
  "var(--color-warning)",
];

export interface PieChartDatum {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartDatum[];
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
}

export function PieChart({
  data,
  title,
  description,
  className,
  height = 280,
  showLegend = true,
}: PieChartProps) {
  return (
    <ChartContainer title={title} description={description} height={height} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip
            contentStyle={{
              background: chartTheme.surface,
              border: `1px solid ${chartTheme.grid}`,
              borderRadius: "0.75rem",
            }}
          />
          {showLegend ? <Legend /> : null}
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="78%" paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

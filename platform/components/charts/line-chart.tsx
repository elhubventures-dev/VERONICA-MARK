/**
 * @file LineChart — token-styled line series for analytics dashboards.
 */

"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, chartTheme } from "@/components/charts/chart-container";

export interface LineChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface LineChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: LineChartSeries[];
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function LineChart({
  data,
  xKey,
  series,
  title,
  description,
  className,
  height = 280,
  showGrid = true,
  showLegend = false,
}: LineChartProps) {
  return (
    <ChartContainer title={title} description={description} height={height} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          {showGrid ? <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} /> : null}
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
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={s.color ?? (i === 0 ? chartTheme.primary : chartTheme.accent)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

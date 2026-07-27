/**
 * @file AreaChart — filled area series for trend and volume visualization.
 */

"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, chartTheme } from "@/components/charts/chart-container";

export interface AreaChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface AreaChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  series: AreaChartSeries[];
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  stacked?: boolean;
  showLegend?: boolean;
}

export function AreaChart({
  data,
  xKey,
  series,
  title,
  description,
  className,
  height = 280,
  stacked = false,
  showLegend = false,
}: AreaChartProps) {
  return (
    <ChartContainer title={title} description={description} height={height} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s, i) => {
              const color = s.color ?? (i === 0 ? chartTheme.primary : chartTheme.accent);
              return (
                <linearGradient key={s.dataKey} id={`area-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
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
          {series.map((s, i) => {
            const color = s.color ?? (i === 0 ? chartTheme.primary : chartTheme.accent);
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name ?? s.dataKey}
                stroke={color}
                fill={`url(#area-${s.dataKey})`}
                stackId={stacked ? "stack" : undefined}
                strokeWidth={2}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

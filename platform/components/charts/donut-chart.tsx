/**
 * @file DonutChart — ring chart with optional center label for KPI emphasis.
 */

"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartContainer, chartTheme } from "@/components/charts/chart-container";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [chartTheme.primary, chartTheme.muted, chartTheme.accent, "var(--color-info)"];

export interface DonutChartDatum {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutChartDatum[];
  title?: string;
  description?: string;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
  height?: number;
}

export function DonutChart({
  data,
  title,
  description,
  centerLabel,
  centerValue,
  className,
  height = 280,
}: DonutChartProps) {
  return (
    <ChartContainer title={title} description={description} height={height} className={cn("relative", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip
            contentStyle={{
              background: chartTheme.surface,
              border: `1px solid ${chartTheme.grid}`,
              borderRadius: "0.75rem",
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="78%"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue ? (
            <span className="font-display text-2xl font-semibold text-[var(--color-foreground)]">{centerValue}</span>
          ) : null}
          {centerLabel ? (
            <span className="text-xs text-[var(--color-muted-foreground)]">{centerLabel}</span>
          ) : null}
        </div>
      )}
    </ChartContainer>
  );
}

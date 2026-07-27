/**
 * @file ChartWidget — dashboard chart module wrapping recharts line series.
 */

"use client";

import * as React from "react";

import { LineChart } from "@/components/charts/line-chart";
import { cn } from "@/lib/utils";

export interface ChartWidgetProps {
  title?: string;
  description?: string;
  data: Record<string, string | number>[];
  xKey: string;
  seriesKey: string;
  seriesName?: string;
  className?: string;
  height?: number;
}

export function ChartWidget({
  title = "Performance",
  description,
  data,
  xKey,
  seriesKey,
  seriesName,
  className,
  height = 260,
}: ChartWidgetProps) {
  return (
    <div className={cn(className)}>
      <LineChart
        title={title}
        description={description}
        data={data}
        xKey={xKey}
        series={[{ dataKey: seriesKey, name: seriesName ?? seriesKey }]}
        height={height}
        showGrid
      />
    </div>
  );
}

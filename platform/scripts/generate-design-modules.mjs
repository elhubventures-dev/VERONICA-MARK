import fs from "node:fs";
import path from "node:path";

const root = path.resolve("components");

function write(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  return file;
}

function story(category, name, component, importPath, args = "{}", extra = "") {
  const title = `Design System/${category}/${name}`;
  return `import type { Meta, StoryObj } from "@storybook/react";

import { ${component} } from "${importPath}";

const meta = {
  title: "${title}",
  component: ${component},
  tags: ["autodocs"],
} satisfies Meta<typeof ${component}>;

export default meta;
type Story = StoryObj<typeof ${component}>;

export const Default: Story = {
  args: ${args},
};
${extra}`;
}

// --- CHARTS ---
write(
  "charts/chart-container.tsx",
  `/**
 * @file ChartContainer — responsive wrapper with title, legend slot, and token-based chart styling.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  height?: number;
}

export function ChartContainer({
  title,
  description,
  action,
  height = 280,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className,
      )}
      {...props}
    >
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h3 className="font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      )}
      <div className="w-full" style={{ height }} aria-hidden={false}>
        {children}
      </div>
    </div>
  );
}

export const chartTheme = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  muted: "var(--color-muted-foreground)",
  grid: "var(--color-border)",
  surface: "var(--color-surface)",
} as const;
`,
);

write(
  "charts/line-chart.tsx",
  `/**
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
import { cn } from "@/lib/utils";

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
              border: \`1px solid \${chartTheme.grid}\`,
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
`,
);

write(
  "charts/bar-chart.tsx",
  `/**
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
              border: \`1px solid \${chartTheme.grid}\`,
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
`,
);

write(
  "charts/area-chart.tsx",
  `/**
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
                <linearGradient key={s.dataKey} id={\`area-\${s.dataKey}\`} x1="0" y1="0" x2="0" y2="1">
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
              border: \`1px solid \${chartTheme.grid}\`,
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
                fill={\`url(#area-\${s.dataKey})\`}
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
`,
);

write(
  "charts/pie-chart.tsx",
  `/**
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
              border: \`1px solid \${chartTheme.grid}\`,
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
`,
);

write(
  "charts/donut-chart.tsx",
  `/**
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
              border: \`1px solid \${chartTheme.grid}\`,
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
`,
);

console.log("Charts base written — run part 2 for remaining modules");

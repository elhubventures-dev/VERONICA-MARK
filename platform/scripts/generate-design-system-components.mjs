import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("components");
const failed = [];
let created = 0;

function toPascalCase(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  try {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
    created += 1;
    return true;
  } catch (err) {
    failed.push({ file: relPath, error: String(err) });
    return false;
  }
}

function story(category, name, importPath, componentName, args) {
  const argsStr = JSON.stringify(args, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, '"');
  return `import type { Meta, StoryObj } from "@storybook/react";

import { ${componentName} } from "./${name}";

const meta = {
  title: "Design System/${category}/${componentName}",
  component: ${componentName},
  tags: ["autodocs"],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: ${argsStr},
};
`;
}

const files = {};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

files["dashboard/kpi-card.tsx"] = `/**
 * @file KpiCard — primary metric tile for brand performance dashboards.
 * Displays label, value, trend delta, and optional icon with motion entrance.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { focusRingClass, motionTransition } from "@/lib/motion";
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
`;

files["dashboard/stat-widget.tsx"] = `/**
 * @file StatWidget — compact inline statistic for dashboard summaries.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface StatWidgetProps {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function StatWidget({ label, value, hint, className }: StatWidgetProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition(reduceMotion, 0.25)}
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3",
        className,
      )}
    >
      <p className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-[var(--color-foreground)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{hint}</p> : null}
    </motion.div>
  );
}
`;

files["dashboard/revenue-widget.tsx"] = `/**
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
`;

files["dashboard/analytics-card.tsx"] = `/**
 * @file AnalyticsCard — contained surface for dashboard analytics modules.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AnalyticsCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({ title, description, action, children, className }: AnalyticsCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={motionTransition(reduceMotion)}>
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {action}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
`;

files["dashboard/activity-feed.tsx"] = `/**
 * @file ActivityFeed — chronological brand activity stream for admin dashboards.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: LucideIcon;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  className?: string;
}

export function ActivityFeed({ items, title = "Recent activity", className }: ActivityFeedProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)} aria-label={title}>
      <h3 className="font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
      <ol className="mt-4 space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={motionTransition(reduceMotion, 0.2 + index * 0.05)}
              className="flex gap-3"
            >
              {Icon ? (
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-primary)]" aria-hidden>
                  <Icon className="size-4" />
                </span>
              ) : (
                <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-foreground)]">{item.title}</p>
                {item.description ? <p className="text-sm text-[var(--color-muted-foreground)]">{item.description}</p> : null}
                <time className="mt-1 block text-xs text-[var(--color-muted-foreground)]">{item.timestamp}</time>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
`;

files["dashboard/chart-widget.tsx"] = `/**
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
`;

files["dashboard/conversion-funnel.tsx"] = `/**
 * @file ConversionFunnel — staged funnel visualization for checkout and browse flows.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FunnelStep {
  label: string;
  value: number;
  total?: number;
}

export interface ConversionFunnelProps {
  steps: FunnelStep[];
  title?: string;
  className?: string;
}

export function ConversionFunnel({ steps, title = "Conversion funnel", className }: ConversionFunnelProps) {
  const reduceMotion = useReducedMotion();
  const maxValue = Math.max(...steps.map((s) => s.value), 1);

  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)} aria-label={title}>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <ul className="mt-6 space-y-4">
        {steps.map((step, index) => {
          const width = (step.value / maxValue) * 100;
          const rate = step.total ? Math.round((step.value / step.total) * 100) : undefined;
          return (
            <motion.li
              key={step.label}
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={motionTransition(reduceMotion, 0.25 + index * 0.05)}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--color-foreground)]">{step.label}</span>
                <span className="text-[var(--color-muted-foreground)]">
                  {step.value.toLocaleString()}
                  {rate !== undefined ? \` (\${rate}%)\` : ""}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{ width: \`\${width}%\` }}
                  role="progressbar"
                  aria-valuenow={step.value}
                  aria-valuemin={0}
                  aria-valuemax={maxValue}
                  aria-label={\`\${step.label}: \${step.value}\`}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
`;

files["dashboard/traffic-widget.tsx"] = `/**
 * @file TrafficWidget — traffic source breakdown for brand storefront analytics.
 */

"use client";

import { Globe } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TrafficSource {
  label: string;
  sessions: number;
  share: number;
}

export interface TrafficWidgetProps {
  sources: TrafficSource[];
  title?: string;
  className?: string;
}

export function TrafficWidget({ sources, title = "Traffic sources", className }: TrafficWidgetProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">{title}</CardTitle>
        <Globe className="size-4 text-[var(--color-info)]" aria-hidden />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sources.map((source) => (
            <li key={source.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--color-foreground)]">{source.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-muted-foreground)]">{source.sessions.toLocaleString()}</span>
                <Badge variant="secondary">{source.share}%</Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
`;

files["dashboard/date-range-picker.tsx"] = `/**
 * @file DateRangePicker — accessible calendar popover for dashboard date filtering.
 */

"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const label =
    value?.from && value.to
      ? \`\${fmt(value.from)} – \${fmt(value.to)}\`
      : value?.from
        ? fmt(value.from)
        : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal sm:w-[280px]", focusRingClass, className)}
        >
          <CalendarIcon className="size-4 text-[var(--color-muted-foreground)]" aria-hidden />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={2} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
`;

files["dashboard/dashboard-header.tsx"] = `/**
 * @file DashboardHeader — page header with title, subtitle, and action slot for brand admin.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, subtitle, actions, className }: DashboardHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn("flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between", className)}
    >
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </motion.header>
  );
}
`;

files["dashboard/metric-sparkline.tsx"] = `/**
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
`;

files["dashboard/progress-ring.tsx"] = `/**
 * @file ProgressRing — circular progress indicator for goals and completion metrics.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  label,
  className,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference - percent * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={Math.round(percent * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? \`\${Math.round(percent * 100)}% complete\`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={motionTransition(reduceMotion, 0.6)}
        />
      </svg>
      <span className="absolute font-display text-lg font-semibold text-[var(--color-foreground)]">
        {Math.round(percent * 100)}%
      </span>
    </div>
  );
}
`;

// ─── CMS ─────────────────────────────────────────────────────────────────────

files["cms/cms-block.tsx"] = `/**
 * @file CmsBlock — generic wrapper for editable CMS content blocks.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface CmsBlockProps {
  id?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function CmsBlock({ id, label, children, className }: CmsBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={motionTransition(reduceMotion)}
      className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}
      aria-label={label}
    >
      {label ? <p className="mb-4 text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">{label}</p> : null}
      {children}
    </motion.section>
  );
}
`;

files["cms/hero-block.tsx"] = `/**
 * @file HeroBlock — full-width hero section for brand storytelling pages.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface HeroBlockProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function HeroBlock({ title, subtitle, ctaLabel, ctaHref, imageSrc, imageAlt, className }: HeroBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition(reduceMotion)}
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      <div className="relative aspect-[21/9] min-h-[320px]">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral)_55%,transparent)]" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <h1 className="font-display max-w-2xl text-3xl font-semibold text-white md:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-xl text-lg text-white/90">{subtitle}</p> : null}
          {ctaLabel && ctaHref ? (
            <Button asChild className={cn("mt-6 w-fit", focusRingClass)}>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
`;

files["cms/rich-text.tsx"] = `/**
 * @file RichText — semantic renderer for CMS HTML content with token-based typography.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none text-[var(--color-foreground)] [&_a]:text-[var(--color-primary)] [&_h2]:font-display [&_h3]:font-display [&_p]:text-[var(--color-muted-foreground)]",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
`;

files["cms/banner-block.tsx"] = `/**
 * @file BannerBlock — informational banner for CMS-managed announcements.
 */

"use client";

import { Info } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface BannerBlockProps {
  title: string;
  body?: string;
  variant?: "info" | "warning" | "success";
  className?: string;
}

const variantStyles = {
  info: "border-[var(--color-info)] bg-[color-mix(in_srgb,var(--color-info)_10%,var(--color-surface))]",
  warning: "border-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--color-surface))]",
  success: "border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--color-surface))]",
} as const;

export function BannerBlock({ title, body, variant = "info", className }: BannerBlockProps) {
  return (
    <aside className={cn("flex gap-3 rounded-xl border p-4", variantStyles[variant], className)} role="note">
      <Info className="mt-0.5 size-5 shrink-0 text-[var(--color-info)]" aria-hidden />
      <div>
        <p className="font-medium text-[var(--color-foreground)]">{title}</p>
        {body ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{body}</p> : null}
      </div>
    </aside>
  );
}
`;

files["cms/faq-accordion.tsx"] = `/**
 * @file FaqAccordion — FAQ section using accessible accordion primitives.
 */

"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqAccordion({ items, title = "Frequently asked questions", className }: FaqAccordionProps) {
  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <Accordion type="single" collapsible className="mt-4">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
`;

files["cms/content-section.tsx"] = `/**
 * @file ContentSection — titled CMS section with optional actions.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ContentSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ title, description, action, children, className }: ContentSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={motionTransition(reduceMotion)}
      className={cn("space-y-6", className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--color-foreground)]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
`;

files["cms/promo-banner.tsx"] = `/**
 * @file PromoBanner — promotional CTA strip for campaigns and brand launches.
 */

"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PromoBannerProps {
  headline: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function PromoBanner({ headline, description, ctaLabel, ctaHref, className }: PromoBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 rounded-xl bg-[var(--color-primary)] px-6 py-5 text-white sm:flex-row sm:items-center",
        className,
      )}
    >
      <div>
        <p className="font-display text-lg font-semibold">{headline}</p>
        {description ? <p className="mt-1 text-sm text-white/85">{description}</p> : null}
      </div>
      <Button asChild variant="secondary" className={focusRingClass}>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
`;

files["cms/media-block.tsx"] = `/**
 * @file MediaBlock — image or video block for CMS pages with caption support.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface MediaBlockProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: "video" | "square" | "wide";
  className?: string;
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
} as const;

export function MediaBlock({ src, alt, caption, aspectRatio = "wide", className }: MediaBlockProps) {
  return (
    <figure className={cn("overflow-hidden rounded-xl", className)}>
      <div className={cn("relative bg-[var(--color-muted)]", aspectClasses[aspectRatio])}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 960px" />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-[var(--color-muted-foreground)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
`;

// ─── SEARCH ──────────────────────────────────────────────────────────────────

files["search/search-bar.tsx"] = `/**
 * @file SearchBar — primary catalog search input with submit and clear actions.
 */

"use client";

import { Search, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value: valueProp,
  onChange,
  onSubmit,
  placeholder = "Search fragrances, brands…",
  className,
}: SearchBarProps) {
  const [internal, setInternal] = React.useState("");
  const value = valueProp ?? internal;

  const setValue = (next: string) => {
    setInternal(next);
    onChange?.(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex gap-2", className)} role="search">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" aria-hidden />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          aria-label="Search catalog"
        />
        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className={cn("absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 hover:bg-[var(--color-muted)]", focusRingClass)}
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
`;

files["search/search-results.tsx"] = `/**
 * @file SearchResults — paginated result list for catalog search.
 */

"use client";

import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SearchResultItem {
  id: string;
  title: string;
  brand: string;
  href: string;
  price: string;
  badge?: string;
}

export interface SearchResultsProps {
  results: SearchResultItem[];
  query: string;
  total: number;
  className?: string;
}

export function SearchResults({ results, query, total, className }: SearchResultsProps) {
  return (
    <section className={cn("space-y-4", className)} aria-label="Search results">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        {total} result{total === 1 ? "" : "s"} for <strong className="text-[var(--color-foreground)]">&ldquo;{query}&rdquo;</strong>
      </p>
      <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {results.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-[var(--color-muted)]"
            >
              <div>
                <p className="text-xs tracking-wide text-[var(--color-muted-foreground)] uppercase">{item.brand}</p>
                <p className="font-medium text-[var(--color-foreground)]">{item.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.badge ? <Badge variant="accent">{item.badge}</Badge> : null}
                <span className="text-sm font-medium">{item.price}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
`;

files["search/filter-panel.tsx"] = `/**
 * @file FilterPanel — sidebar filter container for search and catalog views.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FilterPanelProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FilterPanel({ title = "Filters", children, footer, className }: FilterPanelProps) {
  return (
    <aside className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4", className)} aria-label={title}>
      <h2 className="font-display text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <div className="mt-4 space-y-6">{children}</div>
      {footer ? <div className="mt-6 border-t border-[var(--color-border)] pt-4">{footer}</div> : null}
    </aside>
  );
}
`;

files["search/filter-chip.tsx"] = `/**
 * @file FilterChip — removable active filter pill.
 */

"use client";

import { X } from "lucide-react";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1 text-sm text-[var(--color-foreground)]",
        className,
      )}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className={cn("rounded-lg p-0.5 hover:bg-[var(--color-surface)]", focusRingClass)}
          aria-label={\`Remove filter \${label}\`}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </span>
  );
}
`;

files["search/sort-select.tsx"] = `/**
 * @file SortSelect — sort order dropdown for search results.
 */

"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SortOption {
  value: string;
  label: string;
}

export interface SortSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SortOption[];
  className?: string;
}

export function SortSelect({ value, onValueChange, options, className }: SortSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-[var(--color-muted-foreground)]">Sort by</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]" aria-label="Sort results">
          <SelectValue placeholder="Select sort" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
`;

files["search/faceted-filter.tsx"] = `/**
 * @file FacetedFilter — multi-select facet group with checkboxes.
 */

"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

export interface FacetedFilterProps {
  title: string;
  options: FacetOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FacetedFilter({ title, options, selected, onChange, className }: FacetedFilterProps) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium text-[var(--color-foreground)]">{title}</legend>
      <ul className="space-y-2">
        {options.map((opt) => {
          const id = \`\${title}-\${opt.value}\`;
          return (
            <li key={opt.value} className="flex items-center gap-2">
              <Checkbox id={id} checked={selected.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
              <Label htmlFor={id} className="flex flex-1 cursor-pointer justify-between font-normal">
                <span>{opt.label}</span>
                {opt.count !== undefined ? (
                  <span className="text-[var(--color-muted-foreground)]">{opt.count}</span>
                ) : null}
              </Label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
`;

files["search/price-range-filter.tsx"] = `/**
 * @file PriceRangeFilter — dual-thumb price range slider for catalog filtering.
 */

"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface PriceRangeFilterProps {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currency?: string;
  className?: string;
}

export function PriceRangeFilter({
  min = 0,
  max = 500,
  value,
  onChange,
  currency = "€",
  className,
}: PriceRangeFilterProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-muted-foreground)]">Price range</span>
        <span className="font-medium text-[var(--color-foreground)]">
          {currency}{value[0]} – {currency}{value[1]}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={5}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        aria-label="Price range"
      />
    </div>
  );
}
`;

files["search/active-filters.tsx"] = `/**
 * @file ActiveFilters — row of applied filters with clear-all action.
 */

"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/search/filter-chip";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  id: string;
  label: string;
}

export interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilters({ filters, onRemove, onClearAll, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Active filters">
      {filters.map((f) => (
        <FilterChip key={f.id} label={f.label} onRemove={onRemove ? () => onRemove(f.id) : undefined} />
      ))}
      {onClearAll ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
`;

files["search/search-empty.tsx"] = `/**
 * @file SearchEmpty — empty state when no catalog results match the query.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SearchX } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SearchEmptyProps {
  query?: string;
  onClear?: () => void;
  className?: string;
}

export function SearchEmpty({ query, onClear, className }: SearchEmptyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center",
        className,
      )}
    >
      <SearchX className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold">No results found</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
        {query
          ? \`We couldn't find any fragrances or brands matching "\${query}". Try different keywords or filters.\`
          : "Try searching by fragrance name, note, or brand."}
      </p>
      {onClear ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onClear}>
          Clear search
        </Button>
      ) : null}
    </motion.div>
  );
}
`;

// ─── MEDIA ───────────────────────────────────────────────────────────────────

files["media/file-upload.tsx"] = `/**
 * @file FileUpload — accessible file input with selected file preview.
 */

"use client";

import { FileUp, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  accept?: string;
  label?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function FileUpload({ accept, label = "Upload file", value, onChange, className }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="file-upload">{label}</Label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className={focusRingClass}
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="size-4" aria-hidden />
          Choose file
        </Button>
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        />
        {value ? (
          <div className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm">
            <span className="truncate">{value.name}</span>
            <button
              type="button"
              onClick={() => onChange?.(null)}
              className={cn("rounded-lg p-1 hover:bg-[var(--color-muted)]", focusRingClass)}
              aria-label="Remove file"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <span className="text-sm text-[var(--color-muted-foreground)]">No file selected</span>
        )}
      </div>
    </div>
  );
}
`;

files["media/media-gallery.tsx"] = `/**
 * @file MediaGallery — responsive grid gallery for brand assets.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { ImageThumbnail } from "@/components/media/image-thumbnail";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface MediaGalleryProps {
  items: GalleryItem[];
  onSelect?: (item: GalleryItem) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colClasses = { 2: "grid-cols-2", 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-4" } as const;

export function MediaGallery({ items, onSelect, columns = 3, className }: MediaGalleryProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={cn("grid gap-3", colClasses[columns], className)}>
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={motionTransition(reduceMotion, 0.2 + i * 0.03)}
        >
          <ImageThumbnail src={item.src} alt={item.alt} onClick={onSelect ? () => onSelect(item) : undefined} />
        </motion.li>
      ))}
    </ul>
  );
}
`;

files["media/image-thumbnail.tsx"] = `/**
 * @file ImageThumbnail — selectable image thumbnail with hover overlay.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ImageThumbnailProps {
  src: string;
  alt: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ImageThumbnail({ src, alt, selected, onClick, className }: ImageThumbnailProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border bg-[var(--color-muted)]",
        selected ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]" : "border-[var(--color-border)]",
        onClick && focusRingClass,
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover transition-transform group-hover:scale-105" sizes="200px" />
      {onClick ? (
        <span className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral)_0%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-neutral)_25%,transparent)]" aria-hidden />
      ) : null}
    </Comp>
  );
}
`;

files["media/dropzone.tsx"] = `/**
 * @file Dropzone — drag-and-drop upload area for brand media assets.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import * as React from "react";

import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DropzoneProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

export function Dropzone({
  onFiles,
  accept,
  multiple = true,
  label = "Drop files here",
  hint = "PNG, JPG up to 10 MB",
  className,
}: DropzoneProps) {
  const reduceMotion = useReducedMotion();
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    onFiles?.(Array.from(list));
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition(reduceMotion)}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
        dragging ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))]" : "border-[var(--color-border)] bg-[var(--color-surface)]",
        className,
      )}
    >
      <UploadCloud className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
      <p className="mt-4 font-medium text-[var(--color-foreground)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{hint}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn("mt-4 text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline", focusRingClass)}
      >
        Browse files
      </button>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
    </motion.div>
  );
}
`;

files["media/media-lightbox.tsx"] = `/**
 * @file MediaLightbox — fullscreen image viewer dialog.
 */

"use client";

import Image from "next/image";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface MediaLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function MediaLightbox({ open, onOpenChange, src, alt, caption, className }: MediaLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-4xl p-0 overflow-hidden", className)}>
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">{caption ?? alt}</DialogDescription>
        <div className="relative aspect-video bg-[var(--color-neutral)]">
          <Image src={src} alt={alt} fill className="object-contain" sizes="90vw" />
        </div>
        {caption ? <p className="p-4 text-sm text-[var(--color-muted-foreground)]">{caption}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
`;

files["media/avatar-upload.tsx"] = `/**
 * @file AvatarUpload — profile avatar with upload and remove actions.
 */

"use client";

import { Camera, Trash2 } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AvatarUploadProps {
  src?: string;
  alt: string;
  initials: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export function AvatarUpload({ src, alt, initials, onUpload, onRemove, className }: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Avatar className="size-20 rounded-xl">
        {src ? <AvatarImage src={src} alt={alt} /> : null}
        <AvatarFallback className="rounded-xl text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className={focusRingClass} onClick={() => inputRef.current?.click()}>
          <Camera className="size-4" aria-hidden />
          Upload
        </Button>
        {src && onRemove ? (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="size-4" aria-hidden />
            Remove
          </Button>
        ) : null}
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload?.(f); }} />
      </div>
    </div>
  );
}
`;

// ─── PROFILE ─────────────────────────────────────────────────────────────────

files["profile/profile-header.tsx"] = `/**
 * @file ProfileHeader — account header with avatar, name, and member details.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarSrc?: string;
  initials: string;
  memberSince?: string;
  tier?: string;
  className?: string;
}

export function ProfileHeader({ name, email, avatarSrc, initials, memberSince, tier, className }: ProfileHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn("flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:flex-row sm:items-center", className)}
    >
      <Avatar className="size-16 rounded-xl">
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
        <AvatarFallback className="rounded-xl text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-xl font-semibold">{name}</h1>
          {tier ? <Badge variant="accent">{tier}</Badge> : null}
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)]">{email}</p>
        {memberSince ? <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Member since {memberSince}</p> : null}
      </div>
    </motion.header>
  );
}
`;

files["profile/profile-form.tsx"] = `/**
 * @file ProfileForm — editable profile fields for customer accounts.
 */

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
  loading?: boolean;
}

export function ProfileForm({ defaultValues, onSubmit, loading }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit?.(v))} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="given-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="family-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" autoComplete="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save profile"}</Button>
      </form>
    </Form>
  );
}
`;

files["profile/preference-toggles.tsx"] = `/**
 * @file PreferenceToggles — account preference switches grouped by category.
 */

"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface PreferenceItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
}

export interface PreferenceTogglesProps {
  title?: string;
  items: PreferenceItem[];
  onChange: (id: string, checked: boolean) => void;
  className?: string;
}

export function PreferenceToggles({ title = "Preferences", items, onChange, className }: PreferenceTogglesProps) {
  return (
    <section className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <ul className="mt-4 divide-y divide-[var(--color-border)]">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
              {item.description ? <p className="text-sm text-[var(--color-muted-foreground)]">{item.description}</p> : null}
            </div>
            <Switch id={item.id} checked={item.checked} onCheckedChange={(c) => onChange(item.id, c)} aria-label={item.label} />
          </li>
        ))}
      </ul>
    </section>
  );
}
`;

files["profile/security-settings.tsx"] = `/**
 * @file SecuritySettings — password and session security controls.
 */

"use client";

import { KeyRound, Shield } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/forms/password-input";
import { cn } from "@/lib/utils";

export interface SecuritySettingsProps {
  onChangePassword?: (current: string, next: string) => void | Promise<void>;
  onEnableTwoFactor?: () => void;
  twoFactorEnabled?: boolean;
  className?: string;
}

export function SecuritySettings({ onChangePassword, onEnableTwoFactor, twoFactorEnabled, className }: SecuritySettingsProps) {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");

  return (
    <section className={cn("space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <div>
        <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
          <KeyRound className="size-5 text-[var(--color-primary)]" aria-hidden />
          Password
        </h2>
        <div className="mt-4 space-y-3 max-w-md">
          <PasswordInput label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
          <PasswordInput label="New password" value={next} onChange={setNext} autoComplete="new-password" />
          <Button type="button" onClick={() => onChangePassword?.(current, next)} disabled={!current || !next}>
            Update password
          </Button>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] pt-6">
        <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
          <Shield className="size-5 text-[var(--color-info)]" aria-hidden />
          Two-factor authentication
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          {twoFactorEnabled ? "Two-factor authentication is enabled on your account." : "Add an extra layer of security to your account."}
        </p>
        {!twoFactorEnabled && onEnableTwoFactor ? (
          <Button type="button" variant="outline" className="mt-4" onClick={onEnableTwoFactor}>
            Enable two-factor
          </Button>
        ) : null}
      </div>
    </section>
  );
}
`;

files["profile/address-form.tsx"] = `/**
 * @file AddressForm — shipping and billing address entry form.
 */

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form";
import { FormSection } from "@/components/forms/form-section";

export interface AddressFormValues {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit?: (values: AddressFormValues) => void | Promise<void>;
}

export function AddressForm({ defaultValues, onSubmit }: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    defaultValues: { line1: "", line2: "", city: "", postalCode: "", country: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit?.(v))} className="space-y-6">
        <FormSection title="Delivery address" description="Used for fragrance orders and brand deliveries.">
          <FormField control={form.control} name="line1" rules={{ required: "Address is required" }} render={({ field }) => (
            <FormItem><FormLabel>Address line 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="line2" render={({ field }) => (
            <FormItem><FormLabel>Address line 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="city" rules={{ required: "City is required" }} render={({ field }) => (
              <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="postalCode" rules={{ required: "Postal code is required" }} render={({ field }) => (
              <FormItem><FormLabel>Postal code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="country" rules={{ required: "Country is required" }} render={({ field }) => (
            <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </FormSection>
        <Button type="submit">Save address</Button>
      </form>
    </Form>
  );
}
`;

files["profile/notification-preferences.tsx"] = `/**
 * @file NotificationPreferences — email and push notification opt-in controls.
 */

"use client";

import { Bell } from "lucide-react";
import * as React from "react";

import { PreferenceToggles } from "@/components/profile/preference-toggles";
import { cn } from "@/lib/utils";

export interface NotificationPreferencesProps {
  values: Record<string, boolean>;
  onChange: (id: string, checked: boolean) => void;
  className?: string;
}

const defaultItems = [
  { id: "orders", label: "Order updates", description: "Shipping confirmations and delivery alerts" },
  { id: "promotions", label: "Brand promotions", description: "New launches from your favourite brands" },
  { id: "newsletter", label: "Newsletter", description: "Curated edits and fragrance journal" },
];

export function NotificationPreferences({ values, onChange, className }: NotificationPreferencesProps) {
  const items = defaultItems.map((item) => ({ ...item, checked: values[item.id] ?? false }));

  return (
    <div className={cn(className)}>
      <div className="mb-4 flex items-center gap-2">
        <Bell className="size-5 text-[var(--color-accent)]" aria-hidden />
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
      </div>
      <PreferenceToggles title="Email preferences" items={items} onChange={onChange} />
    </div>
  );
}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

files["data/data-table.tsx"] = `/**
 * @file DataTable — sortable data table powered by TanStack Table.
 */

"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  caption?: string;
}

export function DataTable<TData, TValue>({ columns, data, className, caption }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]", className)}>
      <Table>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      type="button"
                      className={cn("inline-flex items-center gap-1", focusRingClass)}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUp className="size-3.5" aria-hidden />,
                        desc: <ArrowDown className="size-3.5" aria-hidden />,
                      }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="size-3.5 opacity-50" aria-hidden />}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-[var(--color-muted-foreground)]">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
`;

files["data/data-grid.tsx"] = `/**
 * @file DataGrid — responsive card grid for structured data records.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DataGridItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  footer?: React.ReactNode;
}

export interface DataGridProps {
  items: DataGridItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

const cols = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" } as const;

export function DataGrid({ items, columns = 3, className }: DataGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={cn("grid gap-4", cols[columns], className)}>
      {items.map((item, i) => (
        <motion.li key={item.id} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={motionTransition(reduceMotion, 0.2 + i * 0.04)}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
              {item.subtitle ? <p className="text-sm text-[var(--color-muted-foreground)]">{item.subtitle}</p> : null}
            </CardHeader>
            <CardContent>
              {item.meta ? <p className="text-sm text-[var(--color-foreground)]">{item.meta}</p> : null}
              {item.footer}
            </CardContent>
          </Card>
        </motion.li>
      ))}
    </ul>
  );
}
`;

files["data/empty-state.tsx"] = `/**
 * @file EmptyState — reusable empty data placeholder with optional action.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type LucideIcon, Inbox } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn("flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] px-6 py-12 text-center", className)}
    >
      <Icon className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button type="button" className="mt-6" onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </motion.div>
  );
}
`;

files["data/error-state.tsx"] = `/**
 * @file ErrorState — error feedback with retry action for failed data loads.
 */

"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-xl border border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_8%,var(--color-surface))] px-6 py-10 text-center", className)} role="alert">
      <AlertTriangle className="size-10 text-[var(--color-error)]" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>Try again</Button>
      ) : null}
    </div>
  );
}
`;

files["data/loading-state.tsx"] = `/**
 * @file LoadingState — skeleton placeholder for async data views.
 */

"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  variant?: "spinner" | "skeleton";
  rows?: number;
  label?: string;
  className?: string;
}

export function LoadingState({ variant = "skeleton", rows = 4, label = "Loading", className }: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)} aria-busy="true">
        <Spinner aria-label={label} />
        <p className="text-sm text-[var(--color-muted-foreground)]">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 rounded-xl border border-[var(--color-border)] p-4", className)} aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}
`;

files["data/confirm-action.tsx"] = `/**
 * @file ConfirmAction — alert dialog for destructive or irreversible actions.
 */

"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmActionProps {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  variant?: "default" | "destructive";
  className?: string;
}

export function ConfirmAction({
  triggerLabel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  className,
}: ConfirmActionProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={variant === "destructive" ? "destructive" : "default"} className={cn(className)}>
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
`;

// ─── FORMS ───────────────────────────────────────────────────────────────────

files["forms/form.tsx"] = `/**
 * @file Form — react-hook-form primitives (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage).
 */

"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext.name) throw new Error("useFormField must be used within FormField");
  return { id: itemContext.id, name: fieldContext.name, formItemId: \`\${itemContext.id}-form-item\`, formDescriptionId: \`\${itemContext.id}-form-item-description\`, formMessageId: \`\${itemContext.id}-form-item-message\`, ...fieldState };
}

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();
  return <Label className={cn(error && "text-[var(--color-error)]", className)} htmlFor={formItemId} {...props} />;
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : \`\${formDescriptionId} \${formMessageId}\`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  return <p id={formDescriptionId} className={cn("text-xs text-[var(--color-muted-foreground)]", className)} {...props} />;
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;
  if (!body) return null;
  return (
    <p id={formMessageId} className={cn("text-xs text-[var(--color-error)]", className)} role="alert" {...props}>
      {body}
    </p>
  );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField };
`;

files["forms/form-section.tsx"] = `/**
 * @file FormSection — grouped form fields with title and description.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={cn("space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <legend className="px-1 font-display text-lg font-semibold text-[var(--color-foreground)]">{title}</legend>
      {description ? <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
`;

files["forms/password-input.tsx"] = `/**
 * @file PasswordInput — password field with visibility toggle.
 */

"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PasswordInputProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
  className?: string;
}

export function PasswordInput({ id: idProp, label, value, onChange, autoComplete = "current-password", className }: PasswordInputProps) {
  const id = idProp ?? React.useId();
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <Input id={id} type={visible ? "text" : "password"} value={value} onChange={(e) => onChange?.(e.target.value)} autoComplete={autoComplete} className="pr-11" />
        <button type="button" onClick={() => setVisible((v) => !v)} className={cn("absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 hover:bg-[var(--color-muted)]", focusRingClass)} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
`;

files["forms/search-input.tsx"] = `/**
 * @file SearchInput — compact search field for forms and toolbars.
 */

"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ className, onSearch, onKeyDown, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" aria-hidden />
      <Input
        type="search"
        className="pl-10"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === "Enter") onSearch?.((e.target as HTMLInputElement).value);
        }}
        {...props}
      />
    </div>
  );
}
`;

files["forms/number-input.tsx"] = `/**
 * @file NumberInput — numeric input with increment and decrement controls.
 */

"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export function NumberInput({ value, onChange, min = 0, max = 999, step = 1, label, className }: NumberInputProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <span className="text-sm font-medium">{label}</span> : null}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - step))} className={cn("inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)]", focusRingClass)} aria-label="Decrease">
          <Minus className="size-4" aria-hidden />
        </button>
        <Input type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(clamp(Number(e.target.value)))} className="text-center" aria-label={label ?? "Quantity"} />
        <button type="button" onClick={() => onChange(clamp(value + step))} className={cn("inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)]", focusRingClass)} aria-label="Increase">
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
`;

files["forms/currency-input.tsx"] = `/**
 * @file CurrencyInput — EUR-formatted currency entry for pricing forms.
 */

"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  className?: string;
}

export function CurrencyInput({ label, value = 0, onChange, currency = "€", className }: CurrencyInputProps) {
  const [display, setDisplay] = React.useState(String(value));

  React.useEffect(() => {
    setDisplay(value ? String(value) : "");
  }, [value]);

  const parse = (raw: string) => {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label>{label}</Label> : null}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--color-muted-foreground)]">{currency}</span>
        <Input
          inputMode="decimal"
          value={display}
          onChange={(e) => {
            setDisplay(e.target.value);
            onChange?.(parse(e.target.value));
          }}
          className="pl-8"
          aria-label={label ?? "Amount"}
        />
      </div>
    </div>
  );
}
`;

files["forms/phone-input.tsx"] = `/**
 * @file PhoneInput — international phone number field with country prefix.
 */

"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const prefixes = [
  { code: "+44", label: "UK (+44)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+39", label: "IT (+39)" },
];

export interface PhoneInputProps {
  label?: string;
  prefix?: string;
  onPrefixChange?: (prefix: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function PhoneInput({ label = "Phone", prefix = "+44", onPrefixChange, value, onChange, className }: PhoneInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select value={prefix} onValueChange={onPrefixChange}>
          <SelectTrigger className="w-[130px]" aria-label="Country code">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {prefixes.map((p) => (
              <SelectItem key={p.code} value={p.code}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="tel" value={value} onChange={(e) => onChange?.(e.target.value)} autoComplete="tel-national" className="flex-1" />
      </div>
    </div>
  );
}
`;

files["forms/fieldset.tsx"] = `/**
 * @file Fieldset — accessible grouped form controls with legend.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface FieldsetProps {
  legend: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Fieldset({ legend, description, children, disabled, className }: FieldsetProps) {
  return (
    <fieldset disabled={disabled} className={cn("space-y-4 rounded-xl border border-[var(--color-border)] p-6", disabled && "opacity-60", className)}>
      <legend className="px-1 text-sm font-semibold text-[var(--color-foreground)]">{legend}</legend>
      {description ? <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
      {children}
    </fieldset>
  );
}
`;

files["data/data-table.stories.tsx"] = `import type { Meta, StoryObj } from "@storybook/react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./data-table";

type BrandRow = { id: string; brand: string; orders: number; revenue: string };

const columns: ColumnDef<BrandRow>[] = [
  { accessorKey: "brand", header: "Brand", enableSorting: true },
  { accessorKey: "orders", header: "Orders", enableSorting: true },
  { accessorKey: "revenue", header: "Revenue", enableSorting: true },
];

const data: BrandRow[] = [
  { id: "1", brand: "Atelier Lumière", orders: 128, revenue: "€18,420" },
  { id: "2", brand: "Maison Velours", orders: 94, revenue: "€12,880" },
  { id: "3", brand: "Nocturne Atelier", orders: 76, revenue: "€9,640" },
];

const meta = {
  title: "Design System/Data/DataTable",
  component: DataTable,
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    columns,
    data,
    caption: "Brand performance table",
  },
};
`;

files["forms/form.stories.tsx"] = `import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface DemoValues {
  email: string;
}

function FormDemo() {
  const form = useForm<DemoValues>({ defaultValues: { email: "" } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="max-w-md space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="you@example.com" />
              </FormControl>
              <FormDescription>We'll never share your email with brands without consent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  );
}

const meta = {
  title: "Design System/Forms/Form",
  component: FormDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof FormDemo>;

export default meta;
type Story = StoryObj<typeof FormDemo>;

export const Default: Story = {
  render: () => <FormDemo />,
};
`;

const storyConfigs = [
  { file: "dashboard/kpi-card", category: "Dashboard", component: "KpiCard", extra: 'import { ShoppingBag } from "lucide-react";\n', args: { label: "Orders", value: "1,284", change: 12.4, icon: "ShoppingBag" } },
  { file: "dashboard/stat-widget", category: "Dashboard", component: "StatWidget", args: { label: "Avg. order value", value: "€142", hint: "Across all brands" } },
  { file: "dashboard/revenue-widget", category: "Dashboard", component: "RevenueWidget", args: { amount: "€48,290", change: 8.2 } },
  { file: "dashboard/analytics-card", category: "Dashboard", component: "AnalyticsCard", render: true, args: { title: "Brand engagement", description: "Weekly metrics across storefronts", children: "Chart or metrics content" } },
  { file: "dashboard/activity-feed", category: "Dashboard", component: "ActivityFeed", extra: 'import { Package } from "lucide-react";\n', args: { items: [{ id: "1", title: "New order placed", description: "Maison Noir EDP — Atelier Lumière", timestamp: "2 min ago", icon: "Package" }] } },
  { file: "dashboard/chart-widget", category: "Dashboard", component: "ChartWidget", args: { data: [{ month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5100 }], xKey: "month", seriesKey: "revenue", seriesName: "Revenue" } },
  { file: "dashboard/conversion-funnel", category: "Dashboard", component: "ConversionFunnel", args: { steps: [{ label: "Visits", value: 12000 }, { label: "Add to bag", value: 3200, total: 12000 }, { label: "Checkout", value: 890, total: 3200 }] } },
  { file: "dashboard/traffic-widget", category: "Dashboard", component: "TrafficWidget", args: { sources: [{ label: "Organic search", sessions: 4200, share: 42 }, { label: "Direct", sessions: 2800, share: 28 }] } },
  { file: "dashboard/date-range-picker", category: "Dashboard", component: "DateRangePicker", args: {} },
  { file: "dashboard/dashboard-header", category: "Dashboard", component: "DashboardHeader", args: { title: "Brand dashboard", subtitle: "Performance overview for managed brands" } },
  { file: "dashboard/metric-sparkline", category: "Dashboard", component: "MetricSparkline", args: { data: [12, 18, 14, 22, 28, 24, 32] } },
  { file: "dashboard/progress-ring", category: "Dashboard", component: "ProgressRing", args: { value: 72, label: "Monthly goal" } },
  { file: "cms/cms-block", category: "Cms", component: "CmsBlock", render: true, args: { label: "Content block", children: "" } },
  { file: "cms/hero-block", category: "Cms", component: "HeroBlock", args: { title: "Discover luxury fragrance", subtitle: "Curated brands for discerning collectors", ctaLabel: "Explore collection", ctaHref: "/shop", imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=500&fit=crop", imageAlt: "Luxury fragrance hero" } },
  { file: "cms/rich-text", category: "Cms", component: "RichText", args: { html: "<h2>Our story</h2><p>VERONICA MARK partners with the world's finest fragrance brands.</p>" } },
  { file: "cms/banner-block", category: "Cms", component: "BannerBlock", args: { title: "Complimentary shipping", body: "On orders over €150 from participating brands.", variant: "info" } },
  { file: "cms/faq-accordion", category: "Cms", component: "FaqAccordion", args: { items: [{ id: "1", question: "How do I track my order?", answer: "You'll receive tracking details by email once your brand ships." }] } },
  { file: "cms/content-section", category: "Cms", component: "ContentSection", render: true, args: { title: "Featured brands", description: "Managed brand partners" } },
  { file: "cms/promo-banner", category: "Cms", component: "PromoBanner", args: { headline: "New brand launch", description: "Atelier Lumière debuts Maison Noir", ctaLabel: "Shop now", ctaHref: "/shop/atelier-lumiere" } },
  { file: "cms/media-block", category: "Cms", component: "MediaBlock", args: { src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=960&h=400&fit=crop", alt: "Fragrance editorial", caption: "Maison Noir campaign imagery" } },
  { file: "search/search-bar", category: "Search", component: "SearchBar", args: { placeholder: "Search fragrances, brands…" } },
  { file: "search/search-results", category: "Search", component: "SearchResults", args: { query: "noir", total: 1, results: [{ id: "1", title: "Maison Noir EDP", brand: "Atelier Lumière", href: "/shop/maison-noir", price: "€185" }] } },
  { file: "search/filter-panel", category: "Search", component: "FilterPanel", render: true, args: { title: "Filters" } },
  { file: "search/filter-chip", category: "Search", component: "FilterChip", args: { label: "Eau de Parfum", onRemove: "() => undefined" } },
  { file: "search/sort-select", category: "Search", component: "SortSelect", args: { value: "newest", options: [{ value: "newest", label: "Newest" }, { value: "price-asc", label: "Price: low to high" }] } },
  { file: "search/faceted-filter", category: "Search", component: "FacetedFilter", args: { title: "Brand", options: [{ value: "atelier", label: "Atelier Lumière", count: 12 }], selected: [], onChange: "() => undefined" } },
  { file: "search/price-range-filter", category: "Search", component: "PriceRangeFilter", args: { value: [50, 200], onChange: "() => undefined" } },
  { file: "search/active-filters", category: "Search", component: "ActiveFilters", args: { filters: [{ id: "1", label: "Brand: Atelier Lumière" }], onRemove: "() => undefined", onClearAll: "() => undefined" } },
  { file: "search/search-empty", category: "Search", component: "SearchEmpty", args: { query: "unknown scent", onClear: "() => undefined" } },
  { file: "media/file-upload", category: "Media", component: "FileUpload", args: { label: "Brand asset" } },
  { file: "media/media-gallery", category: "Media", component: "MediaGallery", args: { items: [{ id: "1", src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop", alt: "Product shot" }] } },
  { file: "media/image-thumbnail", category: "Media", component: "ImageThumbnail", args: { src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop", alt: "Thumbnail", onClick: "() => undefined" } },
  { file: "media/dropzone", category: "Media", component: "Dropzone", args: { onFiles: "() => undefined" } },
  { file: "media/media-lightbox", category: "Media", component: "MediaLightbox", args: { open: true, onOpenChange: "() => undefined", src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=800&fit=crop", alt: "Full size product", caption: "Maison Noir" } },
  { file: "media/avatar-upload", category: "Media", component: "AvatarUpload", args: { alt: "Veronica Mark", initials: "VM", onUpload: "() => undefined" } },
  { file: "profile/profile-header", category: "Profile", component: "ProfileHeader", args: { name: "Veronica Mark", email: "veronica@example.com", initials: "VM", memberSince: "2024", tier: "Maison" } },
  { file: "profile/profile-form", category: "Profile", component: "ProfileForm", args: { defaultValues: { firstName: "Veronica", lastName: "Mark", email: "veronica@example.com" } } },
  { file: "profile/preference-toggles", category: "Profile", component: "PreferenceToggles", args: { items: [{ id: "newsletter", label: "Newsletter", description: "Weekly fragrance journal", checked: true }], onChange: "() => undefined" } },
  { file: "profile/security-settings", category: "Profile", component: "SecuritySettings", args: { twoFactorEnabled: false, onChangePassword: "() => undefined", onEnableTwoFactor: "() => undefined" } },
  { file: "profile/address-form", category: "Profile", component: "AddressForm", args: { defaultValues: { line1: "12 Rue de la Paix", city: "Paris", postalCode: "75002", country: "France" } } },
  { file: "profile/notification-preferences", category: "Profile", component: "NotificationPreferences", args: { values: { orders: true, promotions: false, newsletter: true }, onChange: "() => undefined" } },
  { file: "data/data-grid", category: "Data", component: "DataGrid", args: { items: [{ id: "1", title: "Atelier Lumière", subtitle: "Managed brand", meta: "24 active SKUs" }] } },
  { file: "data/empty-state", category: "Data", component: "EmptyState", args: { title: "No orders yet", description: "When you place an order, it will appear here.", actionLabel: "Browse brands", onAction: "() => undefined" } },
  { file: "data/error-state", category: "Data", component: "ErrorState", args: { onRetry: "() => undefined" } },
  { file: "data/loading-state", category: "Data", component: "LoadingState", args: {} },
  { file: "data/confirm-action", category: "Data", component: "ConfirmAction", args: { triggerLabel: "Delete item", title: "Delete this item?", description: "This action cannot be undone.", onConfirm: "() => undefined", variant: "destructive" } },
  { file: "forms/form-section", category: "Forms", component: "FormSection", render: true, args: { title: "Account details", description: "Update your profile information" } },
  { file: "forms/password-input", category: "Forms", component: "PasswordInput", args: { label: "Password", value: "" } },
  { file: "forms/search-input", category: "Forms", component: "SearchInput", args: { placeholder: "Search…" } },
  { file: "forms/number-input", category: "Forms", component: "NumberInput", args: { value: 1, onChange: "() => undefined", label: "Quantity" } },
  { file: "forms/currency-input", category: "Forms", component: "CurrencyInput", args: { label: "Price", value: 185 } },
  { file: "forms/phone-input", category: "Forms", component: "PhoneInput", args: { value: "7700900123" } },
  { file: "forms/fieldset", category: "Forms", component: "Fieldset", render: true, args: { legend: "Delivery options", description: "Choose how you'd like to receive your order" } },
];

function storyFromConfig(cfg) {
  let argsStr = JSON.stringify(cfg.args, null, 4).slice(2, -2);
  argsStr = argsStr.replace(/"\(\) => undefined"/g, "() => undefined");
  if (cfg.extra?.includes("ShoppingBag")) argsStr = argsStr.replace('"ShoppingBag"', "ShoppingBag");
  if (cfg.extra?.includes("Package")) {
    argsStr = argsStr.replace('"Package"', "Package");
  }
  if (cfg.render) {
    const childByFile = {
      "dashboard/analytics-card": '<p className="text-sm text-[var(--color-muted-foreground)]">Sample analytics content</p>',
      "cms/cms-block": '<p className="text-[var(--color-foreground)]">Editable CMS block content</p>',
      "cms/content-section": '<p className="text-sm text-[var(--color-muted-foreground)]">Brand grid or editorial content</p>',
      "search/filter-panel": '<p className="text-sm text-[var(--color-muted-foreground)]">Filter groups go here</p>',
      "forms/form-section": '<p className="text-sm text-[var(--color-muted-foreground)]">Form fields go here</p>',
      "forms/fieldset": '<p className="text-sm text-[var(--color-muted-foreground)]">Grouped inputs go here</p>',
    };
    const child = childByFile[cfg.file] ?? '<p className="text-sm text-[var(--color-muted-foreground)]">Content</p>';
    const renderArgs = JSON.stringify(cfg.args, null, 4).slice(2, -2);
    return `import type { Meta, StoryObj } from "@storybook/react";

import { ${cfg.component} } from "./${path.basename(cfg.file)}";

const meta = {
  title: "Design System/${cfg.category}/${cfg.component}",
  component: ${cfg.component},
  tags: ["autodocs"],
} satisfies Meta<typeof ${cfg.component}>;

export default meta;
type Story = StoryObj<typeof ${cfg.component}>;

export const Default: Story = {
  render: (args) => (
    <${cfg.component} {...args}>
      ${child}
    </${cfg.component}>
  ),
  args: {
    ${renderArgs}
  },
};
`;
  }
  return `${cfg.extra ?? ""}import type { Meta, StoryObj } from "@storybook/react";

import { ${cfg.component} } from "./${path.basename(cfg.file)}";

const meta = {
  title: "Design System/${cfg.category}/${cfg.component}",
  component: ${cfg.component},
  tags: ["autodocs"],
} satisfies Meta<typeof ${cfg.component}>;

export default meta;
type Story = StoryObj<typeof ${cfg.component}>;

export const Default: Story = {
  args: {
    ${argsStr}
  },
};
`;
}

for (const [relPath, content] of Object.entries(files)) {
  writeFile(relPath, content);
}

for (const cfg of storyConfigs) {
  if (!files[`${cfg.file}.stories.tsx`]) {
    writeFile(`${cfg.file}.stories.tsx`, storyFromConfig(cfg));
  }
}

console.log(JSON.stringify({ created, failed: failed.length ? failed : undefined }));

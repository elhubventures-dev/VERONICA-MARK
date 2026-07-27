/**
 * @file ThemeToggle — light/dark/system theme switcher using next-themes.
 * Accessible icon button with WCAG AA focus ring.
 */

"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show compact icon-only control. */
  compact?: boolean;
}

export function ThemeToggle({ className, compact = true, ...props }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const order = ["light", "dark", "system"] as const;
    const current = theme ?? "system";
    const nextIndex = (order.indexOf(current as (typeof order)[number]) + 1) % order.length;
    setTheme(order[nextIndex] ?? "system");
  };

  const Icon = !mounted
    ? Sun
    : theme === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  const label =
    theme === "system" ? "System theme" : resolvedTheme === "dark" ? "Dark theme" : "Light theme";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Toggle theme. Current: ${label}`}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]",
        focusRingClass,
        compact ? "size-11" : "h-11 gap-2 px-4 text-sm",
        className,
      )}
      {...props}
    >
      <Icon className="size-4" aria-hidden />
      {!compact ? <span>{label}</span> : null}
    </button>
  );
}

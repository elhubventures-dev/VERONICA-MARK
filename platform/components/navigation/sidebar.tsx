/**
 * @file Sidebar — vertical navigation panel for account and admin layouts.
 * Supports grouped sections with optional collapse on mobile.
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { NavLink, type NavLinkProps } from "@/components/navigation/nav-link";
import { Stack } from "@/components/layout/stack";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SidebarSection {
  title?: string;
  items: Array<Omit<NavLinkProps, "children"> & { label: string }>;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  sections: SidebarSection[];
  /** Collapsible narrow rail mode. */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: React.ReactNode;
}

export function Sidebar({
  className,
  sections,
  collapsible = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  header,
  ...props
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;

  const toggleCollapsed = () => {
    const next = !collapsed;
    setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        {!collapsed && header ? <div className="min-w-0 flex-1">{header}</div> : null}
        {collapsible ? (
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
            className={cn("ml-auto rounded-xl p-2 hover:bg-[var(--color-muted)]", focusRingClass)}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {sections.map((section, index) => (
          <Stack key={section.title ?? index} gap="xs" className={index > 0 ? "mt-6" : undefined}>
            {section.title && !collapsed ? (
              <p className="px-3 text-xs font-medium tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                {section.title}
              </p>
            ) : null}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const { label, ...linkProps } = item;
                return (
                  <li key={item.href}>
                    <NavLink variant="sidebar" {...linkProps} title={collapsed ? label : undefined}>
                      {collapsed ? label.charAt(0) : label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </Stack>
        ))}
      </nav>
    </aside>
  );
}

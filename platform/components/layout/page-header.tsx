/**
 * @file PageHeader — page title block with eyebrow, description, and action slot.
 * Used atop catalog, account, and checkout views.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Small label above the title, e.g. "Account" or "Maison Collection". */
  eyebrow?: string;
  /** Primary heading text. */
  title: string;
  /** Supporting copy beneath the title. */
  description?: string;
  /** Right-aligned actions (buttons, filters). */
  actions?: React.ReactNode;
  /** Center-align for editorial pages. */
  align?: "start" | "center";
}

export function PageHeader({
  className,
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
      {...props}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[var(--color-accent)] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl tracking-tight text-[var(--color-foreground)] md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-base text-[var(--color-muted-foreground)]">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn("flex shrink-0 flex-wrap gap-2", align === "center" && "justify-center")}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}

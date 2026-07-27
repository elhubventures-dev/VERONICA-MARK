/**
 * @file NavLink — accessible navigation link with active state and luxury underline treatment.
 * Supports internal Next.js routes and external URLs.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface NavLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  /** Force active styling regardless of pathname. */
  active?: boolean;
  /** Visual variant for header vs sidebar contexts. */
  variant?: "default" | "subtle" | "sidebar";
  /** Match child paths as active. */
  matchSubpaths?: boolean;
}

export function NavLink({
  className,
  href,
  active,
  variant = "default",
  matchSubpaths = false,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    active ??
    (pathname === href || (matchSubpaths && href !== "/" && pathname.startsWith(href)));

  const variantClasses = {
    default: cn(
      "relative text-sm font-medium transition-colors",
      isActive
        ? "text-[var(--color-primary)]"
        : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
      isActive &&
        "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[var(--color-accent)]",
    ),
    subtle: cn(
      "text-sm transition-colors",
      isActive ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
    ),
    sidebar: cn(
      "block rounded-xl px-3 py-2 text-sm transition-colors",
      isActive
        ? "bg-[var(--color-muted)] font-medium text-[var(--color-primary)]"
        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
    ),
  } as const;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(focusRingClass, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

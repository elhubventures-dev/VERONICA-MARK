/**
 * @file SiteHeader — sticky global header with logo, navigation slot, and utility actions.
 * Composes with Navbar, MiniCart, and ThemeToggle for the marketplace shell.
 */

"use client";

import Link from "next/link";
import * as React from "react";

import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Primary navigation element (Navbar, MegaMenu trigger). */
  navigation?: React.ReactNode;
  /** Right-side utilities: search, account, cart. */
  utilities?: React.ReactNode;
  /** Sticky positioning on scroll. */
  sticky?: boolean;
  /** Show translucent backdrop when sticky. */
  translucent?: boolean;
}

export function SiteHeader({
  className,
  navigation,
  utilities,
  sticky = true,
  translucent = true,
  ...props
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]",
        sticky && "sticky top-0",
        translucent && sticky && "supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] supports-[backdrop-filter]:backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <div className="flex min-w-0 items-center gap-6 lg:gap-10">
            <Link
              href="/"
              className="shrink-0 font-display text-xl tracking-tight text-[var(--color-primary)] focus-visible:rounded-sm md:text-2xl"
            >
              VERONICA MARK
            </Link>
            {navigation ? (
              <div className="hidden min-w-0 flex-1 lg:block">{navigation}</div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {utilities}
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}

/**
 * @file MegaMenu — rich dropdown navigation panel for category discovery.
 * Supports multi-column brand and collection links with featured spotlight.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MegaMenuColumn {
  title: string;
  links: Array<{ label: string; href: string; description?: string }>;
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  href: string;
  imageAlt?: string;
}

export interface MegaMenuProps {
  /** Trigger button label. */
  label: string;
  /** Dropdown columns. */
  columns: MegaMenuColumn[];
  /** Optional featured spotlight card. */
  featured?: MegaMenuFeatured;
  className?: string;
}

export function MegaMenu({ label, columns, featured, className }: MegaMenuProps) {
  const [open, setOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const panelId = React.useId();
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  React.useEffect(() => () => clearCloseTimer(), []);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]",
          focusRingClass,
        )}
      >
        {label}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${label} menu`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            transition={motionTransition(reduceMotion, 0.2)}
            className="absolute top-full left-0 z-50 mt-3 w-[min(100vw-2rem,720px)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]"
          >
            <div className={cn("grid gap-6", featured ? "md:grid-cols-[1fr_220px]" : "md:grid-cols-3")}>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {columns.map((column) => (
                  <div key={column.title}>
                    <p className="mb-3 text-xs font-medium tracking-[0.12em] text-[var(--color-accent)] uppercase">
                      {column.title}
                    </p>
                    <ul className="space-y-2">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "block rounded-lg px-1 py-1 text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)]",
                              focusRingClass,
                            )}
                          >
                            {link.label}
                            {link.description ? (
                              <span className="mt-0.5 block text-xs text-[var(--color-muted-foreground)]">
                                {link.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {featured ? (
                <Link
                  href={featured.href}
                  className={cn(
                    "flex flex-col justify-end rounded-xl bg-[var(--color-muted)] p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--color-muted)_80%,var(--color-accent))]",
                    focusRingClass,
                  )}
                >
                  <p className="text-xs tracking-[0.12em] text-[var(--color-accent)] uppercase">
                    Featured
                  </p>
                  <p className="mt-2 font-display text-lg">{featured.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                    {featured.description}
                  </p>
                </Link>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * @file MegaMenu — rich dropdown navigation panel for category discovery.
 * Supports multi-column brand and collection links with featured spotlight.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { focusRingClass, luxuryCardClass, luxuryFrameClass, motionTransition } from "@/lib/motion";
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
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeMenu = () => {
    clearCloseTimer();
    setOpen(false);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  React.useEffect(() => () => clearCloseTimer(), []);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const onPointerDown = (event: MouseEvent | PointerEvent) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node)) return;
      if (!root.contains(event.target)) closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("relative shrink-0", className)}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap text-[var(--color-muted-foreground)] transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--color-accent)] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--color-foreground)] hover:after:scale-x-100",
          open && "text-[var(--color-foreground)] after:scale-x-100",
          focusRingClass,
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${label} menu`}
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
            transition={motionTransition(reduceMotion, 0.2)}
            /* pt-3 (not mt-3) keeps a hover bridge between trigger and panel */
            className="absolute top-full left-0 z-[60] w-[min(100vw-2rem,720px)] pt-3"
          >
            <div className={`rounded-xl p-6 ${luxuryCardClass}`}>
              <div className={cn("grid gap-6", featured ? "md:grid-cols-[1fr_220px]" : "md:grid-cols-3")}>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {columns.map((column, columnIndex) => (
                    <motion.div
                      key={column.title}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        ...motionTransition(reduceMotion, 0.2),
                        delay: reduceMotion ? 0 : columnIndex * 0.04,
                      }}
                    >
                      <p className="mb-3 text-xs font-medium tracking-[0.12em] text-[var(--color-accent)] uppercase">
                        {column.title}
                      </p>
                      <ul className="space-y-2">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={closeMenu}
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
                    </motion.div>
                  ))}
                </div>

                {featured ? (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      ...motionTransition(reduceMotion, 0.22),
                      delay: reduceMotion ? 0 : 0.12,
                    }}
                  >
                    <Link
                      href={featured.href}
                      onClick={closeMenu}
                      className={cn(
                        `flex flex-col justify-end rounded-xl bg-[var(--color-muted)] p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--color-muted)_80%,var(--color-accent))] ${luxuryFrameClass}`,
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
                  </motion.div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

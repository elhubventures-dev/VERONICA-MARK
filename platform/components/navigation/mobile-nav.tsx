/**
 * @file MobileNav — slide-over navigation drawer for small viewports.
 * Full-screen overlay with animated panel and focus trap semantics.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import * as React from "react";

import { NavLink, type NavLinkProps } from "@/components/navigation/nav-link";
import { Stack } from "@/components/layout/stack";
import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MobileNavItem extends Omit<NavLinkProps, "children"> {
  label: string;
}

export interface MobileNavProps {
  items: MobileNavItem[];
  /** Footer slot for account / sign-in. */
  footer?: React.ReactNode;
  className?: string;
}

export function MobileNav({ items, footer, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const panelId = React.useId();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden",
          focusRingClass,
        )}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={motionTransition(reduceMotion, 0.2)}
              className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--color-neutral)_40%,transparent)] lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id={panelId}
              aria-label="Mobile"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "100%" }}
              transition={motionTransition(reduceMotion, 0.3)}
              className="fixed top-0 right-0 z-[60] flex h-full w-[min(100%,320px)] flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="font-display text-xl text-[var(--color-primary)]">Menu</p>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={cn("rounded-xl p-2 hover:bg-[var(--color-muted)]", focusRingClass)}
                >
                  <X className="size-5" />
                </button>
              </div>

              <Stack gap="xs" className="flex-1">
                {items.map((item) => {
                  const { label, ...linkProps } = item;
                  return (
                    <NavLink
                      key={item.href}
                      variant="sidebar"
                      onClick={() => setOpen(false)}
                      {...linkProps}
                    >
                      {label}
                    </NavLink>
                  );
                })}
              </Stack>

              {footer ? <div className="mt-6 border-t border-[var(--color-border)] pt-6">{footer}</div> : null}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

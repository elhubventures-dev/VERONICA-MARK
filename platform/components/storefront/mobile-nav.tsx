"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { createPortal } from "react-dom";

import { motionTransition, staggerDelay } from "@/lib/motion";

const links = [
  { label: "Shop all", href: "/shop" },
  { label: "New arrivals", href: "/shop?sort=newest" },
  { label: "Categories", href: "/categories" },
  { label: "Perfumes", href: "/categories/perfumes" },
  { label: "Women", href: "/categories/women" },
  { label: "Men", href: "/categories/men" },
  { label: "Brands", href: "/brands" },
  { label: "Opening edit", href: "/flash-sale" },
  { label: "Search", href: "/search" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Compare", href: "/compare" },
  { label: "Account", href: "/account" },
  { label: "Shopping bag", href: "/cart" },
  { label: "About VERONICA MARK", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Track an order", href: "/track-order" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const panelId = React.useId();
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const panel = mounted
    ? createPortal(
        <AnimatePresence>
          {open ? (
            <motion.div
              key="mobile-nav"
              id={panelId}
              className="fixed inset-x-0 z-40 overflow-y-auto bg-[var(--color-background)] px-5 py-8 shadow-lg lg:hidden"
              style={{
                top: "var(--storefront-chrome-height, 112px)",
                bottom: "var(--storefront-bottom-nav-height, 64px)",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={motionTransition(reduceMotion, 0.28)}
            >
              <nav>
                <ul className="divide-y divide-[var(--color-border)]">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        ...motionTransition(reduceMotion, 0.28),
                        delay: reduceMotion ? 0 : staggerDelay(index, 0.025),
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-14 items-center font-display text-2xl transition-opacity hover:opacity-70 active:scale-[0.99]"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] transition-[background-color,transform] duration-200 active:scale-[0.96] hover:bg-[var(--color-muted)]"
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </button>
      {panel}
    </div>
  );
}

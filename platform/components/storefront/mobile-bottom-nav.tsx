"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Home, LayoutGrid, ShoppingBag, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/features/cart/cart-context";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DEFAULT_HEIGHT = 64;

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
  count?: number;
  featured?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const update = () => {
      const next = el.getBoundingClientRect().height;
      setHeight(next);
      document.documentElement.style.setProperty(
        "--storefront-bottom-nav-height",
        `${next}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--storefront-bottom-nav-height");
    };
  }, []);

  const items: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      match: (path) => path === "/",
    },
    {
      href: "/shop",
      label: "Shop",
      icon: LayoutGrid,
      match: (path) =>
        path === "/shop" ||
        path.startsWith("/shop/") ||
        path.startsWith("/categories") ||
        path.startsWith("/brands") ||
        path.startsWith("/products"),
    },
    {
      href: "/flash-sale",
      label: "Flash",
      icon: Zap,
      match: (path) => isActivePath(path, "/flash-sale"),
      featured: true,
    },
    {
      href: "/account",
      label: "Account",
      icon: User,
      match: (path) => isActivePath(path, "/account"),
    },
    {
      href: "/cart",
      label: "Bag",
      icon: ShoppingBag,
      match: (path) => isActivePath(path, "/cart") || path.startsWith("/checkout"),
      count: itemCount,
    },
  ];

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Mobile primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/90 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="mx-auto flex h-16 max-w-[1440px] items-stretch">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);

            if (item.featured) {
              return (
                <li key={item.href} className="relative flex flex-1 items-end justify-center pb-1.5">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-label="Flash sales"
                    className="group relative -mt-5 flex flex-col items-center gap-1 active:scale-[0.94]"
                  >
                    <span className="relative inline-flex">
                      {!reduceMotion ? (
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-[var(--color-accent)]/35"
                          animate={{ scale: [1, 1.28, 1], opacity: [0.45, 0, 0.45] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ) : null}
                      <motion.span
                        initial={reduceMotion ? false : { y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={motionTransition(reduceMotion, 0.4)}
                        className={cn(
                          "relative inline-flex size-12 items-center justify-center rounded-full border-2 shadow-[0_10px_28px_color-mix(in_srgb,var(--color-brand-deep)_28%,transparent)] transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]",
                          active
                            ? "border-[var(--color-accent-bright)] bg-[var(--color-brand-deep)] text-[var(--color-accent-bright)]"
                            : "border-[var(--color-accent)] bg-[linear-gradient(160deg,var(--color-brand-field),var(--color-brand-deep))] text-[var(--color-accent)]",
                        )}
                      >
                        <Icon className="size-5 fill-current" strokeWidth={2.25} aria-hidden />
                        <span className="absolute -top-1 -right-1 rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[8px] font-bold tracking-[0.12em] text-[var(--color-accent-foreground)] uppercase shadow-sm">
                          Sale
                        </span>
                      </motion.span>
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-[0.12em] uppercase",
                        active
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-accent)]",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={
                    item.count && item.count > 0
                      ? `${item.label}, ${item.count} items`
                      : item.label
                  }
                  className={cn(
                    "relative flex h-full flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium tracking-[0.08em] uppercase transition-[color,transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.94]",
                    active
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
                  )}
                >
                  <span className="relative inline-flex">
                    <Icon
                      className={cn(
                        "size-[1.15rem] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        active && "scale-105",
                      )}
                      strokeWidth={active ? 2.25 : 1.75}
                      aria-hidden
                    />
                    {item.count && item.count > 0 ? (
                      <span className="absolute -top-1.5 -right-2.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-semibold tracking-normal text-white normal-case">
                        {item.count > 99 ? "99+" : item.count}
                      </span>
                    ) : null}
                  </span>
                  <span>{item.label}</span>
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-[var(--color-accent)]"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="lg:hidden" style={{ height }} aria-hidden="true" />
    </>
  );
}

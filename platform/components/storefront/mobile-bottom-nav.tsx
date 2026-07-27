"use client";

import { Heart, Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { cn } from "@/lib/utils";

const DEFAULT_HEIGHT = 64;

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
  count?: number;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { slugs: wishlistSlugs } = useWishlist();
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
        path.startsWith("/products") ||
        path.startsWith("/flash-sale"),
    },
    {
      href: "/wishlist",
      label: "Wishlist",
      icon: Heart,
      match: (path) => isActivePath(path, "/wishlist"),
      count: wishlistSlugs.length,
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

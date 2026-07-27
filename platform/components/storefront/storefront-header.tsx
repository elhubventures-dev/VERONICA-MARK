"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GitCompare, Heart, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { MegaMenu } from "@/components/navigation/mega-menu";
import { MobileNav } from "@/components/storefront/mobile-nav";
import { useCart } from "@/features/cart/cart-context";
import { useCompare } from "@/features/compare/compare-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const shopColumns = [
  {
    title: "Shop by",
    links: [
      { label: "All fragrances", href: "/shop", description: "The full edit" },
      { label: "New arrivals", href: "/shop?sort=newest", description: "Recent to the edit" },
      { label: "Opening edit", href: "/flash-sale", description: "Private opening collection" },
      { label: "Search", href: "/search", description: "Find a fragrance" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "All categories", href: "/categories" },
      { label: "Perfumes", href: "/categories/perfumes" },
      { label: "Women", href: "/categories/women" },
      { label: "Men", href: "/categories/men" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "Brands", href: "/brands" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Track an order", href: "/track-order" },
      { label: "Compare", href: "/compare" },
    ],
  },
];

const primaryLinks = [
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Opening edit", href: "/flash-sale" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

function IconLink({
  href,
  label,
  count,
  children,
  className,
}: {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      aria-label={count ? `${label}, ${count} items` : label}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] transition-[background-color,transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--color-muted)] active:scale-[0.94]",
        className,
      )}
    >
      {children}
      {count && count > 0 ? (
        <motion.span
          key={count}
          initial={reduceMotion ? false : { scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={motionTransition(reduceMotion, 0.25)}
          className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-white"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      ) : null}
    </Link>
  );
}

export function StorefrontHeader() {
  const { itemCount } = useCart();
  const { slugs: wishlistSlugs } = useWishlist();
  const { slugs: compareSlugs } = useCompare();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/80">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-4 sm:px-8 lg:gap-6">
        <MobileNav />

        <BrandMark variant="icon" size={36} priority />

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-5 xl:gap-6 lg:flex">
          <MegaMenu
            label="Shop"
            columns={shopColumns}
            featured={{
              title: "After dark",
              description: "Incense, velvet woods and skin-warm amber.",
              href: "/categories/perfumes",
            }}
          />
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium whitespace-nowrap text-[var(--color-muted-foreground)] transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--color-accent)] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--color-foreground)] hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            className="relative hidden min-h-10 min-w-[11rem] items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-muted-foreground)] transition-[background-color,transform] duration-300 hover:bg-[var(--color-muted)] active:scale-[0.98] md:inline-flex"
            aria-label="Search the collection"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            <span>Search</span>
          </Link>
          <IconLink href="/search" label="Search" className="md:hidden">
            <Search className="size-4" aria-hidden />
          </IconLink>
          <IconLink href="/wishlist" label="Wishlist" count={wishlistSlugs.length}>
            <Heart className="size-4" aria-hidden />
          </IconLink>
          <IconLink href="/compare" label="Compare" count={compareSlugs.length} className="hidden sm:inline-flex">
            <GitCompare className="size-4" aria-hidden />
          </IconLink>
          <IconLink href="/account" label="Account">
            <User className="size-4" aria-hidden />
          </IconLink>
          <IconLink href="/cart" label="Shopping bag" count={itemCount}>
            <ShoppingBag className="size-4" aria-hidden />
          </IconLink>
        </div>
      </div>
    </header>
  );
}

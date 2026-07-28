"use client";

import * as React from "react";

import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

const WISHLIST_STORAGE_KEY = "vm-wishlist";

type WishlistContextValue = {
  /** False until localStorage has been read on the client. */
  ready: boolean;
  slugs: string[];
  isWishlisted: (slug: string) => boolean;
  toggle: (product: Pick<StorefrontProduct, "slug" | "name" | "brand" | "price" | "image">) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const WishlistContext = React.createContext<WishlistContextValue | null>(null);

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setSlugs(readStored());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const isWishlisted = React.useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = React.useCallback((product: Pick<StorefrontProduct, "slug">) => {
    setSlugs((prev) =>
      prev.includes(product.slug) ? prev.filter((s) => s !== product.slug) : [...prev, product.slug],
    );
  }, []);

  const remove = React.useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = React.useCallback(() => setSlugs([]), []);

  const value = React.useMemo(
    () => ({ ready: hydrated, slugs, isWishlisted, toggle, remove, clear }),
    [hydrated, slugs, isWishlisted, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}

export function getWishlistStorageKey() {
  return WISHLIST_STORAGE_KEY;
}

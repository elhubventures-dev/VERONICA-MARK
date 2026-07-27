"use client";

import * as React from "react";

const COMPARE_STORAGE_KEY = "vm-compare";
const MAX_COMPARE = 4;

type CompareContextValue = {
  slugs: string[];
  isCompared: (slug: string) => boolean;
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
  isFull: boolean;
};

const CompareContext = React.createContext<CompareContextValue | null>(null);

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setSlugs(readStored());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const isCompared = React.useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = React.useCallback((slug: string) => {
    let added = false;
    setSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      added = true;
      return [...prev, slug];
    });
    return added;
  }, []);

  const remove = React.useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = React.useCallback(() => setSlugs([]), []);

  const value = React.useMemo(
    () => ({
      slugs,
      isCompared,
      toggle,
      remove,
      clear,
      isFull: slugs.length >= MAX_COMPARE,
    }),
    [slugs, isCompared, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = React.useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}

export const MAX_COMPARE_ITEMS = MAX_COMPARE;

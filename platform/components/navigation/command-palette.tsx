/**
 * @file CommandPalette — keyboard-driven search overlay for products, brands, and pages.
 * Opens with Ctrl/Cmd+K; filters a flat list of commands with arrow-key navigation.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import * as React from "react";

import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  keywords?: string[];
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  commands: CommandItem[];
  placeholder?: string;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({
  commands,
  placeholder = "Search fragrances, brands, pages…",
  open: openProp,
  onOpenChange,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
      if (!value) {
        setQuery("");
        setActiveIndex(0);
      }
    },
    [onOpenChange],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((cmd) => {
      const haystack = [cmd.label, cmd.description, cmd.group, ...(cmd.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [commands, query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const selectItem = (item: CommandItem) => {
    item.onSelect?.();
    setOpen(false);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      selectItem(filtered[activeIndex]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-muted-foreground)]",
          focusRingClass,
        )}
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-auto hidden rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close command palette"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={motionTransition(reduceMotion, 0.15)}
              className="fixed inset-0 z-[70] bg-[color-mix(in_srgb,var(--color-neutral)_45%,transparent)]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: -8 }}
              transition={motionTransition(reduceMotion, 0.2)}
              className="fixed top-[12vh] left-1/2 z-[80] w-[min(100vw-2rem,560px)] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-subtle)]"
            >
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4">
                <Search className="size-4 text-[var(--color-muted-foreground)]" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder={placeholder}
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-muted-foreground)]"
                  aria-controls="command-list"
                  aria-activedescendant={
                    filtered[activeIndex] ? `command-${filtered[activeIndex].id}` : undefined
                  }
                />
              </div>

              <ul id="command-list" role="listbox" className="max-h-72 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-[var(--color-muted-foreground)]">
                    No results for &ldquo;{query}&rdquo;
                  </li>
                ) : (
                  filtered.map((item, index) => (
                    <li key={item.id} role="option" aria-selected={index === activeIndex}>
                      <button
                        id={`command-${item.id}`}
                        type="button"
                        onClick={() => selectItem(item)}
                        className={cn(
                          "flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          focusRingClass,
                          index === activeIndex
                            ? "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                            : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]",
                        )}
                      >
                        <span className="font-medium text-[var(--color-foreground)]">{item.label}</span>
                        {item.description ? (
                          <span className="text-xs">{item.description}</span>
                        ) : null}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

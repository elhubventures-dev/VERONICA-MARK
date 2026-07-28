/**
 * @file SearchBar — primary catalog search input with submit and clear actions.
 */

"use client";

import { Search, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value: valueProp,
  onChange,
  onSubmit,
  placeholder = "Search fragrances, brands…",
  className,
}: SearchBarProps) {
  const [internal, setInternal] = React.useState(valueProp ?? "");
  const isControlled = valueProp !== undefined && onChange !== undefined;
  const value = isControlled ? valueProp : internal;

  React.useEffect(() => {
    if (!isControlled) {
      setInternal(valueProp ?? "");
    }
  }, [isControlled, valueProp]);

  const setValue = (next: string) => {
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex gap-2", className)} role="search">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" aria-hidden />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          aria-label="Search catalog"
        />
        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className={cn("absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 hover:bg-[var(--color-muted)]", focusRingClass)}
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}

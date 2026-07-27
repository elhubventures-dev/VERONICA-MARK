/**
 * @file SearchInput — compact search field for forms and toolbars.
 */

"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ className, onSearch, onKeyDown, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" aria-hidden />
      <Input
        type="search"
        className="pl-10"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === "Enter") onSearch?.((e.target as HTMLInputElement).value);
        }}
        {...props}
      />
    </div>
  );
}

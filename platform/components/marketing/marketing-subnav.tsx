"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { marketingNavItems } from "@/lib/marketing/nav";
import { cn } from "@/lib/utils";

export function MarketingSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Marketing modules"
      className="-mx-1 overflow-x-auto pb-1"
    >
      <ul className="flex min-w-max gap-1 px-1">
        {marketingNavItems.map((item) => {
          const exact = "exact" in item && item.exact === true;
          const active = exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-xl px-3 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "bg-[var(--color-muted)] font-medium text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

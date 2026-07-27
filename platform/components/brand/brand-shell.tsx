"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandMark } from "@/components/layout/brand-mark";
import { NavLink } from "@/components/navigation/nav-link";
import { Sidebar } from "@/components/navigation/sidebar";
import { brandNavSections } from "@/lib/brand/nav";
import { cn } from "@/lib/utils";

type BrandShellProps = {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  brandName: string;
};

export function BrandShell({ children, userName, userEmail, brandName }: BrandShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <a
        href="#brand-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to brand workspace
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] lg:hidden"
            aria-label={mobileOpen ? "Close brand menu" : "Open brand menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark href="/brand" variant="icon" size={28} />
            <p className="truncate text-xs text-[var(--color-muted-foreground)]">{brandName}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/shop"
              className="hidden rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm sm:inline-flex"
            >
              View storefront
            </Link>
            <Link
              href="/auth/sign-out"
              className="rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-white"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        <Sidebar
          className="sticky top-16 hidden h-[calc(100svh-4rem)] shrink-0 lg:flex"
          collapsible
          sections={brandNavSections}
          header={
            <div>
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-[var(--color-muted-foreground)]">{userEmail}</p>
            </div>
          }
        />

        <main id="brand-main" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10" tabIndex={-1}>
          {children}
        </main>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Brand navigation"
        >
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-[var(--color-surface)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{brandName}</p>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)]"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3" aria-label="Brand workspace">
              {brandNavSections.map((section) => (
                <div key={section.title} className="mb-5">
                  {section.title ? (
                    <p className="mb-2 px-3 text-xs font-medium tracking-[0.12em] text-[var(--color-muted-foreground)] uppercase">
                      {section.title}
                    </p>
                  ) : null}
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          href={item.href}
                          variant="sidebar"
                          matchSubpaths={item.matchSubpaths}
                          className={cn("min-h-11")}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}

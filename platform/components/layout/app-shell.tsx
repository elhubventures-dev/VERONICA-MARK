/**
 * @file AppShell — top-level application layout composing header, main, and footer.
 * Provides consistent page structure for storefront and account experiences.
 */

import * as React from "react";

import { SiteFooter, type SiteFooterProps } from "@/components/layout/site-footer";
import { SiteHeader, type SiteHeaderProps } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page content. */
  children: React.ReactNode;
  /** Props forwarded to SiteHeader. */
  headerProps?: Omit<SiteHeaderProps, "children">;
  /** Props forwarded to SiteFooter. */
  footerProps?: Omit<SiteFooterProps, "children">;
  /** Hide footer on focused flows (checkout). */
  hideFooter?: boolean;
  /** Main landmark id for skip links. */
  mainId?: string;
}

export function AppShell({
  className,
  children,
  headerProps,
  footerProps,
  hideFooter = false,
  mainId = "main-content",
  ...props
}: AppShellProps) {
  return (
    <div className={cn("flex min-h-svh flex-col", className)} {...props}>
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader {...headerProps} />
      <main id={mainId} className="flex-1">
        {children}
      </main>
      {!hideFooter ? <SiteFooter {...footerProps} /> : null}
    </div>
  );
}

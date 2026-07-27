/**
 * @file SiteFooter — global marketplace footer with brand, navigation, and legal links.
 * Luxury perfume marketplace tone with managed-brand positioning.
 */

import Link from "next/link";
import * as React from "react";

import { Container } from "@/components/layout/container";
import { Stack } from "@/components/layout/stack";
import { cn } from "@/lib/utils";

export interface FooterLinkGroup {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation link groups. */
  groups?: FooterLinkGroup[];
  /** Newsletter slot or CTA. */
  newsletter?: React.ReactNode;
}

const defaultGroups: FooterLinkGroup[] = [
  {
    title: "Discover",
    links: [
      { label: "New Arrivals", href: "/shop/new" },
      { label: "Maison Edit", href: "/shop/maison" },
      { label: "Gift Concierge", href: "/gifts" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Orders", href: "/account/orders" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "Addresses", href: "/account/addresses" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "About VERONICA MARK", href: "/about" },
      { label: "Partner With Us", href: "/brands/apply" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter({
  className,
  groups = defaultGroups,
  newsletter,
  ...props
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn("border-t border-[var(--color-border)] bg-[var(--color-surface)]", className)}
      {...props}
    >
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <Stack gap="md">
            <p className="font-display text-2xl text-[var(--color-primary)]">VERONICA MARK</p>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              The curated destination for luxury fragrance. Every brand is managed, authenticated,
              and presented with editorial precision.
            </p>
            {newsletter}
          </Stack>

          <nav
            aria-label="Footer"
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
          >
            {groups.map((group) => (
              <Stack key={group.title} gap="sm">
                <p className="text-xs font-medium tracking-[0.15em] text-[var(--color-foreground)] uppercase">
                  {group.title}
                </p>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-primary)] focus-visible:rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Stack>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} VERONICA MARK. All rights reserved.</p>
          <Stack direction="horizontal" gap="md" className="flex-wrap">
            <Link href="/legal/privacy" className="hover:text-[var(--color-foreground)]">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-[var(--color-foreground)]">
              Terms
            </Link>
            <Link href="/legal/cookies" className="hover:text-[var(--color-foreground)]">
              Cookies
            </Link>
          </Stack>
        </div>
      </Container>
    </footer>
  );
}

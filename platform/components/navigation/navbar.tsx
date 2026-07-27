/**
 * @file Navbar — horizontal primary navigation bar for desktop storefront header.
 * Renders a list of NavLink items with optional trailing slot.
 */

import * as React from "react";

import { NavLink, type NavLinkProps } from "@/components/navigation/nav-link";
import { cn } from "@/lib/utils";

export interface NavItem extends Omit<NavLinkProps, "children"> {
  label: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items. */
  items: NavItem[];
  /** Optional trailing content (promo badge, CTA). */
  trailing?: React.ReactNode;
  /** aria-label for the nav landmark. */
  label?: string;
}

export function Navbar({ className, items, trailing, label = "Primary", ...props }: NavbarProps) {
  return (
    <nav aria-label={label} className={cn("flex items-center gap-6", className)} {...props}>
      <ul className="flex flex-wrap items-center gap-5">
        {items.map((item) => {
          const { label: itemLabel, ...linkProps } = item;
          return (
            <li key={item.href}>
              <NavLink {...linkProps}>{itemLabel}</NavLink>
            </li>
          );
        })}
      </ul>
      {trailing ? <div className="ml-auto pl-4">{trailing}</div> : null}
    </nav>
  );
}

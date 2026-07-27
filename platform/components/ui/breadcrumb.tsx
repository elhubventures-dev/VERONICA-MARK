/**
 * VERONICA MARK Breadcrumb.
 *
 * Purpose: Hierarchical navigation trail for current page location.
 * A11y: nav with aria-label; current page marked aria-current="page".
 * Usage: `<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink /></BreadcrumbItem></BreadcrumbList></Breadcrumb>`.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "transition-colors hover:text-[var(--color-foreground)] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-[var(--color-foreground)]", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

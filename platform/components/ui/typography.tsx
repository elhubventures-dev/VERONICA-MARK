/**
 * VERONICA MARK Typography primitives.
 *
 * Purpose: Consistent text hierarchy using brand fonts (Playfair, Inter, Manrope).
 * A11y: Semantic heading levels via `as` prop; links use visible focus rings.
 * Usage: `<Heading as="h2">Title</Heading>`, `<Text>Body copy</Text>`.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  asChild?: boolean;
}

const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ as: Tag = "h1", asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    return (
      <Comp
        ref={ref}
        className={cn(
          "font-display text-5xl font-semibold tracking-tight text-[var(--color-foreground)] md:text-6xl",
          className,
        )}
        {...props}
      />
    );
  },
);
Display.displayName = "Display";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h2", asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    return (
      <Comp
        ref={ref}
        className={cn(
          "font-display text-3xl font-semibold tracking-tight text-[var(--color-foreground)] md:text-4xl",
          className,
        )}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

const Text = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "font-sans text-base leading-relaxed text-[var(--color-foreground)]",
        className,
      )}
      {...props}
    />
  ),
);
Text.displayName = "Text";

const Lead = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "font-sans text-lg leading-relaxed text-[var(--color-foreground)] md:text-xl",
        className,
      )}
      {...props}
    />
  ),
);
Lead.displayName = "Lead";

const Muted = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("font-sans text-sm text-[var(--color-muted-foreground)]", className)}
      {...props}
    />
  ),
);
Muted.displayName = "Muted";

const Caption = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("font-sans text-xs text-[var(--color-muted-foreground)]", className)}
      {...props}
    />
  ),
);
Caption.displayName = "Caption";

const Code = React.forwardRef<HTMLElement, React.ComponentProps<"code">>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "rounded-lg bg-[var(--color-muted)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-foreground)]",
        className,
      )}
      {...props}
    />
  ),
);
Code.displayName = "Code";

const Blockquote = React.forwardRef<HTMLQuoteElement, React.ComponentProps<"blockquote">>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        "border-l-4 border-[var(--color-accent)] pl-4 font-display text-lg italic text-[var(--color-foreground)]",
        className,
      )}
      {...props}
    />
  ),
);
Blockquote.displayName = "Blockquote";

const Overline = React.forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "font-alt text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]",
        className,
      )}
      {...props}
    />
  ),
);
Overline.displayName = "Overline";

export interface ListProps extends React.ComponentPropsWithoutRef<"ul"> {
  ordered?: boolean;
}

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, ordered = false, ...props }, ref) => {
    const classes = cn(
      "my-4 ml-6 list-disc space-y-2 font-sans text-[var(--color-foreground)] [&>li]:leading-relaxed",
      ordered && "list-decimal",
      className,
    );
    if (ordered) {
      return <ol ref={ref as React.Ref<HTMLOListElement>} className={classes} {...props} />;
    }
    return <ul ref={ref as React.Ref<HTMLUListElement>} className={classes} {...props} />;
  },
);
List.displayName = "List";

const ListItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("pl-1", className)} {...props} />
  ),
);
ListItem.displayName = "ListItem";

const LinkText = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "font-sans text-[var(--color-primary)] underline-offset-4 transition-colors hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
});
LinkText.displayName = "LinkText";

export {
  Display,
  Heading,
  Text,
  Lead,
  Muted,
  Caption,
  Code,
  Blockquote,
  List,
  ListItem,
  Overline,
  LinkText,
};

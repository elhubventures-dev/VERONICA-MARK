/**
 * VERONICA MARK VisuallyHidden.
 *
 * Purpose: Hide content visually while keeping it available to screen readers.
 * A11y: Standard sr-only pattern for supplementary accessible labels.
 * Usage: `<VisuallyHidden>Close dialog</VisuallyHidden>`.
 */
import * as React from "react";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";

const VisuallyHidden = React.forwardRef<
  React.ElementRef<typeof VisuallyHiddenPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>
>((props, ref) => <VisuallyHiddenPrimitive.Root ref={ref} {...props} />);
VisuallyHidden.displayName = VisuallyHiddenPrimitive.Root.displayName;

export { VisuallyHidden };

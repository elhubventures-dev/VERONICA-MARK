/**
 * VERONICA MARK Collapsible (Radix).
 *
 * Purpose: Show or hide a section of content with a trigger.
 * A11y: Trigger toggles aria-expanded; content region linked via id.
 * Usage: `<Collapsible><CollapsibleTrigger /><CollapsibleContent /></Collapsible>`.
 */
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

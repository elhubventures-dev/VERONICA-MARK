/**
 * VERONICA MARK AspectRatio (Radix).
 *
 * Purpose: Maintain consistent width-to-height ratio for media.
 * A11y: Pass alt text on child images; decorative media use aria-hidden.
 * Usage: `<AspectRatio ratio={16 / 9}><img src="..." alt="" /></AspectRatio>`.
 */
"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };

import { type Transition, type Variants } from "framer-motion";

/** Shared easing curve for luxury micro-interactions. */
export const luxuryEase: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Default fade-up animation variants respecting reduced motion at call site. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/** WCAG AA focus ring utility classes used across the design system. */
export const focusRingClass =
  "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:outline-none";

/** Standard transition when motion is allowed. */
export const motionTransition = (reduceMotion: boolean | null, duration = 0.35): Transition =>
  reduceMotion ? { duration: 0 } : { duration, ease: luxuryEase };

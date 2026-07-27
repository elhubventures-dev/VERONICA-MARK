import { type Transition, type Variants } from "framer-motion";

/** Shared easing curve for luxury micro-interactions. */
export const luxuryEase: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Default fade-up animation variants respecting reduced motion at call site. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/** Stagger delay (seconds) for sequential card/grid reveals. */
export const staggerDelay = (index: number, step = 0.06): number => index * step;

/** WCAG AA focus ring utility classes used across the design system. */
export const focusRingClass =
  "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:outline-none";

const ctaTransition =
  "transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]";

/** Ghost/outline CTA used on dark editorial media (uppercase tracking). */
export const editorialCtaClass = `inline-flex min-h-11 items-center border border-[var(--color-accent)] bg-transparent px-7 text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase ${ctaTransition} hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] ${focusRingClass}`;

/** Filled gold CTA — heroes and dark bands. */
export const accentFillCtaClass = `inline-flex min-h-11 items-center justify-center bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] ${ctaTransition} hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)] ${focusRingClass}`;

/** Outline CTA on dark photography / brand-deep bands. */
export const ghostOnDarkCtaClass = `inline-flex min-h-11 items-center justify-center border border-[color-mix(in_srgb,var(--color-accent)_55%,white)] px-7 text-sm font-semibold text-white ${ctaTransition} hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)] ${focusRingClass}`;

/** Filled brand-deep CTA on light surfaces. */
export const brandFillCtaClass = `inline-flex min-h-11 items-center justify-center bg-[var(--color-brand-deep)] px-7 text-sm font-semibold text-white ${ctaTransition} hover:bg-[color-mix(in_srgb,var(--color-brand-deep)_88%,black)] ${focusRingClass}`;

/** Neutral outline CTA on light surfaces. */
export const outlineCtaClass = `inline-flex min-h-11 items-center justify-center border border-[var(--color-border)] px-7 text-sm font-semibold ${ctaTransition} hover:bg-[var(--color-muted)] ${focusRingClass}`;

/** Standard transition when motion is allowed. */
export const motionTransition = (reduceMotion: boolean | null, duration = 0.35): Transition =>
  reduceMotion ? { duration: 0 } : { duration, ease: luxuryEase };

import { cn } from "@/lib/utils";

/**
 * Hero-strength overlays so white/gold copy stays readable over photography.
 * Inline gradients (not Tailwind arbitrary classes) so color-mix always paints.
 */
export type MediaScrimVariant = "left" | "right" | "bottom" | "center";

const SCRIMS: Record<MediaScrimVariant, string> = {
  left: "linear-gradient(90deg, color-mix(in srgb, var(--color-brand-deep) 94%, transparent) 0%, color-mix(in srgb, var(--color-brand-field) 72%, transparent) 46%, transparent 100%)",
  right:
    "linear-gradient(270deg, color-mix(in srgb, var(--color-brand-deep) 94%, transparent) 0%, color-mix(in srgb, var(--color-brand-field) 72%, transparent) 46%, transparent 100%)",
  bottom:
    "linear-gradient(to top, color-mix(in srgb, var(--color-brand-deep) 96%, transparent) 0%, color-mix(in srgb, var(--color-brand-deep) 78%, transparent) 28%, color-mix(in srgb, var(--color-brand-field) 45%, transparent) 58%, transparent 100%)",
  center:
    "linear-gradient(180deg, color-mix(in srgb, var(--color-brand-deep) 82%, transparent) 0%, color-mix(in srgb, var(--color-brand-field) 76%, transparent) 45%, color-mix(in srgb, var(--color-brand-deep) 86%, transparent) 100%)",
};

type MediaScrimProps = {
  variant?: MediaScrimVariant;
  /** Soft gold highlight (same as hero) */
  withAccent?: boolean;
  className?: string;
};

export function MediaScrim({ variant = "left", withAccent = true, className }: MediaScrimProps) {
  return (
    <>
      <div
        aria-hidden
        className={cn("absolute inset-0", className)}
        style={{ background: SCRIMS[variant] }}
      />
      {withAccent ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 22%, color-mix(in srgb, var(--color-accent-bright) 18%, transparent), transparent 32%)",
          }}
        />
      ) : null}
    </>
  );
}

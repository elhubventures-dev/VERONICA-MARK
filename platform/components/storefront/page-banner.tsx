import Image from "next/image";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { cn } from "@/lib/utils";

type PageBannerProps = {
  src: string;
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  /** Shorter banner for checkout / nested flows */
  compact?: boolean;
  priority?: boolean;
  /** Centered copy (default) — avoids content hanging on one side */
  align?: "center" | "left";
};

/**
 * Full-bleed editorial page banner — same gradient treatment as About / Contact heroes.
 */
export function PageBanner({
  src,
  title,
  eyebrow,
  description,
  className,
  compact = false,
  priority = false,
  align = "center",
}: PageBannerProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "relative isolate flex overflow-hidden bg-[var(--color-brand-deep)] text-white",
        centered ? "items-center justify-center" : "items-end",
        compact ? "min-h-[220px] sm:min-h-[280px]" : "min-h-[42svh] sm:min-h-[48svh]",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <MediaScrim variant={centered ? "center" : "left"} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-brand-deep) 72%, transparent) 0%, transparent 55%)",
        }}
      />
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12",
          compact
            ? centered
              ? "py-14"
              : "pb-10 pt-20"
            : centered
              ? "py-20 sm:py-24"
              : "pb-14 pt-28 sm:pb-16",
          centered && "text-center",
        )}
      >
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "font-display text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)]",
            compact ? "mt-3 text-3xl sm:text-4xl" : "mt-4 text-4xl sm:text-6xl",
            centered ? "mx-auto max-w-4xl" : "max-w-3xl",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-4 text-base leading-7 text-white/90 sm:text-lg",
              centered ? "mx-auto max-w-2xl" : "max-w-2xl",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}

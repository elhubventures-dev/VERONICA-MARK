import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string | null;
  /** icon = purple tile; monogram = gold on dark; lockup = full brand */
  variant?: "icon" | "monogram" | "lockup";
  /** Show wordmark text beside the mark (icon/monogram only) */
  withWordmark?: boolean;
  className?: string;
  priority?: boolean;
  size?: number;
};

const SRC = {
  icon: "/brand/vm-icon-512.webp",
  monogram: "/brand/vm-monogram-512.webp",
  lockup: "/brand/vm-lockup-1024.webp",
} as const;

export function BrandMark({
  href = "/",
  variant = "icon",
  withWordmark = false,
  className,
  priority = false,
  size = 36,
}: BrandMarkProps) {
  const imgW = variant === "lockup" ? Math.round(size * 2.4) : size;
  const imgH = variant === "lockup" ? Math.round(size * 2.4) : size;

  const mark = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={SRC[variant]}
        alt={withWordmark ? "" : "VERONICA MARK"}
        width={imgW}
        height={imgH}
        className="shrink-0 object-contain"
        priority={priority}
        // Already WebP at display size — skip Vercel Image Optimization quota.
        unoptimized
      />
      {withWordmark && variant !== "lockup" ? (
        <span className="font-display text-lg tracking-[0.14em] text-current sm:text-xl">
          VERONICA MARK
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-opacity hover:opacity-90"
      aria-label="VERONICA MARK home"
    >
      {mark}
    </Link>
  );
}

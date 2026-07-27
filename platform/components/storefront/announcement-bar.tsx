"use client";

import { Flame, Gift, Sparkles, Tag, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const MESSAGE = "20% off · Code VM5AUG-20 · August Grand Opening";
const COPIES = 8;
const SPEED_PX_PER_SEC = 55;

const SEPARATORS: LucideIcon[] = [Zap, Sparkles, Tag, Flame, Gift];

function TickerSegment() {
  return (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: COPIES }, (_, i) => {
        const Icon = SEPARATORS[i % SEPARATORS.length];
        return (
          <span key={i} className="inline-flex shrink-0 items-center gap-5 px-8 whitespace-nowrap">
            <span>{MESSAGE}</span>
            <Icon className="size-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={2} />
          </span>
        );
      })}
    </span>
  );
}

export function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root) return;

    let raf = 0;
    let offset = 0;
    let last = performance.now();
    let paused = false;

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
      last = performance.now();
    };

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;

      if (!paused) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          offset = (offset + SPEED_PX_PER_SEC * dt) % halfWidth;
          track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("mouseenter", pause);
      root.removeEventListener("mouseleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", resume);
    };
  }, []);

  return (
    <Link
      ref={rootRef}
      href="/flash-sale"
      className="relative block h-10 overflow-hidden bg-[var(--color-brand-deep)] text-xs font-semibold tracking-[0.16em] text-white uppercase focus-visible:outline-offset-[-2px]"
      aria-label={MESSAGE}
    >
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex h-10 w-max items-center will-change-transform"
        aria-hidden="true"
      >
        <TickerSegment />
        <TickerSegment />
      </div>
    </Link>
  );
}

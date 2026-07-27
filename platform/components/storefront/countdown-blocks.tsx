"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { luxuryEase, motionTransition, staggerDelay } from "@/lib/motion";

export type CountdownUnit = {
  label: string;
  value: number;
};

type Size = "sm" | "md" | "lg";

const boxClass: Record<Size, string> = {
  sm: "min-w-[4.25rem] px-2.5 py-2.5",
  md: "min-w-[4.5rem] px-3 py-3",
  lg: "min-w-[4.75rem] px-3 py-3 sm:min-w-[5.25rem] sm:px-4 sm:py-3.5",
};

const valueClass: Record<Size, string> = {
  sm: "font-display text-xl tabular-nums sm:text-2xl",
  md: "font-display text-2xl tabular-nums",
  lg: "font-display text-2xl tabular-nums sm:text-3xl",
};

const boxStyle: React.CSSProperties = {
  backgroundColor: "#c7a25a",
  color: "#3a013c",
  borderColor: "#3a013c",
};

function FlipValue({ value, size }: { value: number; size: Size }) {
  const reduceMotion = useReducedMotion();
  const display = String(value).padStart(2, "0");

  if (reduceMotion) {
    return <div className={valueClass[size]}>{display}</div>;
  }

  return (
    <div className={`relative overflow-hidden leading-none ${valueClass[size]}`}>
      {/* Reserve height so the box doesn't collapse during exit/enter */}
      <span className="invisible block" aria-hidden>
        00
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={display}
          className="absolute inset-x-0 top-0 block"
          initial={{ y: "55%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-55%", opacity: 0 }}
          transition={{ duration: 0.38, ease: luxuryEase }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

type CountdownBlocksProps = {
  units: readonly CountdownUnit[];
  size?: Size;
  className?: string;
  /** Stagger + fade blocks in on first paint. */
  animateEntrance?: boolean;
};

export function CountdownBlocks({
  units,
  size = "md",
  className = "flex flex-wrap gap-3",
  animateEntrance = true,
}: CountdownBlocksProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className} aria-label="Time remaining" aria-live="polite">
      {units.map(({ label, value }, index) => (
        <motion.div
          key={label}
          className={`border text-center ${boxClass[size]}`}
          style={boxStyle}
          initial={
            animateEntrance && !reduceMotion ? { opacity: 0, y: 10, scale: 0.96 } : false
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ...motionTransition(reduceMotion, 0.45),
            delay: reduceMotion || !animateEntrance ? 0 : staggerDelay(index, 0.05),
          }}
        >
          <FlipValue value={value} size={size} />
          <div className="mt-1 text-[10px] tracking-[0.16em] uppercase opacity-80">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}

/** Map remaining time into the four standard units. */
export function flashSaleCountdownUnits(time: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): CountdownUnit[] {
  return [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];
}

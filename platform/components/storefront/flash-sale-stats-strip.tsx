"use client";

import { motion, useReducedMotion } from "framer-motion";

import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  value: string;
};

type FlashSaleStatsStripProps = {
  stats: StatItem[];
  className?: string;
};

export function FlashSaleStatsStrip({ stats, className }: FlashSaleStatsStripProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "border-t border-[var(--color-border)] bg-[var(--color-brand-deep)] py-2 text-white",
        className,
      )}
    >
      <div className="mx-auto grid max-w-[1440px] gap-3 px-5 py-5 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              ...motionTransition(reduceMotion, 0.45),
              delay: reduceMotion ? 0 : index * 0.08,
            }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -10,
                    scale: 1.05,
                    transition: motionTransition(reduceMotion, 0.22),
                  }
            }
            className="group relative z-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] will-change-transform hover:z-10 hover:border-[color-mix(in_srgb,var(--color-accent)_50%,transparent)] hover:bg-white/10 hover:shadow-[0_20px_44px_rgba(0,0,0,0.32)]"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--color-accent) 26%, transparent), transparent 55%)",
              }}
            />

            <p className="relative text-[0.68rem] tracking-[0.22em] text-white/65 uppercase">
              {stat.label}
            </p>
            <motion.p
              className="relative mt-2 text-2xl font-semibold text-[var(--color-accent)]"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      textShadow: [
                        "0 0 0 rgba(199,162,90,0)",
                        "0 0 18px rgba(199,162,90,0.35)",
                        "0 0 0 rgba(199,162,90,0)",
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 2.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: index * 0.25,
                    }
              }
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { motionTransition } from "@/lib/motion";

type BrandPageHeroProps = {
  name: string;
  description: string;
  image: string;
};

export function BrandPageHero({ name, description, image }: BrandPageHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-[1440px] px-5 pt-12 sm:px-8">
      <div className="relative isolate h-48 overflow-hidden rounded-xl bg-[var(--color-brand-deep)] md:h-64">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-20"
          initial={reduceMotion ? false : { scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={motionTransition(reduceMotion, 1.15)}
        >
          <Image src={image} alt="" fill className="object-cover" sizes="100vw" priority />
        </motion.div>
        <MediaScrim variant="left" />
        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase">Maison</p>
          <h1 className="font-display text-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] md:text-4xl">
            {name}
          </h1>
        </div>
      </div>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition(reduceMotion, 0.5)}
        className="mt-4 max-w-2xl text-[var(--color-muted-foreground)]"
      >
        {description}
      </motion.p>
    </div>
  );
}

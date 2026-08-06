"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MediaScrim } from "@/components/storefront/media-scrim";
import { accentFillCtaClass, ghostOnDarkCtaClass, luxuryEase, motionTransition } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";

/** Curated full-bleed hero photography from the design asset library. */
const HERO_SLIDES = [
  siteMedia.homepageHeroBanner,
  siteMedia.luxuryPerfumeCollection,
  siteMedia.luxuryLifestyleBanner,
  siteMedia.perfumeShelfDisplay,
  siteMedia.featuredCollectionBanner,
] as const;

const SLIDE_MS = 5000;
const FADE_S = 1.2;

export function HeroBanner() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || HERO_SLIDES.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const activeIndex = reduceMotion ? 0 : index;

  // Only mount active + neighbors so idle slides never hit the optimizer.
  const mountedIndexes = useMemo(() => {
    if (reduceMotion || HERO_SLIDES.length < 2) return [0];
    const len = HERO_SLIDES.length;
    const next = (activeIndex + 1) % len;
    const prev = (activeIndex + len - 1) % len;
    return Array.from(new Set([activeIndex, next, prev]));
  }, [activeIndex, reduceMotion]);

  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-[var(--color-brand-deep)] text-white">
      <div
        aria-hidden
        className="vm-ambient-orb absolute top-24 left-[-8rem] -z-10 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="vm-ambient-orb absolute right-[-5rem] bottom-20 -z-10 h-64 w-64 rounded-full bg-[color-mix(in_srgb,white_12%,transparent)] blur-3xl"
      />

      <div className="absolute inset-0 -z-20" aria-hidden>
        {mountedIndexes.map((slideIndex) => {
          const src = HERO_SLIDES[slideIndex];
          if (!src) return null;
          const isActive = slideIndex === activeIndex;
          return (
            <motion.div
              key={src}
              initial={false}
              animate={
                reduceMotion
                  ? { opacity: isActive ? 1 : 0, scale: 1 }
                  : {
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 1.035,
                    }
              }
              transition={{ duration: reduceMotion ? 0 : FADE_S, ease: luxuryEase }}
              className="absolute inset-0"
              style={{ zIndex: isActive ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={slideIndex === 0}
                fetchPriority={slideIndex === 0 ? "high" : "auto"}
                quality={70}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          );
        })}
      </div>

      <MediaScrim variant="left" />

      {/*
        LCP text stays visible immediately (no opacity:0). Motion only shifts
        supporting copy/CTAs so Core Web Vitals are not delayed by Framer.
      */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pt-28 pb-16 sm:px-8 sm:pb-24 lg:px-12">
        <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-[var(--color-accent)] uppercase">
          VERONICA MARK
        </p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-7xl lg:text-8xl">
          Curated for the Exceptional.
        </h1>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransition(reduceMotion, 0.55)}
        >
          <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            Discover carefully selected luxury perfumes, fashion, accessories and lifestyle products
            from trusted brands around the world.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/categories/perfumes" className={accentFillCtaClass}>
              Explore the collection
            </Link>
            <Link href="/about" className={ghostOnDarkCtaClass}>
              Our story
            </Link>
          </div>
        </motion.div>
        <motion.div
          aria-hidden
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionTransition(reduceMotion, 0.7), delay: reduceMotion ? 0 : 0.2 }}
          className="mt-14 flex items-center gap-4 text-[10px] font-semibold tracking-[0.28em] text-white/75 uppercase"
        >
          <span className="h-px w-12 bg-[var(--color-accent)]" />
          Explore the house
        </motion.div>
      </div>
    </section>
  );
}

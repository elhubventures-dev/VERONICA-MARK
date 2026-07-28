"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { focusRingClass, luxuryEase } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";

const primaryCtaClass = `inline-flex min-h-12 items-center justify-center rounded-full bg-[#4B246A] px-9 py-4 text-sm font-medium text-[#F8F4EC] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(75,36,106,0.35)] ${focusRingClass}`;
const secondaryCtaClass = `inline-flex min-h-12 items-center justify-center rounded-full border border-[#4B246A] px-9 py-4 text-sm font-medium text-[#4B246A] transition-all duration-500 hover:bg-[#4B246A] hover:text-[#F8F4EC] ${focusRingClass}`;

export function HeroPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F8F4EC]">
      <motion.div
        initial={reduceMotion ? false : { scale: 1 }}
        animate={reduceMotion ? undefined : { scale: 1.06 }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 28,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }
        }
        className="absolute inset-0"
      >
        <Image
          src={siteMedia.homepageHeroBanner}
          alt="VERONICA MARK luxury hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#F8F4EC]/96 via-[#F8F4EC]/80 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] items-center px-6 py-24 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex w-full flex-col justify-center lg:w-2/5">
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="mb-6 text-xs font-medium tracking-[0.45em] text-[#4B246A] uppercase md:text-sm"
          >
            Welcome To
          </motion.span>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: luxuryEase }}
            className="font-display text-2xl tracking-[0.3em] text-[#4B246A] uppercase md:text-3xl"
          >
            VERONICA MARK
          </motion.h2>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: luxuryEase }}
            className="mt-6 max-w-xl font-display text-5xl leading-[1.05] text-[#1A1A1A] md:text-7xl xl:text-[88px]"
          >
            Curated for the Exceptional.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: luxuryEase }}
            className="mt-8 max-w-lg text-lg leading-8 text-[#555]"
          >
            Discover a world of carefully selected luxury perfumes, fashion, handbags,
            jewellery and accessories from trusted brands around the globe.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.7, ease: luxuryEase }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <Link href="/shop" className={primaryCtaClass}>
              Explore Collection
            </Link>
            <Link href="/about" className={secondaryCtaClass}>
              Discover Our Story
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6, ease: luxuryEase }}
            className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-[#555] lg:mt-20"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg text-[#C7A25A]">★★★★★</span>
            </div>
            <span className="hidden h-5 w-px bg-[#D8D1C7] sm:block" />
            <span>Trusted Worldwide</span>
            <span className="hidden h-5 w-px bg-[#D8D1C7] sm:block" />
            <span>100% Authentic Luxury</span>
            <span className="hidden h-5 w-px bg-[#D8D1C7] sm:block" />
            <span>Worldwide Delivery</span>
            <span className="hidden h-5 w-px bg-[#D8D1C7] sm:block" />
            <span>Secure Checkout</span>
          </motion.div>
        </div>

        <div className="hidden w-3/5 justify-end lg:flex">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
            }
            className="relative h-[720px] w-[820px]"
          />
        </div>
      </div>

      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.25, 0.45, 0.25] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-28 right-16 h-56 w-56 rounded-full bg-[#C7A25A]/10 blur-[120px] sm:right-24 xl:right-40"
      />

      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.18, 0.35, 0.18] }}
        transition={reduceMotion ? undefined : { duration: 7, repeat: Number.POSITIVE_INFINITY }}
        className="absolute right-10 bottom-16 h-72 w-72 rounded-full bg-[#4B246A]/10 blur-[140px] sm:right-16 xl:right-20 xl:h-80 xl:w-80"
      />
    </section>
  );
}

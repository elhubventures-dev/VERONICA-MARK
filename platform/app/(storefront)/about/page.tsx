import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AboutHero } from "@/components/storefront/about-hero";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteMedia } from "@/lib/storefront/site-media";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Founded in Nigeria by Pastor Veronica Mbalaso, VERONICA MARK curates authentic luxury for discerning customers worldwide. Curated for the Exceptional.",
  path: "/about",
});

const pillars = [
  {
    title: "Exceptional Curation",
    body: "We select with purpose — fewer, finer pieces chosen for craftsmanship, originality and lasting presence.",
  },
  {
    title: "Authentic Products",
    body: "Every product is thoughtfully sourced from trusted brands so you can purchase with confidence.",
  },
  {
    title: "Premium Experience",
    body: "From discovery to delivery, every interaction is designed to feel effortless, elegant and trustworthy.",
  },
  {
    title: "Lasting Relationships",
    body: "We build enduring relationships with clients and brand partners through integrity and devoted service.",
  },
] as const;

export default function AboutPage() {
  return (
    <article className="bg-[var(--color-background)]">
      <AboutHero />

      <section id="our-story" className="scroll-mt-24 border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 lg:py-24">
          <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
            Our story
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl lg:text-5xl">
            Luxury, thoughtfully selected.
          </h2>
          <div className="mt-8 space-y-4 text-left text-base leading-8 text-[var(--color-muted-foreground)] sm:text-center">
            <p>
              Founded in Nigeria by Pastor Veronica Mbalaso, VERONICA MARK bridges discerning
              customers with carefully curated luxury products from around the world.
            </p>
            <p>
              Rather than endless listings, we believe luxury should be thoughtfully selected,
              authentically sourced, and presented with exceptional attention to detail.
            </p>
            <p>
              Beginning with premium fragrances and expanding into fashion, accessories, beauty,
              watches and lifestyle, we aim to become one of Africa&apos;s most respected luxury
              commerce brands — while serving customers worldwide.
            </p>
          </div>
        </div>

        <div className="relative isolate mx-auto flex min-h-[320px] max-w-[1440px] items-center justify-center overflow-hidden bg-[var(--color-brand-deep)] sm:min-h-[420px]">
          <Image
            src={siteMedia.luxuryLifestyleBanner}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <MediaScrim variant="center" />
          <p className="relative mx-auto max-w-4xl px-5 py-16 text-center font-display text-2xl text-white drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:px-8 sm:text-3xl lg:py-20 lg:text-4xl">
            Luxury as a way of living — considered, confident, exceptional.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-muted)_55%,var(--color-background))]">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 text-center sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Mission
            </p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl">Why we exist</h2>
            <p className="mx-auto mt-5 max-w-md leading-8 text-[var(--color-muted-foreground)]">
              To curate exceptional luxury products and deliver an elevated shopping experience built
              on authenticity, trust, elegance and world-class service.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Vision
            </p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl">Where we are going</h2>
            <p className="mx-auto mt-5 max-w-md leading-8 text-[var(--color-muted-foreground)]">
              To become Africa&apos;s leading global luxury marketplace, recognized for exceptional
              curation, uncompromising quality and an unforgettable customer experience.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Brand pillars
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">
              What guides every selection.
            </h2>
          </div>
          <ul className="mt-12 grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {pillars.map((pillar, index) => (
              <li key={pillar.title} className="border-t border-[var(--color-border)] pt-6">
                <span className="font-display text-sm tracking-[0.14em] text-[var(--color-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium tracking-wide">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative isolate min-h-[420px] overflow-hidden bg-[var(--color-brand-deep)] text-white sm:min-h-[520px]">
        <Image
          src={siteMedia.perfumeShelfDisplay}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <MediaScrim variant="center" />
        <div className="relative mx-auto flex min-h-[420px] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[520px] sm:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
            Our promise
          </p>
          <blockquote className="mt-6 font-display text-3xl leading-snug text-balance drop-shadow-[0_2px_18px_rgba(0,0,0,.45)] sm:text-4xl lg:text-5xl">
            Every product. Every interaction. Every experience — Curated for the Exceptional.
          </blockquote>
          <div className="mt-8 max-w-2xl space-y-4 text-base leading-8 text-white/90">
            <p>
              We believe luxury is more than a product — it is an experience. It is found in
              thoughtful choices, exceptional craftsmanship, and genuine attention to detail.
            </p>
            <p>
              Proudly founded in Nigeria and serving customers around the world, VERONICA MARK
              celebrates quality without compromise and elegance without excess.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-brand-deep)] text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-5 py-14 text-center sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              Begin your edit
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Discover the collection curated for you.
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center justify-center bg-[var(--color-accent)] px-7 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white)]"
            >
              Explore the collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center border border-[color-mix(in_srgb,var(--color-accent)_55%,white)] px-7 text-sm font-semibold text-white transition-colors hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]"
            >
              Speak with us
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FoundationHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-svh overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-primary)_28%,transparent),transparent_42%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-accent)_24%,transparent),transparent_40%),linear-gradient(160deg,var(--color-secondary),var(--color-background)_55%,color-mix(in_srgb,var(--color-primary)_8%,var(--color-background)))]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-neutral)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.07]"
      />

      <div className="mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-center px-6 py-16 md:px-10 lg:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Badge variant="accent" className="mb-6">
            Stage 1 Foundation
          </Badge>
          <p className="font-display text-5xl tracking-tight text-[var(--color-primary)] md:text-7xl">
            VERONICA MARK
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-[var(--color-neutral)] md:text-5xl">
            Luxury managed-brand commerce, engineered for enterprise scale.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-muted-foreground)] md:text-lg">
            Platform foundation is live: Next.js 15, Prisma, Auth.js, design tokens, CI/CD, and
            layered architecture for the perfume marketplace launch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/api/health">Health Check</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </motion.div>

        <motion.ul
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid max-w-4xl gap-4 text-sm text-[var(--color-muted-foreground)] sm:grid-cols-3"
        >
          <li className="border-t border-[var(--color-border)] pt-4">
            Neon PostgreSQL + Prisma schema Parts I–IV
          </li>
          <li className="border-t border-[var(--color-border)] pt-4">
            Auth.js sessions with coarse RBAC middleware
          </li>
          <li className="border-t border-[var(--color-border)] pt-4">
            Design system tokens: purple, cream, gold
          </li>
        </motion.ul>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import * as React from "react";

import { Reveal } from "@/components/storefront/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brandFillCtaClass, outlineCtaClass, staggerDelay } from "@/lib/motion";
import { faqCategories } from "@/lib/storefront/faq-content";
import { cn } from "@/lib/utils";

export function FaqContent() {
  const [active, setActive] = React.useState(faqCategories[0]?.id ?? "");

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
      <div className="page-split">
        <Reveal className="page-split__nav border-b border-[var(--color-border)] bg-[var(--color-background)] pb-8 md:border-b-0 md:pb-0">
          <aside>
            <nav aria-label="FAQ topics">
              <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase md:mb-5">
                Topics
              </p>
              <ul className="flex flex-col gap-2">
                {faqCategories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#faq-${category.id}`}
                      onClick={() => setActive(category.id)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-start border px-4 text-left text-sm font-medium transition-colors",
                        active === category.id
                          ? "border-[var(--color-brand-deep)] bg-[var(--color-brand-deep)] text-white"
                          : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-brand-deep)] hover:bg-[color-mix(in_srgb,var(--color-brand-deep)_6%,transparent)]",
                      )}
                    >
                      {category.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </Reveal>

        <div className="page-split__main space-y-16">
          {faqCategories.map((category, index) => (
            <Reveal key={category.id} delay={staggerDelay(index, 0.04)}>
              <section
                id={`faq-${category.id}`}
                className="scroll-mt-28"
                onFocusCapture={() => setActive(category.id)}
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl">{category.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted-foreground)]">
                    {category.description}
                  </p>
                </div>

                <Accordion type="single" collapsible className="mt-8 text-left">
                  {category.items.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-7">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </Reveal>
          ))}

          <Reveal className="border-t border-[var(--color-border)] pt-12">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Still need help?
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Our client services team is ready to assist.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--color-muted-foreground)]">
              Write to us for order support, fragrance advice, or anything not covered here.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className={brandFillCtaClass}>
                Contact us
              </Link>
              <Link href="/track-order" className={outlineCtaClass}>
                Track an order
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

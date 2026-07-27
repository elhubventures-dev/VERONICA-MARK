"use client";

import Link from "next/link";
import * as React from "react";

import { PageBanner } from "@/components/storefront/page-banner";
import { Reveal } from "@/components/storefront/reveal";
import { brandFillCtaClass } from "@/lib/motion";
import { storefrontContact } from "@/lib/storefront/contact";
import type { LegalSection } from "@/lib/storefront/legal-content";
import { LEGAL_LAST_UPDATED } from "@/lib/storefront/legal-content";
import { siteMedia } from "@/lib/storefront/site-media";
import { cn } from "@/lib/utils";

type LegalDocumentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  relatedHref: "/terms" | "/privacy";
  relatedLabel: string;
};

export function LegalDocumentPage({
  eyebrow,
  title,
  description,
  sections,
  relatedHref,
  relatedLabel,
}: LegalDocumentPageProps) {
  const [active, setActive] = React.useState(sections[0]?.id ?? "");

  return (
    <article className="bg-[var(--color-background)]">
      <PageBanner
        src={siteMedia.luxuryLifestyleBanner}
        eyebrow={eyebrow}
        title={title}
        description={description}
        compact
        priority
      />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="mb-10 text-xs font-semibold tracking-[0.18em] text-[var(--color-muted-foreground)] uppercase">
          Last updated · {LEGAL_LAST_UPDATED}
        </p>

        <div className="page-split">
          <aside className="page-split__nav border-b border-[var(--color-border)] bg-[var(--color-background)] pb-8 md:border-b-0 md:pb-0">
            <nav aria-label="On this page">
              <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase md:mb-5">
                On this page
              </p>
              <ul className="flex flex-col gap-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={() => setActive(section.id)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-start border px-4 text-left text-sm font-medium transition-colors",
                        active === section.id
                          ? "border-[var(--color-brand-deep)] bg-[var(--color-brand-deep)] text-white"
                          : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-brand-deep)] hover:bg-[color-mix(in_srgb,var(--color-brand-deep)_6%,transparent)]",
                      )}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-2 border-t border-[var(--color-border)] pt-6 text-sm">
                <Link
                  href={relatedHref}
                  className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
                >
                  {relatedLabel}
                </Link>
                <Link
                  href="/faq"
                  className="text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-primary)] hover:underline"
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  className="text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-primary)] hover:underline"
                >
                  Contact
                </Link>
              </div>
            </nav>
          </aside>

          <div className="page-split__main space-y-12">
            {sections.map((section) => (
              <Reveal key={section.id}>
                <section
                  id={section.id}
                  className="scroll-mt-28"
                  onFocusCapture={() => setActive(section.id)}
                >
                  <h2 className="font-display text-2xl sm:text-3xl">{section.title}</h2>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-muted-foreground)] sm:text-base sm:leading-8">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`${section.id}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}

            <Reveal className="border-t border-[var(--color-border)] pt-12">
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-primary)] uppercase">
                Need help?
              </p>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl">Speak with client services</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted-foreground)]">
                Email{" "}
                <a
                  href={`mailto:${storefrontContact.email}`}
                  className="font-medium text-[var(--color-foreground)] underline-offset-2 hover:underline"
                >
                  {storefrontContact.email}
                </a>{" "}
                or visit{" "}
                <a
                  href={storefrontContact.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--color-foreground)] underline-offset-2 hover:underline"
                >
                  {storefrontContact.websiteLabel}
                </a>
                .
              </p>
              <Link href="/contact" className={`mt-6 ${brandFillCtaClass}`}>
                Contact us
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}

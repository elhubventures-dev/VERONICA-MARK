import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Mail, PackageSearch } from "lucide-react";

import { ContactEnquiryForm } from "@/components/storefront/contact-enquiry-form";
import { ContactHero } from "@/components/storefront/contact-hero";
import { ContactOrderForm } from "@/components/storefront/contact-order-form";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { storefrontContact } from "@/lib/storefront/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact VERONICA MARK client services for fragrance advice, orders and delivery support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <article className="bg-[var(--color-background)]">
      <ContactHero />

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:py-16">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Client services
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">Reach the house.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-muted-foreground)]">
              Prefer email or the web? Our team is ready to help with selection, orders and
              delivery.
            </p>
          </div>

          <ul className="mt-12 grid gap-8 border-t border-[var(--color-border)] pt-10 sm:grid-cols-3 sm:gap-6">
            <li className="text-center">
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
                Email
              </p>
              <a
                href={`mailto:${storefrontContact.email}`}
                className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)] sm:text-base"
              >
                <Mail className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                {storefrontContact.email}
              </a>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {storefrontContact.responseNote}
              </p>
            </li>
            <li className="text-center">
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
                Website
              </p>
              <a
                href={storefrontContact.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)] sm:text-base"
              >
                <ExternalLink className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                {storefrontContact.websiteLabel}
              </a>
            </li>
            <li className="text-center">
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted-foreground)] uppercase">
                Orders
              </p>
              <Link
                href="/track-order"
                className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium underline-offset-4 hover:underline sm:text-base"
              >
                <PackageSearch className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                Track an existing order
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section id="write-to-us" className="scroll-mt-24 border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Enquiry
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Write to us</h2>
            <p className="mt-3 mb-10 text-sm leading-7 text-[var(--color-muted-foreground)]">
              Share a few details and we&apos;ll get back to you at {storefrontContact.email}.
            </p>
          </div>
          <ContactEnquiryForm />
        </div>
      </section>

      <section
        id="order-support"
        className="scroll-mt-24 bg-[color-mix(in_srgb,var(--color-muted)_55%,var(--color-background))]"
      >
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Order support
            </p>
            <h2 className="mt-4 font-display text-2xl text-balance sm:text-3xl">
              Need help with an order?
            </h2>
            <p className="mx-auto mt-4 mb-10 max-w-md text-sm leading-7 text-[var(--color-muted-foreground)]">
              Include your order reference and the email used at checkout so we can locate your
              dispatch quickly.
            </p>
          </div>
          <ContactOrderForm />
        </div>
      </section>
    </article>
  );
}

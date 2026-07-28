import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Mail, MapPin, MessageCircle, PackageSearch, Phone } from "lucide-react";

import { ContactEnquiryForm } from "@/components/storefront/contact-enquiry-form";
import { ContactHero } from "@/components/storefront/contact-hero";
import { ContactOrderForm } from "@/components/storefront/contact-order-form";
import { Reveal } from "@/components/storefront/reveal";
import { staggerDelay } from "@/lib/motion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { storefrontContact } from "@/lib/storefront/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact VERONICA MARK client services for fragrance advice, orders and delivery support.",
  path: "/contact",
});

type ContactChannel = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  external?: boolean;
  primary: string;
  secondary?: string;
};
const contactChannels: ContactChannel[] = [
  {
    id: "address",
    label: "Address",
    icon: MapPin,
    href: storefrontContact.mapsUrl,
    external: true,
    primary: storefrontContact.addressLine,
    secondary: "Open in Google Maps",
  },
  {
    id: "phone",
    label: "Phone",
    icon: Phone,
    href: storefrontContact.telUrl,
    primary: storefrontContact.phone,
    secondary: "Tap to call client services",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    href: storefrontContact.whatsappUrl,
    external: true,
    primary: storefrontContact.phone,
    secondary: "Message us on WhatsApp",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    href: `mailto:${storefrontContact.email}`,
    primary: storefrontContact.email,
    secondary: storefrontContact.responseNote,
  },
  {
    id: "website",
    label: "Website",
    icon: ExternalLink,
    href: storefrontContact.websiteUrl,
    external: true,
    primary: storefrontContact.websiteLabel,
    secondary: "Browse the full storefront",
  },
  {
    id: "orders",
    label: "Orders",
    icon: PackageSearch,
    href: "/track-order",
    primary: "Track an existing order",
    secondary: "Use your order reference and email",
  },
];

function ChannelCard({ channel, index }: { channel: ContactChannel; index: number }) {
  const Icon = channel.icon;
  const className =
    "group flex h-full min-h-[12rem] flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-accent)_55%,var(--color-border))] hover:shadow-[var(--shadow-md)]";

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-brand-deep)_8%,var(--color-surface))] text-[var(--color-accent)] ring-1 ring-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-muted-foreground)] uppercase">
          {channel.label}
        </p>
      </div>
      <p className="mt-5 font-display text-lg leading-snug text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-brand-deep)] sm:text-xl">
        {channel.primary}
      </p>
      {channel.secondary ? (
        <p className="mt-auto pt-3 text-sm leading-6 text-[var(--color-muted-foreground)]">
          {channel.secondary}
        </p>
      ) : null}
    </>
  );

  const card =
    channel.external || channel.href.startsWith("mailto:") || channel.href.startsWith("tel:") ? (
      <a
        href={channel.href}
        target={channel.external ? "_blank" : undefined}
        rel={channel.external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    ) : (
      <Link href={channel.href} className={className}>
        {content}
      </Link>
    );

  return (
    <Reveal delay={staggerDelay(index)} className="h-full">
      <li className="h-full list-none">{card}</li>
    </Reveal>
  );
}

export default function ContactPage() {
  return (
    <article className="bg-[var(--color-background)]">
      <ContactHero />

      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-16">
          <Reveal className="text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Client services
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance sm:text-4xl">Reach the house.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-muted-foreground)]">
              Call, WhatsApp, or email — our team is ready to help with selection, orders and
              delivery.
            </p>
          </Reveal>

          <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {contactChannels.map((channel, index) => (
              <ChannelCard key={channel.id} channel={channel} index={index} />
            ))}
          </ul>
        </div>
      </section>

      <section id="write-to-us" className="scroll-mt-24 border-b border-[var(--color-border)]">
        <Reveal className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
              Enquiry
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">Write to us</h2>
            <p className="mt-3 mb-10 text-sm leading-7 text-[var(--color-muted-foreground)]">
              Share a few details and we&apos;ll get back to you at {storefrontContact.email}, or
              reach us on {storefrontContact.phone}.
            </p>
          </div>
          <ContactEnquiryForm />
        </Reveal>
      </section>

      <section
        id="order-support"
        className="scroll-mt-24 bg-[color-mix(in_srgb,var(--color-muted)_55%,var(--color-background))]"
      >
        <Reveal className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-20">
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
        </Reveal>
      </section>
    </article>
  );
}

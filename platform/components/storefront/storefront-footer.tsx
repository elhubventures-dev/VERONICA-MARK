import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { Reveal } from "@/components/storefront/reveal";
import { staggerDelay } from "@/lib/motion";
import { siteMedia } from "@/lib/storefront/site-media";
import { storefrontContact } from "@/lib/storefront/contact";

const groups: { title: string; links: [string, string][] }[] = [
  {
    title: "Client services",
    links: [
      ["Contact", "/contact"],
      ["FAQ", "/faq"],
      ["Track order", "/track-order"],
      ["Account", "/account"],
    ],
  },
  {
    title: "The house",
    links: [
      ["About", "/about"],
      ["Brands", "/brands"],
      ["Perfumes", "/categories/perfumes"],
      ["New arrivals", "/shop?sort=newest"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function StorefrontFooter() {
  return (
    <footer className="relative isolate overflow-hidden px-5 pt-16 pb-8 text-white sm:px-8">
      <Image
        src={siteMedia.footerBackground}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover vm-ambient-drift"
      />
      <MediaScrim variant="center" />
      <Reveal className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.5fr_2fr]">
          <div>
            <BrandMark href="/" variant="monogram" withWordmark size={40} className="text-white [&_span]:text-white" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Curated for the Exceptional. A considered destination for perfume with presence, provenance and point of view.
            </p>
            <a
              href={storefrontContact.telUrl}
              className="mt-4 inline-flex min-h-11 items-center text-sm text-white/80 transition-colors duration-300 hover:text-white"
            >
              {storefrontContact.phone}
            </a>
            <a
              href={storefrontContact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block max-w-sm text-sm leading-6 text-white/60 transition-colors duration-300 hover:text-white/90"
            >
              {storefrontContact.address.line1}
              <br />
              {storefrontContact.address.line2}
              <br />
              {storefrontContact.address.line3}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group, index) => (
              <Reveal key={group.title} delay={staggerDelay(index, 0.05)} variant="up">
                <h2 className="text-xs tracking-[0.18em] text-[var(--color-accent)] uppercase">{group.title}</h2>
                <ul className="mt-4 space-y-1">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-flex min-h-11 items-center text-sm text-white/70 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-7 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} VERONICA MARK. All rights reserved.</p>
          <p>Authenticity assured · Secure checkout · Curated for the Exceptional.</p>
        </div>
        <p className="pt-4 text-center text-[11px] tracking-wide text-white/45 sm:text-left">
          Powered by VEES AIRBNB &amp; Hospitality Solutions · BN: 6913957
        </p>
      </Reveal>
    </footer>
  );
}

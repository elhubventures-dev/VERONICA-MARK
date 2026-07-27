import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { MediaScrim } from "@/components/storefront/media-scrim";
import { siteMedia } from "@/lib/storefront/site-media";

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
        className="-z-20 object-cover"
      />
      <MediaScrim variant="center" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.5fr_2fr]">
          <div>
            <BrandMark href="/" variant="monogram" withWordmark size={40} className="text-white [&_span]:text-white" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Curated for the Exceptional. A considered destination for perfume with presence, provenance and point of view.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs tracking-[0.18em] text-[var(--color-accent)] uppercase">{group.title}</h2>
                <ul className="mt-4 space-y-1">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-flex min-h-11 items-center text-sm text-white/70 hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-7 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} VERONICA MARK. All rights reserved.</p>
          <p>Authenticity assured · Secure checkout · Curated for the Exceptional.</p>
        </div>
      </div>
    </footer>
  );
}

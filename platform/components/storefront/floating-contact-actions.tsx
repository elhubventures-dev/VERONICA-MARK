"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { storefrontContact } from "@/lib/storefront/contact";

const SHOW_AFTER_PX = 200;

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="pointer-events-none size-5"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const fabClass =
  "relative z-[100] flex size-12 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] bg-[var(--color-brand-deep)] text-[var(--color-accent)] shadow-[0_8px_24px_color-mix(in_srgb,var(--color-brand-deep)_40%,transparent)] transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:border-[var(--color-accent)] hover:bg-[var(--color-brand-field)] hover:text-[var(--color-accent-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] active:scale-[0.96]";

export function FloatingContactActions() {
  const [mounted, setMounted] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setShowTop(y > SHOW_AFTER_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    try {
      window.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const openWhatsApp = () => {
    window.open(storefrontContact.whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed right-3 bottom-[calc(var(--storefront-bottom-nav-height,4rem)+0.35rem)] z-[100] flex flex-col-reverse items-center gap-2.5 sm:right-5 lg:right-6 lg:bottom-4"
      role="group"
      aria-label="Quick contact"
    >
      <button
        type="button"
        onClick={openWhatsApp}
        aria-label={`Chat on WhatsApp at ${storefrontContact.phone}`}
        className={fabClass}
      >
        <WhatsAppIcon />
      </button>

      {showTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={fabClass}
        >
          <ArrowUp className="pointer-events-none size-5" strokeWidth={2.25} aria-hidden />
        </button>
      ) : null}
    </div>,
    document.body,
  );
}

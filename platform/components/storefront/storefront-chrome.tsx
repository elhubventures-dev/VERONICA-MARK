"use client";

import { useEffect, useRef, useState } from "react";

import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

const DEFAULT_CHROME_HEIGHT = 112;

export function StorefrontChrome() {
  const chromeRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(DEFAULT_CHROME_HEIGHT);

  useEffect(() => {
    const el = chromeRef.current;
    if (!el) return;

    const update = () => {
      const next = el.getBoundingClientRect().height;
      setHeight(next);
      document.documentElement.style.setProperty(
        "--storefront-chrome-height",
        `${next}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--storefront-chrome-height");
    };
  }, []);

  return (
    <>
      <div ref={chromeRef} className="fixed top-0 right-0 left-0 z-50">
        <AnnouncementBar />
        <StorefrontHeader />
      </div>
      <div style={{ height }} aria-hidden="true" />
    </>
  );
}

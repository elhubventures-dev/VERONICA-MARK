"use client";

import * as React from "react";

import { siteMedia } from "@/lib/storefront/site-media";

const SESSION_KEY = "vm-pwa-splash-shown";
const MIN_VISIBLE_MS = 1600;
const FADE_MS = 450;
const MOBILE_TABLET_MQ = "(max-width: 1023px)";

function isStandaloneDisplayMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isMobileOrTablet() {
  if (window.matchMedia(MOBILE_TABLET_MQ).matches) return true;
  if (
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1 &&
    !/iPhone|iPod/.test(navigator.userAgent)
  ) {
    return true;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

function alreadyShownThisSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markShownThisSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore
  }
}

type PwaSplashScreenProps = {
  enabled: boolean;
};

/**
 * Branded flash screen for installed PWA launches on mobile/tablet.
 * Complements iOS apple-touch-startup-image (native cold start) and covers
 * Android, which does not support custom full-bleed splash images in the manifest.
 */
export function PwaSplashScreen({ enabled }: PwaSplashScreenProps) {
  const [phase, setPhase] = React.useState<"hidden" | "visible" | "fading">("hidden");

  React.useEffect(() => {
    if (!enabled) return;
    if (!isMobileOrTablet() || !isStandaloneDisplayMode() || alreadyShownThisSession()) {
      return;
    }

    markShownThisSession();
    setPhase("visible");

    const fadeTimer = window.setTimeout(() => setPhase("fading"), MIN_VISIBLE_MS);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), MIN_VISIBLE_MS + FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [enabled]);

  if (phase === "hidden") return null;

  return (
    <div
      role="presentation"
      aria-hidden
      className="fixed inset-0 z-[200] bg-[#1A0F2E] transition-opacity duration-[450ms] ease-out"
      style={{ opacity: phase === "fading" ? 0 : 1, pointerEvents: phase === "fading" ? "none" : "auto" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed splash; avoid Next Image latency on cold start */}
      <img
        src={siteMedia.mobileAppSplashScreen}
        alt=""
        className="h-full w-full object-cover object-center"
        decoding="sync"
        fetchPriority="high"
      />
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

const STORAGE_KEY = "vm-pwa-install-state";
const LEGACY_DISMISS_KEY = "vm-pwa-install-dismissed-at";
const COOLDOWN_MS = 6 * 60 * 60 * 1000;
const BLOCK_AFTER_DISMISSES = 4;
const BLOCK_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 1200;
/** If the browser never fires beforeinstallprompt (common on HTTP LAN / iOS), show a manual hint. */
const FALLBACK_HINT_MS = 2500;
/** Below Tailwind `lg` (1024) — phones + tablets in typical portrait/landscape. */
const MOBILE_TABLET_MQ = "(max-width: 1023px)";

const SUPPRESSED_PATHS = [
  "/checkout",
  "/cart",
  "/account",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth",
];

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type PwaInstallState = {
  /** Last dismiss timestamp — drives the 6-hour revisit cooldown. */
  dismissedAt?: number;
  /** Cumulative dismisses toward the 30-day block. */
  dismissCount?: number;
  /** Absolute timestamp until which the prompt stays hidden after 4 dismisses. */
  blockedUntil?: number;
  /** Set after a successful install — never show again on this browser. */
  installed?: boolean;
};

function readState(): PwaInstallState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PwaInstallState;
      if (parsed && typeof parsed === "object") return parsed;
    }

    // One-time migration from the previous single-timestamp key.
    const legacy = localStorage.getItem(LEGACY_DISMISS_KEY);
    if (legacy) {
      const dismissedAt = Number(legacy);
      if (Number.isFinite(dismissedAt)) {
        const migrated: PwaInstallState = { dismissedAt, dismissCount: 1 };
        writeState(migrated);
        localStorage.removeItem(LEGACY_DISMISS_KEY);
        return migrated;
      }
    }
  } catch {
    // ignore storage errors
  }
  return {};
}

function writeState(state: PwaInstallState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function isEligibleToShow(state: PwaInstallState, now = Date.now()): boolean {
  if (state.installed) return false;
  if (state.blockedUntil && state.blockedUntil > now) return false;
  if (state.dismissedAt && now - state.dismissedAt < COOLDOWN_MS) return false;
  return true;
}

function markDismissed() {
  const now = Date.now();
  const prev = readState();
  // After a 30-day block expires, start a fresh dismiss streak.
  const countBase =
    prev.blockedUntil && prev.blockedUntil <= now ? 0 : (prev.dismissCount ?? 0);
  const dismissCount = countBase + 1;
  const next: PwaInstallState = {
    ...prev,
    dismissedAt: now,
    dismissCount,
    blockedUntil: undefined,
    installed: prev.installed,
  };
  if (dismissCount >= BLOCK_AFTER_DISMISSES) {
    next.blockedUntil = now + BLOCK_DURATION_MS;
    next.dismissCount = 0;
  }
  writeState(next);
}

function markInstalled() {
  writeState({ ...readState(), installed: true });
}

function shouldSuppressPath(pathname: string) {
  return SUPPRESSED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isStandaloneDisplayMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/** iPadOS 13+ can report as Macintosh with touch — treat as tablet. */
function isIpadOsDesktopUa() {
  if (typeof navigator === "undefined") return false;
  return (
    navigator.platform === "MacIntel" &&
    navigator.maxTouchPoints > 1 &&
    !/iPhone|iPod/.test(navigator.userAgent)
  );
}

/** UA fallback for phones/tablets whose viewport is wider than 1023px (e.g. landscape tablets). */
function isMobileOrTabletUa() {
  if (typeof navigator === "undefined") return false;
  if (isIpadOsDesktopUa()) return true;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isSecureInstallContext() {
  if (typeof window === "undefined") return false;
  return window.isSecureContext;
}

type PwaInstallPromptProps = {
  enabled: boolean;
};

export function PwaInstallPrompt({ enabled }: PwaInstallPromptProps) {
  const pathname = usePathname();
  const isNarrowViewport = useMediaQuery(MOBILE_TABLET_MQ);
  const [isDeviceUa, setIsDeviceUa] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [manualHint, setManualHint] = React.useState(false);

  React.useEffect(() => {
    setIsDeviceUa(isMobileOrTabletUa());
  }, []);

  const isMobileOrTablet = isNarrowViewport || isDeviceUa;

  React.useEffect(() => {
    if (
      !enabled ||
      !isMobileOrTablet ||
      shouldSuppressPath(pathname) ||
      isStandaloneDisplayMode() ||
      !isEligibleToShow(readState())
    ) {
      setVisible(false);
      setManualHint(false);
      return;
    }

    let cancelled = false;
    let bipFired = false;

    const onAppInstalled = () => {
      markInstalled();
      setVisible(false);
      setManualHint(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onAppInstalled);

    // iOS never fires beforeinstallprompt — show Add to Home Screen guidance.
    if (isIosDevice() || isIpadOsDesktopUa()) {
      const timer = window.setTimeout(() => {
        if (!cancelled) setManualHint(true);
      }, OPEN_DELAY_MS);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
        window.removeEventListener("appinstalled", onAppInstalled);
      };
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      bipFired = true;
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      window.setTimeout(() => {
        if (!cancelled) setVisible(true);
      }, OPEN_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // Chrome only fires BIP on HTTPS or localhost. Phone access via
    // http://192.168.x.x never qualifies — show a manual install hint instead.
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && !bipFired) {
        setManualHint(true);
      }
    }, FALLBACK_HINT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [enabled, pathname, isMobileOrTablet]);

  const dismiss = React.useCallback(() => {
    markDismissed();
    setVisible(false);
    setManualHint(false);
    setDeferredPrompt(null);
  }, []);

  const install = React.useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      markInstalled();
      setVisible(false);
      setManualHint(false);
    } else {
      dismiss();
    }
    setDeferredPrompt(null);
  }, [deferredPrompt, dismiss]);

  if (!enabled || !isMobileOrTablet || isStandaloneDisplayMode()) {
    return null;
  }

  if (!visible && !manualHint) {
    return null;
  }

  const canNativeInstall = Boolean(deferredPrompt) && visible;
  const insecureLan = manualHint && !isSecureInstallContext();

  const supportingCopy = canNativeInstall
    ? "Keep the collection close with a faster, app-like experience on your device."
    : isIosDevice() || isIpadOsDesktopUa()
      ? "Tap Share, then Add to Home Screen for quick access."
      : insecureLan
        ? "Open the browser menu and choose Install app or Add to Home Screen. Native install prompts need HTTPS (or localhost)."
        : "Open the browser menu and choose Install app or Add to Home Screen.";

  return (
    <div
      role="region"
      aria-label="Install VERONICA MARK"
      className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 px-4 pointer-events-none md:bottom-6 md:px-6"
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-subtle)] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-left">
          <p className="font-display text-lg text-[var(--color-foreground)]">Install VERONICA MARK</p>
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{supportingCopy}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {canNativeInstall ? (
            <Button type="button" onClick={() => void install()}>
              Install
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={dismiss}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}

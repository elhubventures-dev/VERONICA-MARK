"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "vm-pwa-install-dismissed-at";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 1200;
/** If the browser never fires beforeinstallprompt (common on HTTP LAN / iOS), show a manual hint. */
const FALLBACK_HINT_MS = 2500;

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

function readDismissedAt(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore storage errors
  }
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

function isSecureInstallContext() {
  if (typeof window === "undefined") return false;
  return window.isSecureContext;
}

type PwaInstallPromptProps = {
  enabled: boolean;
};

export function PwaInstallPrompt({ enabled }: PwaInstallPromptProps) {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [manualHint, setManualHint] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || shouldSuppressPath(pathname) || isStandaloneDisplayMode()) {
      setVisible(false);
      setManualHint(false);
      return;
    }

    const dismissedAt = readDismissedAt();
    if (dismissedAt && Date.now() - dismissedAt < COOLDOWN_MS) {
      return;
    }

    let cancelled = false;
    let bipFired = false;

    // iOS never fires beforeinstallprompt — show Add to Home Screen guidance.
    if (isIosDevice()) {
      const timer = window.setTimeout(() => {
        if (!cancelled) setManualHint(true);
      }, OPEN_DELAY_MS);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
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
    };
  }, [enabled, pathname]);

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
      setVisible(false);
    } else {
      dismiss();
    }
    setDeferredPrompt(null);
  }, [deferredPrompt, dismiss]);

  if (!enabled || isStandaloneDisplayMode()) {
    return null;
  }

  if (!visible && !manualHint) {
    return null;
  }

  const canNativeInstall = Boolean(deferredPrompt) && visible;
  const insecureLan = manualHint && !isSecureInstallContext();

  const supportingCopy = canNativeInstall
    ? "Keep the collection close with a faster, app-like experience on your device."
    : isIosDevice()
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

/**
 * Client-side storefront visit tracking for engagement popups.
 * A "visit" is one browser session (sessionStorage). Visit count lives in localStorage.
 */

const VISIT_COUNT_KEY = "vm-storefront-visit-count";
const SESSION_COUNTED_KEY = "vm-storefront-visit-counted";
export const FLASH_SALE_POPUP_SEEN_KEY = "vm-flash-sale-popup-seen-at";
export const WELCOME_BACK_POPUP_SEEN_KEY = "vm-welcome-back-popup-seen-at";

export const ENGAGEMENT_POPUP_COOLDOWN_MS = 48 * 60 * 60 * 1000;
export const ENGAGEMENT_POPUP_OPEN_DELAY_MS = 900;

function readNumber(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeNumber(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

/**
 * Registers the current browser session as a storefront visit (once per session)
 * and returns the cumulative visit count (1 = first-time, 2+ = returning).
 */
export function registerStorefrontVisit(): number {
  try {
    const alreadyCounted = sessionStorage.getItem(SESSION_COUNTED_KEY) === "1";
    if (alreadyCounted) {
      return Math.max(readNumber(VISIT_COUNT_KEY) ?? 1, 1);
    }

    const existing = readNumber(VISIT_COUNT_KEY);
    let count: number;

    if (existing !== null && existing >= 1) {
      count = existing + 1;
    } else if (readNumber(FLASH_SALE_POPUP_SEEN_KEY) !== null) {
      // Saw the flash-sale popup before visit tracking existed → returning guest.
      count = 2;
    } else {
      count = 1;
    }

    writeNumber(VISIT_COUNT_KEY, count);
    sessionStorage.setItem(SESSION_COUNTED_KEY, "1");
    return count;
  } catch {
    return 1;
  }
}

export function getStorefrontVisitCount(): number {
  try {
    return Math.max(readNumber(VISIT_COUNT_KEY) ?? 0, 0);
  } catch {
    return 0;
  }
}

export function isReturningStorefrontVisitor(): boolean {
  return getStorefrontVisitCount() >= 2;
}

export function markFlashSalePopupSeen() {
  writeNumber(FLASH_SALE_POPUP_SEEN_KEY, Date.now());
}

export function markWelcomeBackPopupSeen() {
  writeNumber(WELCOME_BACK_POPUP_SEEN_KEY, Date.now());
}

export function isFlashSalePopupOnCooldown(now = Date.now()): boolean {
  const lastSeen = readNumber(FLASH_SALE_POPUP_SEEN_KEY);
  if (lastSeen === null) return false;
  return now - lastSeen < ENGAGEMENT_POPUP_COOLDOWN_MS;
}

export function isWelcomeBackPopupOnCooldown(now = Date.now()): boolean {
  const lastSeen = readNumber(WELCOME_BACK_POPUP_SEEN_KEY);
  if (lastSeen === null) return false;
  return now - lastSeen < ENGAGEMENT_POPUP_COOLDOWN_MS;
}

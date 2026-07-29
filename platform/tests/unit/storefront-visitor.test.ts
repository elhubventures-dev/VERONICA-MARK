import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ENGAGEMENT_POPUP_COOLDOWN_MS,
  FLASH_SALE_POPUP_SEEN_KEY,
  WELCOME_BACK_POPUP_SEEN_KEY,
  isFlashSalePopupOnCooldown,
  isReturningStorefrontVisitor,
  isWelcomeBackPopupOnCooldown,
  markFlashSalePopupSeen,
  markWelcomeBackPopupSeen,
  registerStorefrontVisit,
} from "@/lib/storefront/visitor";

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("storefront visitor tracking", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockStorage());
    vi.stubGlobal("sessionStorage", mockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("counts the first session as visit 1", () => {
    expect(registerStorefrontVisit()).toBe(1);
    expect(isReturningStorefrontVisitor()).toBe(false);
    expect(registerStorefrontVisit()).toBe(1);
  });

  it("treats a new session as a returning visit", () => {
    expect(registerStorefrontVisit()).toBe(1);
    sessionStorage.clear();
    expect(registerStorefrontVisit()).toBe(2);
    expect(isReturningStorefrontVisitor()).toBe(true);
  });

  it("migrates legacy flash-sale popup viewers to returning visitors", () => {
    localStorage.setItem(FLASH_SALE_POPUP_SEEN_KEY, String(Date.now()));
    expect(registerStorefrontVisit()).toBe(2);
    expect(isReturningStorefrontVisitor()).toBe(true);
  });

  it("keeps flash-sale and welcome-back cooldowns independent", () => {
    markFlashSalePopupSeen();
    expect(isFlashSalePopupOnCooldown()).toBe(true);
    expect(isWelcomeBackPopupOnCooldown()).toBe(false);

    markWelcomeBackPopupSeen();
    expect(localStorage.getItem(WELCOME_BACK_POPUP_SEEN_KEY)).toBeTruthy();
    expect(isWelcomeBackPopupOnCooldown()).toBe(true);
    expect(
      isWelcomeBackPopupOnCooldown(Date.now() + ENGAGEMENT_POPUP_COOLDOWN_MS + 1),
    ).toBe(false);
  });
});

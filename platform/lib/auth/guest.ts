import type { NextRequest, NextResponse } from "next/server";

export const GUEST_SESSION_COOKIE = "vm_guest_id";

export type EffectiveAccessLevel = "GUEST" | "CUSTOMER" | "BRAND_MANAGER" | "SUPER_ADMIN";

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export function getGuestId(source: NextRequest | CookieReader): string | null {
  const cookies = "cookies" in source ? source.cookies : source;
  return cookies.get(GUEST_SESSION_COOKIE)?.value ?? null;
}

export function ensureGuestId(source: NextRequest | CookieReader): {
  guestId: string;
  isNew: boolean;
} {
  const existing = getGuestId(source);
  return existing
    ? { guestId: existing, isNew: false }
    : { guestId: crypto.randomUUID(), isNew: true };
}

export function setGuestCookie(response: NextResponse, guestId: string): void {
  response.cookies.set(GUEST_SESSION_COOKIE, guestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

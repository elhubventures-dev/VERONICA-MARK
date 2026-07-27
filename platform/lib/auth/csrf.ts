import type { NextResponse } from "next/server";

export const CSRF_COOKIE_NAME = "vm_csrf";

const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return toHex(new Uint8Array(digest));
}

export function setCsrfCookie(response: NextResponse, token = createCsrfToken()): string {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  return token;
}

function timingSafeEqual(left: string, right: string): boolean {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

/** Read the raw CSRF token from request cookies (server components / actions). */
export function getCsrfTokenFromCookie(cookieValue: string | null | undefined): string {
  return cookieValue ?? "";
}

export async function validateCsrfToken(
  cookieValue: string | null | undefined,
  headerOrFormValue: string | null | undefined,
): Promise<boolean> {
  if (!cookieValue || !headerOrFormValue) {
    return false;
  }
  const [cookieHash, suppliedHash] = await Promise.all([
    hashToken(cookieValue),
    hashToken(headerOrFormValue),
  ]);
  return timingSafeEqual(cookieHash, suppliedHash);
}

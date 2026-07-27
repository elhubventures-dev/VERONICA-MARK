import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth/config";
import { createCsrfToken, CSRF_COOKIE_NAME, setCsrfCookie } from "@/lib/auth/csrf";
import { ensureGuestId, setGuestCookie } from "@/lib/auth/guest";
import { hasRequiredRole, matchRoute } from "@/lib/auth/rbac";
import {
  GEO_COUNTRY_COOKIE,
  GEO_COUNTRY_COOKIE_MAX_AGE,
  normalizeCountryCode,
  resolveCountryFromHeaders,
} from "@/lib/commerce/geo";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const rule = matchRoute(pathname);

  const existingCsrf = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const csrfToken = existingCsrf ?? createCsrfToken();
  const guest = ensureGuestId(request);

  const geoFromHeader = resolveCountryFromHeaders(request.headers);
  const geoOverride = process.env.GEO_COUNTRY_OVERRIDE?.trim();
  const existingGeo = request.cookies.get(GEO_COUNTRY_COOKIE)?.value;
  const geoCountry = normalizeCountryCode(
    geoFromHeader ?? geoOverride ?? existingGeo ?? "NG",
  );
  const shouldSetGeoCookie = !existingGeo || (geoFromHeader && existingGeo !== geoCountry);

  const responseHeaders = new Headers(request.headers);
  responseHeaders.set("x-request-id", requestId);
  responseHeaders.set("x-csrf-token", csrfToken);
  responseHeaders.set("x-guest-id", guest.guestId);
  responseHeaders.set("x-geo-country", geoCountry);

  const finalize = (response: NextResponse) => {
    response.headers.set("x-request-id", requestId);
    response.headers.set("x-geo-country", geoCountry);
    if (!existingCsrf) {
      setCsrfCookie(response, csrfToken);
    }
    if (guest.isNew) {
      setGuestCookie(response, guest.guestId);
    }
    if (shouldSetGeoCookie) {
      response.cookies.set(GEO_COUNTRY_COOKIE, geoCountry, {
        path: "/",
        maxAge: GEO_COUNTRY_COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  };

  if (!rule) {
    return finalize(
      NextResponse.next({
        request: { headers: responseHeaders },
      }),
    );
  }

  const session = request.auth;

  if (!session?.user) {
    const signInUrl = new URL("/auth/sign-in", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return finalize(NextResponse.redirect(signInUrl));
  }

  if (!hasRequiredRole(session.user.role, rule.roles)) {
    return finalize(NextResponse.redirect(new URL("/forbidden", request.nextUrl.origin)));
  }

  return finalize(
    NextResponse.next({
      request: { headers: responseHeaders },
    }),
  );
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

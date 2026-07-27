import { cookies, headers } from "next/headers";

import { CSRF_COOKIE_NAME, getCsrfTokenFromCookie } from "@/lib/auth/csrf";

/**
 * Resolve the CSRF token for server-rendered auth forms.
 * Prefers the middleware-injected request header so the first paint
 * still receives a token even when the cookie is being set on the response.
 */
export async function getServerCsrfToken(): Promise<string> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-csrf-token");
  if (fromHeader) {
    return fromHeader;
  }
  const cookieStore = await cookies();
  return getCsrfTokenFromCookie(cookieStore.get(CSRF_COOKIE_NAME)?.value);
}

import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

import { AUTH_COOKIE_PREFIX, JWT_MAX_AGE, SESSION_MAX_AGE } from "@/lib/auth/constants";

/**
 * Edge-compatible Auth.js config used by middleware.
 * Must not import Node-only modules (Prisma, bcrypt, Redis, pino transports).
 */
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  jwt: { maxAge: JWT_MAX_AGE },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
    // Do not set `newUser` — Auth.js would send first-time OAuth users to that page
    // instead of the intended callbackUrl (account / checkout / role home).
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}${AUTH_COOKIE_PREFIX}.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role;
        token.emailVerified = Boolean(
          (user as { emailVerified?: Date | boolean | null }).emailVerified,
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const id = typeof token.id === "string" ? token.id : undefined;
        const role = token.role as UserRole | undefined;
        if (id && role) {
          session.user.id = id;
          session.user.role = role;
          (session.user as { emailVerified?: boolean | null }).emailVerified = Boolean(
            token.emailVerified,
          );
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // fall through
      }
      return `${baseUrl}/account`;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

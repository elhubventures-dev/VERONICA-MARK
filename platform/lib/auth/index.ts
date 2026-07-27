import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { User as PrismaUser, UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { authConfig } from "@/lib/auth/config";
import { verifyPassword } from "@/lib/auth/password";
import { assertAuthRateLimit } from "@/lib/auth/rate-limit";
import { logSecurityEvent } from "@/lib/auth/security-log";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/features/auth/schemas";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
      emailVerified?: boolean | null;
    };
  }

  interface User {
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    emailVerified?: boolean | null;
  }
}

type DatabaseUser = PrismaUser;

function splitName(name?: string | null): { firstName: string; lastName: string } {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  return {
    firstName: parts.shift() ?? "Customer",
    lastName: parts.join(" ") || "Account",
  };
}

function toAdapterUser(user: DatabaseUser): AdapterUser & { role: UserRole } {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    name: `${user.firstName} ${user.lastName}`.trim(),
    image: user.image ?? user.avatar,
    role: user.role,
  };
}

const baseAdapter = PrismaAdapter(prisma) as unknown as Adapter;
const adapter: Adapter = {
  ...baseAdapter,
  async createUser(data) {
    const names = splitName(data.name);
    const customerRole = await prisma.role.findFirst({
      where: { name: "CUSTOMER", deletedAt: null },
      select: { id: true },
    });
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        emailVerified: data.emailVerified,
        image: data.image,
        ...names,
        role: "CUSTOMER",
        customerProfile: { create: {} },
        preference: { create: {} },
        ...(customerRole ? { roleAssignments: { create: { roleId: customerRole.id } } } : {}),
      },
    });
    return toAdapterUser(user);
  },
  async getUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toAdapterUser(user) : null;
  },
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return user ? toAdapterUser(user) : null;
  },
  async getUserByAccount(account) {
    const record = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      include: { user: true },
    });
    return record ? toAdapterUser(record.user) : null;
  },
  async updateUser(data) {
    const names = data.name === undefined ? {} : splitName(data.name);
    const user = await prisma.user.update({
      where: { id: data.id },
      data: {
        ...(data.email === undefined ? {} : { email: data.email.toLowerCase() }),
        ...(data.emailVerified === undefined ? {} : { emailVerified: data.emailVerified }),
        ...(data.image === undefined ? {} : { image: data.image }),
        ...names,
      },
    });
    return toAdapterUser(user);
  },
};

const providers = [
  Credentials({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(rawCredentials) {
      const parsed = signInSchema.safeParse(rawCredentials);
      if (!parsed.success) {
        await logSecurityEvent({ type: "SIGN_IN_FAILURE", meta: { reason: "invalid_input" } });
        return null;
      }

      try {
        await assertAuthRateLimit("signIn", parsed.data.email);
      } catch (error) {
        await logSecurityEvent({
          type: "RATE_LIMITED",
          email: parsed.data.email,
          meta: { action: "signIn" },
        });
        throw error;
      }

      const user = await prisma.user.findFirst({
        where: {
          email: parsed.data.email.toLowerCase(),
          deletedAt: null,
        },
      });

      if (!user?.passwordHash) {
        await logSecurityEvent({
          type: "SIGN_IN_FAILURE",
          email: parsed.data.email,
          meta: { reason: "invalid_credentials" },
        });
        return null;
      }

      const valid = await verifyPassword(parsed.data.password, user.passwordHash);
      if (!valid) {
        await logSecurityEvent({
          type: "SIGN_IN_FAILURE",
          userId: user.id,
          email: user.email,
          meta: { reason: "invalid_credentials" },
        });
        return null;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
      await logSecurityEvent({
        type: "SIGN_IN_SUCCESS",
        userId: user.id,
        email: user.email,
        meta: { provider: "credentials" },
      });

      return {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        image: user.image ?? user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
      };
    },
  }),
  ...(env.server.AUTH_GOOGLE_ID && env.server.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: env.server.AUTH_GOOGLE_ID,
          clientSecret: env.server.AUTH_GOOGLE_SECRET,
          allowDangerousEmailAccountLinking: false,
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  providers,
  secret: env.server.AUTH_SECRET,
  trustHost: env.server.AUTH_TRUST_HOST ?? true,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }
      const databaseUser = await prisma.user.findUnique({
        where: { email: user.email.toLowerCase() },
        select: { deletedAt: true },
      });
      if (databaseUser?.deletedAt) {
        await logSecurityEvent({
          type: "SIGN_IN_FAILURE",
          userId: user.id,
          email: user.email,
          meta: { provider: account?.provider, reason: "deleted_user" },
        });
        return false;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      const nextToken = await authConfig.callbacks.jwt({
        token,
        user,
        trigger,
        session,
      } as never);

      if ((!nextToken.role || !nextToken.id || nextToken.emailVerified === undefined) && nextToken.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: nextToken.email },
          select: { id: true, role: true, emailVerified: true, deletedAt: true },
        });
        if (dbUser && !dbUser.deletedAt) {
          nextToken.id = dbUser.id;
          nextToken.role = dbUser.role;
          nextToken.emailVerified = Boolean(dbUser.emailVerified);
        }
      }

      return nextToken;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email && user.id) {
        const userId = user.id;
        const profileRecord = profile as
          | { given_name?: string; family_name?: string; name?: string }
          | undefined;
        const names =
          profileRecord?.given_name || profileRecord?.family_name
            ? {
                firstName: profileRecord.given_name || "Customer",
                lastName: profileRecord.family_name || "Account",
              }
            : splitName(profileRecord?.name ?? user.name);
        const customerRole = await prisma.role.findFirst({
          where: { name: "CUSTOMER", deletedAt: null },
          select: { id: true },
        });

        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: userId },
            data: { ...names, lastLoginAt: new Date() },
          });
          await tx.customerProfile.upsert({
            where: { userId },
            create: { userId },
            update: { deletedAt: null },
          });
          await tx.userPreference.upsert({
            where: { userId },
            create: { userId },
            update: { deletedAt: null },
          });
          if (customerRole) {
            await tx.userRoleAssignment.upsert({
              where: {
                userId_roleId: { userId, roleId: customerRole.id },
              },
              create: { userId, roleId: customerRole.id },
              update: { deletedAt: null },
            });
          }
        });
        await logSecurityEvent({
          type: "SIGN_IN_SUCCESS",
          userId,
          email: user.email,
          meta: { provider: "google" },
        });
      }
      logger.info({ userId: user.id, provider: account?.provider }, "auth.sign_in");
    },
    async signOut(message) {
      if ("token" in message) {
        await logSecurityEvent({
          type: "SIGN_OUT",
          userId: typeof message.token?.id === "string" ? message.token.id : undefined,
        });
      }
    },
  },
});

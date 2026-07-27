/**
 * Provision or upgrade a Super Admin account.
 * Usage: pnpm tsx scripts/provision-super-admin.ts <email> [password]
 */
import { randomBytes } from "node:crypto";

import { hash } from "bcryptjs";
import { Currency, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

function generatePassword(): string {
  const base = randomBytes(12).toString("base64url");
  return `Vm${base.slice(0, 10)}9A`;
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: pnpm tsx scripts/provision-super-admin.ts <email> [password]");
    process.exit(1);
  }

  const password = process.argv[3] ?? generatePassword();
  const passwordHash = await hash(password, 12);

  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Full platform administration",
    },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.SUPER_ADMIN,
      passwordHash,
      emailVerified: new Date(),
      deletedAt: null,
    },
    create: {
      email,
      firstName: "Veronica",
      lastName: "Mark",
      role: UserRole.SUPER_ADMIN,
      passwordHash,
      emailVerified: new Date(),
      preferredCurrency: Currency.NGN,
    },
  });

  await prisma.superAdminProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: { userId: user.id, roleId: superAdminRole.id },
    },
    update: {},
    create: { userId: user.id, roleId: superAdminRole.id },
  });

  console.log(JSON.stringify({ email, password, userId: user.id }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

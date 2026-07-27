/**
 * Provision or upgrade a Brand Manager account.
 * Usage: pnpm tsx scripts/provision-brand-manager.ts <email> [password] [brand-slug]
 *
 * Defaults brand-slug to veronica-mark-atelier (house brand).
 */
import { randomBytes } from "node:crypto";

import { hash } from "bcryptjs";
import { Currency, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_BRAND_SLUG = "veronica-mark-atelier";

function generatePassword(): string {
  const base = randomBytes(12).toString("base64url");
  return `Vm${base.slice(0, 10)}9A`;
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error(
      "Usage: pnpm tsx scripts/provision-brand-manager.ts <email> [password] [brand-slug]",
    );
    process.exit(1);
  }

  const password = process.argv[3] ?? generatePassword();
  const brandSlug = process.argv[4]?.trim() || DEFAULT_BRAND_SLUG;
  const passwordHash = await hash(password, 12);

  const brandManagerRole = await prisma.role.findUnique({
    where: { name: "BRAND_MANAGER" },
  });

  if (!brandManagerRole) {
    console.error("BRAND_MANAGER role not found. Run `pnpm db:seed` first.");
    process.exit(1);
  }

  const brand = await prisma.brand.findFirst({
    where: { slug: brandSlug, deletedAt: null },
    select: { id: true, name: true, slug: true },
  });

  if (!brand) {
    console.error(
      `Brand slug "${brandSlug}" not found. Run \`pnpm db:seed\` first, or pass an existing slug.`,
    );
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.BRAND_MANAGER,
      passwordHash,
      emailVerified: new Date(),
      deletedAt: null,
    },
    create: {
      email,
      firstName: "Brand",
      lastName: "Manager",
      role: UserRole.BRAND_MANAGER,
      passwordHash,
      emailVerified: new Date(),
      preferredCurrency: Currency.NGN,
    },
  });

  await prisma.brandManagerProfile.upsert({
    where: { userId: user.id },
    update: {
      brandId: brand.id,
      isPrimary: true,
      deletedAt: null,
    },
    create: {
      userId: user.id,
      brandId: brand.id,
      isPrimary: true,
      title: "Brand Manager",
    },
  });

  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: { userId: user.id, roleId: brandManagerRole.id },
    },
    update: {},
    create: { userId: user.id, roleId: brandManagerRole.id },
  });

  // Drop Super Admin elevation if this email was previously upgraded.
  await prisma.superAdminProfile.deleteMany({ where: { userId: user.id } });
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  if (superAdminRole) {
    await prisma.userRoleAssignment.deleteMany({
      where: { userId: user.id, roleId: superAdminRole.id },
    });
  }

  console.log(
    JSON.stringify(
      {
        email,
        password,
        userId: user.id,
        brand: { id: brand.id, name: brand.name, slug: brand.slug },
        role: "BRAND_MANAGER",
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

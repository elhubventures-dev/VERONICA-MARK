import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

import { hash } from "bcryptjs";
import {
  BrandStatus,
  Currency,
  FeatureFlagEnvironment,
  PrismaClient,
  TaxType,
  UserRole,
  PermissionScope,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { assertSeedAllowed, resolveSeedPassword } from "../lib/db/seed-guard";

/**
 * Bootstrap seed only — roles, login accounts, house brand shell, categories,
 * tax/shipping config. No sample products, orders, wallets, coupons, or promo data.
 */
const prisma = new PrismaClient();

assertSeedAllowed();
const PASSWORD = resolveSeedPassword();

async function seedRolesAndPermissions() {
  const roleDefinitions = [
    {
      name: "SUPER_ADMIN",
      description: "Full platform administration",
      permissions: [
        { resource: "brand", scope: PermissionScope.MANAGE },
        { resource: "product", scope: PermissionScope.MANAGE },
        { resource: "order", scope: PermissionScope.MANAGE },
        { resource: "user", scope: PermissionScope.MANAGE },
        { resource: "promotion", scope: PermissionScope.MANAGE },
        { resource: "audit_log", scope: PermissionScope.READ },
      ],
    },
    {
      name: "BRAND_MANAGER",
      description: "Manage assigned brand catalog and inventory",
      permissions: [
        { resource: "brand", scope: PermissionScope.WRITE },
        { resource: "product", scope: PermissionScope.MANAGE },
        { resource: "inventory", scope: PermissionScope.MANAGE },
        { resource: "order", scope: PermissionScope.READ },
      ],
    },
    {
      name: "CUSTOMER",
      description: "Browse catalog, cart, checkout, and account",
      permissions: [
        { resource: "product", scope: PermissionScope.READ },
        { resource: "cart", scope: PermissionScope.MANAGE },
        { resource: "order", scope: PermissionScope.WRITE },
        { resource: "review", scope: PermissionScope.WRITE },
      ],
    },
  ] as const;

  const roles: Record<string, string> = {};

  for (const roleDef of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { description: roleDef.description },
      create: {
        name: roleDef.name,
        description: roleDef.description,
      },
    });
    roles[roleDef.name] = role.id;

    for (const permissionDef of roleDef.permissions) {
      const permission = await prisma.permission.upsert({
        where: {
          resource_scope: {
            resource: permissionDef.resource,
            scope: permissionDef.scope,
          },
        },
        update: {},
        create: {
          resource: permissionDef.resource,
          scope: permissionDef.scope,
        },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  return roles;
}

async function assignRole(userId: string, roleId: string) {
  await prisma.userRoleAssignment.upsert({
    where: {
      userId_roleId: { userId, roleId },
    },
    update: {},
    create: { userId, roleId },
  });
}

async function main() {
  const passwordHash = await hash(PASSWORD, 12);
  const roles = await seedRolesAndPermissions();

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@veronicamark.com" },
    update: {},
    create: {
      email: "admin@veronicamark.com",
      firstName: "Veronica",
      lastName: "Mark",
      role: UserRole.SUPER_ADMIN,
      passwordHash,
      emailVerified: new Date(),
      preferredCurrency: Currency.NGN,
    },
  });

  await prisma.superAdminProfile.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: { userId: superAdmin.id },
  });

  await assignRole(superAdmin.id, roles.SUPER_ADMIN!);

  const brandManager = await prisma.user.upsert({
    where: { email: "brand.manager@veronicamark.com" },
    update: {},
    create: {
      email: "brand.manager@veronicamark.com",
      firstName: "Amara",
      lastName: "Okafor",
      role: UserRole.BRAND_MANAGER,
      passwordHash,
      emailVerified: new Date(),
      preferredCurrency: Currency.NGN,
    },
  });

  await assignRole(brandManager.id, roles.BRAND_MANAGER!);

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      firstName: "Chidi",
      lastName: "Eze",
      role: UserRole.CUSTOMER,
      passwordHash,
      emailVerified: new Date(),
      preferredCurrency: Currency.NGN,
    },
  });

  await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  await assignRole(customer.id, roles.CUSTOMER!);

  const brand = await prisma.brand.upsert({
    where: { slug: "vma-scents" },
    update: {
      name: "VMA SCENTS",
      description:
        "House brand for curated luxury fragrances — managed exclusively by VERONICA MARK.",
      logo: "/media/brands/vma-scents.png",
      banner: "/media/brands/vma-scents.png",
    },
    create: {
      name: "VMA SCENTS",
      slug: "vma-scents",
      description:
        "House brand for curated luxury fragrances — managed exclusively by VERONICA MARK.",
      country: "NG",
      featured: true,
      status: BrandStatus.ACTIVE,
      contactEmail: "scents@veronicamark.com",
      contactPhone: "+2348000000000",
      logo: "/media/brands/vma-scents.png",
      banner: "/media/brands/vma-scents.png",
    },
  });

  await prisma.brandManagerProfile.upsert({
    where: { userId: brandManager.id },
    update: { brandId: brand.id },
    create: {
      userId: brandManager.id,
      brandId: brand.id,
    },
  });

  const perfumes = await prisma.category.upsert({
    where: { slug: "perfumes" },
    update: {},
    create: {
      name: "Perfumes",
      slug: "perfumes",
      sortOrder: 0,
      featured: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: "perfumes-women" },
    update: { parentId: perfumes.id },
    create: {
      name: "Women",
      slug: "perfumes-women",
      parentId: perfumes.id,
      sortOrder: 0,
    },
  });

  await prisma.category.upsert({
    where: { slug: "perfumes-men" },
    update: { parentId: perfumes.id },
    create: {
      name: "Men",
      slug: "perfumes-men",
      parentId: perfumes.id,
      sortOrder: 1,
    },
  });

  const existingTaxRule = await prisma.taxRule.findFirst({
    where: {
      country: "NG",
      region: "FCT",
      taxType: TaxType.VAT,
      active: true,
    },
  });

  if (existingTaxRule) {
    await prisma.taxRule.update({
      where: { id: existingTaxRule.id },
      data: {
        rate: new Decimal("7.5000"),
        inclusive: true,
        name: "Nigeria VAT (inclusive)",
      },
    });
  } else {
    await prisma.taxRule.create({
      data: {
        country: "NG",
        region: "FCT",
        taxType: TaxType.VAT,
        name: "Nigeria VAT (inclusive)",
        rate: new Decimal("7.5000"),
        inclusive: true,
        effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
  }

  const shippingRules = [
    {
      name: "Intra-city drop (Port Harcourt / Rivers)",
      country: "NG",
      region: "Rivers",
      fee: new Decimal("3500.00"),
      priority: 10,
    },
    {
      name: "Interstate shipping",
      country: "NG",
      region: "DEFAULT",
      fee: new Decimal("8000.00"),
      priority: 5,
    },
    {
      name: "Express courier",
      country: "NG",
      region: "EXPRESS",
      fee: new Decimal("10000.00"),
      priority: 20,
    },
    {
      name: "International shipping",
      country: "INTL",
      region: "DEFAULT",
      fee: new Decimal("50.00"),
      priority: 0,
    },
  ] as const;

  for (const rule of shippingRules) {
    const existing = await prisma.shippingRule.findFirst({
      where: {
        name: rule.name,
        country: rule.country,
        deletedAt: null,
      },
    });

    if (existing) {
      await prisma.shippingRule.update({
        where: { id: existing.id },
        data: {
          fee: rule.fee,
          region: rule.region,
          freeAboveAmount: null,
          active: true,
          priority: rule.priority,
        },
      });
    } else {
      await prisma.shippingRule.create({
        data: {
          country: rule.country,
          region: rule.region,
          name: rule.name,
          fee: rule.fee,
          minOrderAmount: new Decimal("0.00"),
          active: true,
          priority: rule.priority,
        },
      });
    }
  }

  await prisma.featureFlag.upsert({
    where: {
      key_environment: {
        key: "guest_checkout",
        environment: FeatureFlagEnvironment.DEVELOPMENT,
      },
    },
    update: { enabled: true },
    create: {
      key: "guest_checkout",
      enabled: true,
      environment: FeatureFlagEnvironment.DEVELOPMENT,
      description: "Allow checkout without account registration",
    },
  });

  const pwaFlagEnvironments: Array<{
    environment: FeatureFlagEnvironment;
    enabled: boolean;
  }> = [
    { environment: FeatureFlagEnvironment.DEVELOPMENT, enabled: true },
    { environment: FeatureFlagEnvironment.STAGING, enabled: false },
    { environment: FeatureFlagEnvironment.PRODUCTION, enabled: false },
  ];

  for (const { environment, enabled } of pwaFlagEnvironments) {
    await prisma.featureFlag.upsert({
      where: {
        key_environment: {
          key: "storefront.pwa",
          environment,
        },
      },
      update: {
        enabled,
        description: "PWA install prompt and offline shell",
        rollout: enabled ? 100 : 0,
      },
      create: {
        key: "storefront.pwa",
        enabled,
        environment,
        description: "PWA install prompt and offline shell",
        rollout: enabled ? 100 : 0,
      },
    });
  }

  await prisma.systemSetting.upsert({
    where: { key: "default_currency" },
    update: { value: "NGN" },
    create: {
      key: "default_currency",
      value: "NGN",
      description: "Default storefront currency",
      isPublic: true,
    },
  });

  console.warn("Bootstrap seed complete (no sample catalog/orders)", {
    superAdminId: superAdmin.id,
    brandManagerId: brandManager.id,
    customerId: customer.id,
    brandId: brand.id,
    note: "Rotate seeded account passwords immediately on any shared environment.",
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

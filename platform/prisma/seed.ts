import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { hash } from "bcryptjs";
import {
  BrandStatus,
  CouponStatus,
  Currency,
  FeatureFlagEnvironment,
  LanguageCode,
  MediaType,
  NotificationChannel,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  PermissionScope,
  PrismaClient,
  ProductStatus,
  PromotionStatus,
  PromotionType,
  TaxType,
  UserRole,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { assertSeedAllowed, resolveSeedPassword } from "../lib/db/seed-guard";

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
    where: { email: "sales@veronicamark.com" },
    update: {
      role: UserRole.SUPER_ADMIN,
      passwordHash,
      emailVerified: new Date(),
      deletedAt: null,
      preferredCurrency: Currency.NGN,
    },
    create: {
      email: "sales@veronicamark.com",
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
    where: { email: "veronicamark10@proton.me" },
    update: {
      role: UserRole.BRAND_MANAGER,
      passwordHash,
      emailVerified: new Date(),
      deletedAt: null,
      preferredCurrency: Currency.NGN,
    },
    create: {
      email: "veronicamark10@proton.me",
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
    update: {
      role: UserRole.CUSTOMER,
      passwordHash,
      emailVerified: new Date(),
      deletedAt: null,
      preferredCurrency: Currency.NGN,
    },
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

  const customerProfile = await prisma.customerProfile.upsert({
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

  // Placeholder maisons — active on the storefront with no products yet.
  await prisma.brand.upsert({
    where: { slug: "maison-violette" },
    update: {
      logo: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
      banner:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=85",
    },
    create: {
      name: "Maison Violette",
      slug: "maison-violette",
      description: "Parisian florals with a modern, velvet finish.",
      country: "FR",
      featured: true,
      status: BrandStatus.ACTIVE,
      logo: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
      banner:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=85",
    },
  });

  await prisma.brand.upsert({
    where: { slug: "atelier-noir" },
    update: {},
    create: {
      name: "Atelier Noir",
      slug: "atelier-noir",
      description: "Smoky woods, rare resins and after-dark elegance.",
      country: "FR",
      featured: true,
      status: BrandStatus.ACTIVE,
      logo: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85",
      banner:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=85",
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

  const women = await prisma.category.upsert({
    where: { slug: "perfumes-women" },
    update: { parentId: perfumes.id },
    create: {
      name: "Women",
      slug: "perfumes-women",
      parentId: perfumes.id,
      sortOrder: 0,
    },
  });

  const men = await prisma.category.upsert({
    where: { slug: "perfumes-men" },
    update: { parentId: perfumes.id },
    create: {
      name: "Men",
      slug: "perfumes-men",
      parentId: perfumes.id,
      sortOrder: 1,
    },
  });

  const productDefinitions = [
    {
      name: "Noir Éclat Eau de Parfum",
      slug: "noir-eclat-edp",
      barcode: "VM-NE-EDP-001",
      categoryId: women.id,
      shortDescription: "Velvet rose and oud with luminous amber.",
      description:
        "An evening signature composed for VERONICA MARK — deep rose, smoked oud, and golden amber on a cashmere musk base.",
      variants: [
        {
          sku: "VM-NE-EDP-50",
          sizeLabel: "50ml",
          price: "85000.00",
          salePrice: "76500.00",
          stock: 120,
        },
        {
          sku: "VM-NE-EDP-100",
          sizeLabel: "100ml",
          price: "125000.00",
          salePrice: "112500.00",
          stock: 80,
        },
      ],
      media: [
        {
          url: "/media/products/noir-eclat/front.jpg",
          altText: "Noir Éclat Eau de Parfum bottle",
          sortOrder: 0,
          isPrimary: true,
        },
        {
          url: "/media/products/noir-eclat/lifestyle.jpg",
          altText: "Noir Éclat lifestyle shot",
          sortOrder: 1,
          isPrimary: false,
        },
      ],
      seo: {
        metaTitle: "Noir Éclat Eau de Parfum | VMA SCENTS",
        metaDescription:
          "Discover Noir Éclat — a velvet rose and oud fragrance curated by VMA SCENTS.",
        canonicalUrl: "/shop/noir-eclat-edp",
      },
    },
    {
      name: "Sable Meridian Cologne",
      slug: "sable-meridian-cologne",
      barcode: "VM-SM-COL-001",
      categoryId: men.id,
      shortDescription: "Coastal citrus with cedar and mineral salt.",
      description:
        "A refined cologne structure — bergamot zest, cedar heart, and mineral salt over clean white musk.",
      variants: [
        {
          sku: "VM-SM-COL-75",
          sizeLabel: "75ml",
          price: "72000.00",
          stock: 95,
        },
        {
          sku: "VM-SM-COL-125",
          sizeLabel: "125ml",
          price: "98000.00",
          stock: 60,
        },
      ],
      media: [
        {
          url: "/media/products/sable-meridian/front.jpg",
          altText: "Sable Meridian Cologne bottle",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      seo: {
        metaTitle: "Sable Meridian Cologne | VMA SCENTS",
        metaDescription:
          "Sable Meridian — coastal citrus and cedar cologne from VMA SCENTS.",
        canonicalUrl: "/shop/sable-meridian-cologne",
      },
    },
  ] as const;

  for (const productDef of productDefinitions) {
    const product = await prisma.product.upsert({
      where: { slug: productDef.slug },
      update: {},
      create: {
        brandId: brand.id,
        categoryId: productDef.categoryId,
        name: productDef.name,
        slug: productDef.slug,
        barcode: productDef.barcode,
        shortDescription: productDef.shortDescription,
        description: productDef.description,
        status: ProductStatus.PUBLISHED,
        visible: true,
        featured: true,
        newArrival: true,
        publishedAt: new Date("2026-07-01T00:00:00.000Z"),
      },
    });

    await prisma.productSEO.upsert({
      where: { productId: product.id },
      update: productDef.seo,
      create: {
        productId: product.id,
        ...productDef.seo,
      },
    });

    await prisma.productMedia.deleteMany({ where: { productId: product.id } });
    for (const mediaDef of productDef.media) {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          url: mediaDef.url,
          altText: mediaDef.altText,
          type: MediaType.IMAGE,
          sortOrder: mediaDef.sortOrder,
          isPrimary: mediaDef.isPrimary,
        },
      });
    }

    for (const variantDef of productDef.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: variantDef.sku },
        update: {},
        create: {
          productId: product.id,
          sku: variantDef.sku,
          sizeLabel: variantDef.sizeLabel,
          price: new Decimal(variantDef.price),
          salePrice:
            "salePrice" in variantDef ? new Decimal(variantDef.salePrice) : undefined,
          weightGrams: variantDef.sizeLabel.includes("50") ? 250 : 400,
        },
      });

      await prisma.inventory.upsert({
        where: { variantId: variant.id },
        update: {
          available: variantDef.stock,
        },
        create: {
          variantId: variant.id,
          available: variantDef.stock,
          reserved: 0,
          reorderLevel: 10,
        },
      });
    }
  }

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

  let promotion = await prisma.promotion.findFirst({
    where: { name: "August Grand Opening Flash Sale" },
  });

  // 1 Aug 2026 00:00 – 7 Aug 2026 23:59 (Europe/Paris / BST +01:00)
  const promoWindow = {
    startsAt: new Date("2026-08-01T00:00:00+01:00"),
    endsAt: new Date("2026-08-07T23:59:59+01:00"),
  };
  const promoStatus =
    Date.now() < promoWindow.startsAt.getTime()
      ? PromotionStatus.SCHEDULED
      : Date.now() > promoWindow.endsAt.getTime()
        ? PromotionStatus.EXPIRED
        : PromotionStatus.ACTIVE;

  if (!promotion) {
    promotion = await prisma.promotion.create({
      data: {
        name: "August Grand Opening Flash Sale",
        description: "Launch celebration — 20% off with code VM5AUG-20 on eligible catalog items.",
        type: PromotionType.PERCENTAGE,
        value: new Decimal("20.00"),
        status: promoStatus,
        priority: 100,
        stackable: false,
        ...promoWindow,
      },
    });
  } else {
    promotion = await prisma.promotion.update({
      where: { id: promotion.id },
      data: {
        description: "Launch celebration — 20% off with code VM5AUG-20 on eligible catalog items.",
        value: new Decimal("20.00"),
        status: promoStatus,
        ...promoWindow,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "VM5AUG-20" },
    update: {
      status: CouponStatus.ACTIVE,
      expiresAt: promoWindow.endsAt,
      promotionId: promotion.id,
    },
    create: {
      code: "VM5AUG-20",
      promotionId: promotion.id,
      status: CouponStatus.ACTIVE,
      usageLimit: 5000,
      usedCount: 0,
      expiresAt: promoWindow.endsAt,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "AUGUST20" },
    update: {
      status: CouponStatus.ACTIVE,
      expiresAt: promoWindow.endsAt,
      promotionId: promotion.id,
    },
    create: {
      code: "AUGUST20",
      promotionId: promotion.id,
      status: CouponStatus.ACTIVE,
      usageLimit: 500,
      usedCount: 0,
      expiresAt: promoWindow.endsAt,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "GRANDOPEN" },
    update: {
      status: CouponStatus.ACTIVE,
      expiresAt: promoWindow.endsAt,
      promotionId: promotion.id,
    },
    create: {
      code: "GRANDOPEN",
      promotionId: promotion.id,
      status: CouponStatus.ACTIVE,
      usageLimit: 1000,
      usedCount: 0,
      expiresAt: promoWindow.endsAt,
    },
  });

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

  const localizationSamples = [
    {
      namespace: "common",
      key: "brand.tagline",
      value: "Curated luxury, managed with precision.",
    },
    {
      namespace: "shop",
      key: "filters.category",
      value: "Category",
    },
    {
      namespace: "checkout",
      key: "summary.total",
      value: "Order total",
    },
  ] as const;

  for (const entry of localizationSamples) {
    await prisma.localization.upsert({
      where: {
        language_namespace_key: {
          language: LanguageCode.EN,
          namespace: entry.namespace,
          key: entry.key,
        },
      },
      update: { value: entry.value },
      create: {
        language: LanguageCode.EN,
        namespace: entry.namespace,
        key: entry.key,
        value: entry.value,
      },
    });
  }

  // Sample customer address, wishlist, rewards, notification, and paid order
  const noirProduct = await prisma.product.findUnique({
    where: { slug: "noir-eclat-edp" },
    include: {
      variants: { where: { sku: "VM-NE-EDP-50" }, take: 1 },
      media: { take: 1 },
    },
  });

  await prisma.address.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: {
      fullName: "Chidi Eze",
      phone: "+2348012345678",
      country: "NG",
      state: "Lagos",
      city: "Lagos",
      address1: "12 Admiralty Way",
      address2: "Lekki Phase 1",
      postalCode: "106104",
      isDefault: true,
      type: "SHIPPING",
    },
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      customerId: customerProfile.id,
      type: "SHIPPING",
      fullName: "Chidi Eze",
      phone: "+2348012345678",
      country: "NG",
      state: "Lagos",
      city: "Lagos",
      address1: "12 Admiralty Way",
      address2: "Lekki Phase 1",
      postalCode: "106104",
      isDefault: true,
    },
  });

  if (noirProduct) {
    const wishlist = await prisma.wishlist.upsert({
      where: { id: "00000000-0000-4000-8000-000000000002" },
      update: {},
      create: {
        id: "00000000-0000-4000-8000-000000000002",
        customerId: customerProfile.id,
        name: "My Wishlist",
        isDefault: true,
      },
    });

    await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: noirProduct.id,
        },
      },
      update: {},
      create: {
        wishlistId: wishlist.id,
        productId: noirProduct.id,
      },
    });
  }

  await prisma.rewardAccount.upsert({
    where: { customerId: customerProfile.id },
    update: { balance: 420, lifetimeEarned: 420 },
    create: {
      customerId: customerProfile.id,
      balance: 420,
      lifetimeEarned: 420,
      lifetimeRedeemed: 0,
    },
  });

  const welcomeExists = await prisma.notification.findFirst({
    where: {
      customerId: customerProfile.id,
      title: "Welcome to VERONICA MARK",
    },
  });
  if (!welcomeExists) {
    await prisma.notification.create({
      data: {
        customerId: customerProfile.id,
        channel: NotificationChannel.IN_APP,
        title: "Welcome to VERONICA MARK",
        message: "Your account is ready. Explore the curated perfume edit.",
        actionUrl: "/shop",
        sentAt: new Date(),
      },
    });
  }

  const sampleVariant = noirProduct?.variants[0];
  if (sampleVariant) {
    const existingSampleOrder = await prisma.order.findUnique({
      where: { orderNumber: "VM-SEED-0001" },
    });

    if (!existingSampleOrder) {
      const unitPrice = sampleVariant.salePrice ?? sampleVariant.price;
      const qty = 1;
      const subtotal = new Decimal(unitPrice).mul(qty);
      const shippingFee = new Decimal("3500.00");
      const tax = new Decimal("0.00");
      const total = subtotal.add(shippingFee).add(tax);

      const addressJson = {
        name: "Chidi Eze",
        line1: "12 Admiralty Way",
        line2: "Lekki Phase 1",
        city: "Lagos",
        postalCode: "106104",
        country: "NG",
        email: "customer@example.com",
      };

      await prisma.order.create({
        data: {
          orderNumber: "VM-SEED-0001",
          customerId: customerProfile.id,
          currency: Currency.NGN,
          status: OrderStatus.PAID,
          subtotal,
          tax,
          shippingFee,
          discount: new Decimal("0.00"),
          total,
          placedAt: new Date("2026-07-20T10:00:00.000Z"),
          billingAddress: addressJson,
          shippingAddress: addressJson,
          notes: "Seed sample order",
          items: {
            create: [
              {
                variantId: sampleVariant.id,
                productName: noirProduct!.name,
                variantName: sampleVariant.sizeLabel ?? "50ml",
                sku: sampleVariant.sku,
                quantity: qty,
                unitPrice,
                taxAmount: tax,
                discountAmount: new Decimal("0.00"),
                lineTotal: subtotal,
              },
            ],
          },
          statusHistory: {
            create: [
              {
                fromStatus: null,
                toStatus: OrderStatus.PENDING,
                comment: "Order created (seed)",
              },
              {
                fromStatus: OrderStatus.PENDING,
                toStatus: OrderStatus.PAID,
                comment: "Marked paid (seed)",
              },
            ],
          },
          payments: {
            create: [
              {
                provider: PaymentProvider.PAYSTACK,
                reference: "seed_vm_0001",
                amount: total,
                currency: Currency.NGN,
                status: PaymentStatus.PAID,
                paidAt: new Date("2026-07-20T10:05:00.000Z"),
              },
            ],
          },
        },
      });
    }
  }

  await prisma.wallet.upsert({
    where: {
      customerId_currency: {
        customerId: customerProfile.id,
        currency: Currency.NGN,
      },
    },
    update: { balance: new Decimal("5000.00") },
    create: {
      customerId: customerProfile.id,
      currency: Currency.NGN,
      balance: new Decimal("5000.00"),
    },
  });

  // Prefer Unsplash media URLs so seeded PDPs render without local /media assets
  const mediaUpdates = [
    {
      slug: "noir-eclat-edp",
      url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    },
    {
      slug: "sable-meridian-cologne",
      url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    },
  ] as const;

  for (const entry of mediaUpdates) {
    const product = await prisma.product.findUnique({ where: { slug: entry.slug } });
    if (!product) continue;
    const primary = await prisma.productMedia.findFirst({
      where: { productId: product.id, isPrimary: true },
    });
    if (primary) {
      await prisma.productMedia.update({
        where: { id: primary.id },
        data: { url: entry.url },
      });
    }
  }

  console.warn("Seed complete", {
    superAdminId: superAdmin.id,
    brandManagerId: brandManager.id,
    customerId: customer.id,
    brandId: brand.id,
    categories: { perfumes: perfumes.id, women: women.id, men: men.id },
    promotionId: promotion.id,
    sampleOrder: sampleVariant ? "VM-SEED-0001" : null,
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

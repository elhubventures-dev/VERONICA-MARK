/**
 * Import Perfume Invoice products into the store database.
 *
 * - costPrice = invoice Rate (NGN)
 * - price (selling) = sellPrice when set, otherwise costPrice × 1.6 (60% markup)
 * - stock = invoice Qty
 * - currency defaults remain NGN
 *
 * Usage:
 *   pnpm db:import-invoice
 *   pnpm exec tsx scripts/import-invoice-catalog.ts --only=elizabeth-arden-red-door-edt-100ml
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

import {
  BrandStatus,
  InventoryStatus,
  MediaType,
  PrismaClient,
  ProductStatus,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { createClient } from "@supabase/supabase-js";

import {
  INVOICE_PRODUCTS,
  sellPriceFromCost,
  slugifyProductName,
  type InvoiceProduct,
} from "./invoice-products";

const prisma = new PrismaClient();

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

const MEDIA_ROOT = join(process.cwd(), "public", "media", "products");

const onlySlug = process.argv
  .find((arg) => arg.startsWith("--only="))
  ?.slice("--only=".length)
  ?.trim();

function mimeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

function localProductImage(slug: string): string | null {
  for (const name of ["front.png", "front.jpg", "front.jpeg", "front.webp"]) {
    const path = join(MEDIA_ROOT, slug, name);
    if (existsSync(path)) return path;
  }
  return null;
}

async function uploadProductImage(slug: string, localPath: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "veronica-mark-media";
  if (!supabaseUrl || !serviceKey) return null;

  const ext = extname(localPath) || ".jpg";
  const objectPath = `products/${slug}/front${ext}`;
  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.storage.from(bucket).upload(objectPath, readFileSync(localPath), {
    contentType: mimeFromExt(ext),
    upsert: true,
  });
  if (error) {
    console.warn(`  supabase upload failed for ${slug}: ${error.message}`);
    return null;
  }
  const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function resolveImageUrl(item: InvoiceProduct, slug: string): Promise<string> {
  const local = localProductImage(slug);
  if (local) {
    const remote = await uploadProductImage(slug, local);
    if (remote) return remote;
    return `/media/products/${slug}/${basename(local)}`;
  }
  return item.imageUrl ?? FALLBACK_IMAGE;
}

function resolveSellPrice(item: InvoiceProduct): { cost: number | null; sell: number } {
  if (item.sellPrice != null) {
    return { cost: item.costPrice ?? null, sell: item.sellPrice };
  }
  if (item.costPrice != null) {
    return { cost: item.costPrice, sell: sellPriceFromCost(item.costPrice) };
  }
  throw new Error(`No sellPrice or costPrice for ${item.name}`);
}

function sizeLabelFromName(name: string): string | undefined {
  const match = name.match(/(\d+\s*ml)/i);
  return match?.[1]?.replace(/\s+/g, "").toLowerCase();
}

function inventoryStatus(available: number, reorderLevel: number): InventoryStatus {
  if (available <= 0) return InventoryStatus.OUT_OF_STOCK;
  if (available <= reorderLevel) return InventoryStatus.LOW_STOCK;
  return InventoryStatus.IN_STOCK;
}

function isWomensPerfume(item: InvoiceProduct): boolean {
  return /for women|for her|\bwomen\b/i.test(item.name);
}

async function main() {
  const catalog = onlySlug
    ? INVOICE_PRODUCTS.filter((item) => (item.slug ?? slugifyProductName(item.name)) === onlySlug)
    : INVOICE_PRODUCTS;

  if (onlySlug && catalog.length === 0) {
    throw new Error(`No catalog product matches --only=${onlySlug}`);
  }

  console.log(
    onlySlug
      ? `Upserting 1 catalog product (${onlySlug})…`
      : `Importing ${catalog.length} invoice products…`,
  );

  const brand = await prisma.brand.upsert({
    where: { slug: "vma-scents" },
    update: {
      name: "VMA SCENTS",
      status: BrandStatus.ACTIVE,
      featured: true,
      country: "NG",
      description:
        "House brand for curated luxury fragrances — managed exclusively by VERONICA MARK.",
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
    },
  });

  const perfumes = await prisma.category.upsert({
    where: { slug: "perfumes" },
    update: { featured: true },
    create: {
      name: "Perfumes",
      slug: "perfumes",
      sortOrder: 0,
      featured: true,
    },
  });

  const bodyCare = await prisma.category.upsert({
    where: { slug: "body-mists" },
    update: { featured: true },
    create: {
      name: "Body Mists & Sprays",
      slug: "body-mists",
      sortOrder: 1,
      featured: true,
      description: "Body mists, sprays, and deodorants from the VERONICA MARK edit.",
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

  if (!onlySlug) {
    // Hide demo seed fragrances so the invoice catalog is the live assortment.
    await prisma.product.updateMany({
      where: { slug: { in: ["noir-eclat-edp", "sable-meridian-cologne"] } },
      data: { visible: false, status: ProductStatus.ARCHIVED },
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

  let imported = 0;
  let updated = 0;

  for (let index = 0; index < catalog.length; index += 1) {
    const item = catalog[index]!;
    const slug = item.slug ?? slugifyProductName(item.name);
    const sourceIndex = INVOICE_PRODUCTS.indexOf(item);
    const sku = item.sku ?? `VM-INV-${String(sourceIndex + 1).padStart(3, "0")}`;
    const { cost, sell } = resolveSellPrice(item);
    const categoryId =
      item.category === "body" ? bodyCare.id : isWomensPerfume(item) ? women.id : perfumes.id;
    const sizeLabel = sizeLabelFromName(item.name);
    const reorderLevel = item.category === "body" ? 3 : 1;
    const imageUrl = await resolveImageUrl(item, slug);

    const existing = await prisma.product.findUnique({ where: { slug } });

    const shortDescription =
      item.shortDescription ?? `${item.name} — curated by VERONICA MARK.`;
    const description =
      item.description ??
      `${item.name} from the VERONICA MARK fragrance edit. Authenticity assured.`;
    const barcode = item.barcode ?? sku;

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: item.name,
        brandId: brand.id,
        categoryId,
        barcode,
        shortDescription,
        description,
        status: ProductStatus.PUBLISHED,
        visible: true,
        publishedAt: existing?.publishedAt ?? new Date(),
        newArrival: true,
      },
      create: {
        brandId: brand.id,
        categoryId,
        name: item.name,
        slug,
        barcode,
        shortDescription,
        description,
        status: ProductStatus.PUBLISHED,
        visible: true,
        publishedAt: new Date(),
        newArrival: true,
        featured: !onlySlug && index < 8,
      },
    });

    await prisma.productSEO.upsert({
      where: { productId: product.id },
      update: {
        metaTitle: `${item.name} | VERONICA MARK`,
        metaDescription: shortDescription.slice(0, 155),
        canonicalUrl: `/products/${slug}`,
      },
      create: {
        productId: product.id,
        metaTitle: `${item.name} | VERONICA MARK`,
        metaDescription: shortDescription.slice(0, 155),
        canonicalUrl: `/products/${slug}`,
      },
    });

    const mediaCount = await prisma.productMedia.count({
      where: { productId: product.id, deletedAt: null },
    });
    if (mediaCount === 0) {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          url: imageUrl,
          altText: `${item.name} bottle and packaging`,
          type: MediaType.IMAGE,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    } else if (onlySlug && imageUrl !== FALLBACK_IMAGE) {
      const primary = await prisma.productMedia.findFirst({
        where: { productId: product.id, deletedAt: null },
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
      });
      if (primary) {
        await prisma.productMedia.update({
          where: { id: primary.id },
          data: {
            url: imageUrl,
            altText: `${item.name} bottle and packaging`,
            isPrimary: true,
          },
        });
      }
    }

    const variant = await prisma.productVariant.upsert({
      where: { sku },
      update: {
        productId: product.id,
        costPrice: cost != null ? new Decimal(cost.toFixed(2)) : null,
        price: new Decimal(sell.toFixed(2)),
        salePrice: null,
        sizeLabel,
        active: true,
      },
      create: {
        productId: product.id,
        sku,
        costPrice: cost != null ? new Decimal(cost.toFixed(2)) : null,
        price: new Decimal(sell.toFixed(2)),
        sizeLabel,
        active: true,
        sortOrder: 0,
      },
    });

    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: {
        available: item.qty,
        reserved: 0,
        reorderLevel,
        status: inventoryStatus(item.qty, reorderLevel),
      },
      create: {
        variantId: variant.id,
        available: item.qty,
        reserved: 0,
        reorderLevel,
        status: inventoryStatus(item.qty, reorderLevel),
      },
    });

    if (existing) updated += 1;
    else imported += 1;
  }

  console.log(`Done. Created ${imported}, updated ${updated}.`);
  if (!onlySlug) {
    console.log("Selling price = sellPrice or cost × 1.6 (NGN). Stock set from invoice Qty.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

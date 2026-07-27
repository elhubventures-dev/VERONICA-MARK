/**
 * Download royalty-free stand-in images, copy one per product slug locally,
 * and update ProductMedia URLs (DB when available).
 *
 * Real photos: place your shot at
 *   public/media/products/<slug>/front.jpg
 * then re-run this script (it will keep existing front.jpg files).
 *
 * Usage: pnpm db:assign-product-images
 */
import { createWriteStream, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

import { MediaType, PrismaClient, ProductStatus } from "@prisma/client";

import { INVOICE_PRODUCTS, slugifyProductName } from "./invoice-products";
import { PERFUME_IMAGE_IDS, hashSlug, unsplashUrl } from "./royalty-free-perfume-images";

const prisma = new PrismaClient();

const ROOT = join(process.cwd(), "public", "media", "products");
const LIBRARY = join(ROOT, "_library");

async function downloadToFile(url: string, dest: string): Promise<boolean> {
  mkdirSync(dirname(dest), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "VERONICA-MARK-catalog-builder/1.0" },
      redirect: "follow",
    });
    if (!res.ok || !res.body) {
      console.warn(`  skip download ${url} → HTTP ${res.status}`);
      return false;
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) {
      console.warn(`  skip non-image ${url} (${contentType})`);
      return false;
    }
    await pipeline(Readable.fromWeb(res.body as never), createWriteStream(dest));
    const size = statSync(dest).size;
    if (size < 5_000) {
      console.warn(`  skip tiny file ${dest} (${size}b)`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`  download failed ${url}:`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function ensureLibrary(): Promise<string[]> {
  mkdirSync(LIBRARY, { recursive: true });
  const uniqueIds = [...new Set(PERFUME_IMAGE_IDS)];

  for (const id of uniqueIds) {
    const dest = join(LIBRARY, `${id}.jpg`);
    if (existsSync(dest) && statSync(dest).size > 5_000) {
      continue;
    }
    process.stdout.write(`Downloading library ${id}… `);
    const ok = await downloadToFile(unsplashUrl(id), dest);
    console.log(ok ? "ok" : "failed");
  }

  const ready = readdirSync(LIBRARY)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .map((name) => join(LIBRARY, name))
    .filter((path) => statSync(path).size > 5_000);

  if (ready.length === 0) {
    throw new Error("No royalty-free library images could be downloaded.");
  }

  console.log(`Library ready: ${ready.length} images`);
  return ready;
}

function productSlugs(): Array<{ name: string; slug: string }> {
  return INVOICE_PRODUCTS.map((item) => ({
    name: item.name,
    slug: slugifyProductName(item.name),
  }));
}

function assignLibraryImage(slug: string, library: string[]): string {
  const index = hashSlug(slug) % library.length;
  return library[index]!;
}

function syncProductFolders(library: string[], force = false) {
  const products = productSlugs();
  let created = 0;
  let kept = 0;
  let replaced = 0;

  for (const product of products) {
    const folder = join(ROOT, product.slug);
    const front = join(folder, "front.jpg");
    mkdirSync(folder, { recursive: true });

    const hasExisting = existsSync(front) && statSync(front).size > 5_000;
    if (hasExisting && !force) {
      kept += 1;
      continue;
    }

    const source = assignLibraryImage(product.slug, library);
    copyFileSync(source, front);
    if (hasExisting) replaced += 1;
    else created += 1;
  }

  console.log(
    `Product folders: ${created} assigned, ${replaced} reassigned, ${kept} kept (existing photos untouched)`,
  );
  return products;
}

async function updateDatabase(products: Array<{ name: string; slug: string }>) {
  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const publicUrl = `/media/products/${product.slug}/front.jpg`;
    const row = await prisma.product.findUnique({
      where: { slug: product.slug },
      include: { media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
    });

    if (!row) {
      skipped += 1;
      continue;
    }

    const primary = row.media.find((m) => m.isPrimary) ?? row.media[0];
    if (primary) {
      await prisma.productMedia.update({
        where: { id: primary.id },
        data: {
          url: publicUrl,
          altText: product.name,
          type: MediaType.IMAGE,
          isPrimary: true,
        },
      });
    } else {
      await prisma.productMedia.create({
        data: {
          productId: row.id,
          url: publicUrl,
          altText: product.name,
          type: MediaType.IMAGE,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    }

    if (row.status !== ProductStatus.PUBLISHED || !row.visible) {
      await prisma.product.update({
        where: { id: row.id },
        data: { status: ProductStatus.PUBLISHED, visible: true },
      });
    }

    updated += 1;
  }

  console.log(`Database media: ${updated} updated, ${skipped} slugs not in DB yet`);
}

async function writeReadme() {
  const readme = join(ROOT, "README.md");
  const body = `# Product images

Each invoice product has a folder named after its **slug**.

## Replace a stand-in with your real photo

1. Find the product slug (e.g. \`maahir-perfume\`).
2. Overwrite:
   \`\`\`
   public/media/products/<slug>/front.jpg
   \`\`\`
3. Re-run \`pnpm db:assign-product-images\` (keeps your file, refreshes DB URLs).

## Notes

- Current images are **royalty-free Unsplash stand-ins**, not official brand bottles.
- Competitor / retailer product photos cannot be copied into the storefront (copyright).
- Prefer your own photography of the bottles you stock.
`;
  const { writeFileSync } = await import("node:fs");
  writeFileSync(readme, body, "utf8");
}

async function main() {
  const force = process.argv.includes("--force");
  console.log(`Assigning local product images${force ? " (force reassign stand-ins)" : ""}…`);
  mkdirSync(ROOT, { recursive: true });
  const library = await ensureLibrary();
  const products = syncProductFolders(library, force);
  await writeReadme();

  try {
    await updateDatabase(products);
  } catch (error) {
    console.warn(
      "Database update skipped (connection unavailable). Local files are ready under public/media/products/.",
    );
    console.warn(error instanceof Error ? error.message : error);
  }

  const folders = readdirSync(ROOT).filter((name) => name !== "_library" && name !== "README.md");
  console.log(`Done. ${folders.length} product image folders under public/media/products/`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Download reference product images for S.O. 860 (2nd invoice) SKUs.
 * Writes public/media/products/<slug>/front.jpg when missing (does not overwrite).
 * Then updates ProductMedia URLs in the database.
 *
 * Usage: pnpm exec tsx scripts/fetch-invoice2-product-images.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

import { MediaType, PrismaClient } from "@prisma/client";

import { INVOICE_PRODUCTS, slugifyProductName } from "./invoice-products";
import { unsplashUrl, PERFUME_IMAGE_IDS, hashSlug } from "./royalty-free-perfume-images";

const prisma = new PrismaClient();
const ROOT = join(process.cwd(), "public", "media", "products");

/** Curated reference image URLs (brand / retailer CDNs) for 2nd-invoice SKUs. */
const REFERENCE_IMAGES: Record<string, string[]> = {
  "maison-crivelli-oud-maracuja-100ml": [
    "https://cdn.shopify.com/s/files/1/0423/5807/9638/files/maison-crivelli-oud-maracuja-extrait-990913.png?v=1738886382",
    "https://cdn.shopify.com/s/files/1/0948/6018/1769/files/OM-50ml-BOX-1046x1197.png?v=1756218890",
  ],
  "maison-crivelli-hibiscus-mahajad": [
    "https://cdn.shopify.com/s/files/1/0225/2449/files/image_81b5bb97-f457-4d7e-b1b8-89a737ab488d.png?v=1701379233",
    "https://cdn.shopify.com/s/files/1/0948/6018/1769/files/HM-50ml-BOX-1046x1197.png?v=1756218805",
  ],
  "lattafa-musamam-white-intense-100ml": [
    "https://cdn.shopify.com/s/files/1/0754/4936/8799/files/Musamam-White-1.png?v=1747416325",
  ],
  "reef-33-perfume-100ml": [
    "https://cdn.shopify.com/s/files/1/0851/5806/8471/files/33masterimage_d82c80ba-f1cc-45ad-9e60-a7335b428e28.png?v=17756948",
  ],
  "reef-pink-perfume": [
    "https://cdn.shopify.com/s/files/1/0851/5806/8471/files/pinkmasterimage_f948feec-76fa-4f6b-88b2-aa23da14073e.png?v=177569",
  ],
  "atralia-elixir-100ml": [
    "https://cdn.shopify.com/s/files/1/0821/5091/6391/files/Elixir_2.jpg?v=1759512788",
  ],
  "ahmed-al-maghribi-ignite-oud-60ml": [
    "https://cdn.shopify.com/s/files/1/0798/6898/5693/files/Ignite-Oud-Perfume-60ml-EDP-Ahmed-Al-Maghribi-180831460.png?v=1763763276",
    "https://cdn.shopify.com/s/files/1/0804/7365/3577/files/ignite-oud.jpg?v=1750776716",
  ],
  "bleu-de-chanel-100ml": [
    "https://cdn.notinoimg.com/detail_main_lq/chanel/3145891073706_01-o/bleu-de-chanel___211007.jpg",
  ],
  "chanel-gabrielle-100ml": [
    "https://cdn.notinoimg.com/detail_main_lq/chanel/3145891205251-o/gabrielle___171113.jpg",
  ],
  "valentino-uomo": [
    "https://cdn.notinoimg.com/detail_main_lq/valentino/8411061757888_01-o/uomo___230925.jpg",
  ],
  "chanel-allure-homme": [
    "https://cdn.notinoimg.com/detail_main_lq/chanel/3145891214505_01-o/allure-homme___130307.jpg",
  ],
};

const SECOND_INVOICE_SLUGS = new Set([
  "dior-sauvage-elixir-100ml",
  "emporio-armani-power-of-you-90ml",
  "chanel-coco-mademoiselle-200ml",
  "maison-crivelli-oud-maracuja-100ml",
  "gucci-intense-oud-90ml",
  "chanel-allure-homme-sport",
  "chanel-gabrielle-100ml",
  "tom-ford-ombre-leather-100ml",
  "dior-sauvage-100ml",
  "valentino-uomo",
  "giorgio-armani-acqua-di-gio",
  "dior-homme-intense-100ml",
  "bleu-de-chanel-100ml",
  "chanel-allure-homme",
  "maison-crivelli-hibiscus-mahajad",
  "lattafa-musamam-white-intense-100ml",
  "ahmed-al-maghribi-ignite-oud-60ml",
  "assaf-tobacco-jam-10ml",
  "rasasi-hawas-ice-100ml",
  "ahmed-al-maghribi-leather-50ml",
  "miss-dior-100ml",
  "atralia-elixir-100ml",
  "reef-pink-perfume",
  "reef-33-perfume-100ml",
]);

async function downloadToFile(url: string, dest: string): Promise<boolean> {
  mkdirSync(dirname(dest), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VERONICA-MARK-catalog/1.0; +https://veronicamark.com)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok || !res.body) {
      console.warn(`  skip ${url} → HTTP ${res.status}`);
      return false;
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image") && !contentType.includes("octet-stream")) {
      console.warn(`  skip non-image ${url} (${contentType})`);
      return false;
    }
    await pipeline(Readable.fromWeb(res.body as never), createWriteStream(dest));
    const size = statSync(dest).size;
    if (size < 5_000) {
      console.warn(`  skip tiny ${dest} (${size}b)`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`  failed ${url}:`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function ensureFrontImage(slug: string, imageUrl?: string): Promise<string> {
  const folder = join(ROOT, slug);
  const front = join(folder, "front.jpg");
  mkdirSync(folder, { recursive: true });

  if (existsSync(front) && statSync(front).size > 5_000) {
    return `/media/products/${slug}/front.jpg`;
  }

  const candidates = [
    ...(imageUrl ? [imageUrl] : []),
    ...(REFERENCE_IMAGES[slug] ?? []),
  ];

  for (const url of candidates) {
    process.stdout.write(`  try ${url.slice(0, 72)}… `);
    const ok = await downloadToFile(url, front);
    console.log(ok ? "ok" : "no");
    if (ok) return `/media/products/${slug}/front.jpg`;
  }

  // Royalty-free stand-in so the PDP is never blank.
  const id = PERFUME_IMAGE_IDS[hashSlug(slug) % PERFUME_IMAGE_IDS.length]!;
  const fallback = unsplashUrl(id);
  process.stdout.write(`  fallback Unsplash ${id}… `);
  const ok = await downloadToFile(fallback, front);
  console.log(ok ? "ok" : "failed");
  return `/media/products/${slug}/front.jpg`;
}

async function syncMedia(productId: string, name: string, publicUrl: string) {
  const media = await prisma.productMedia.findMany({
    where: { productId, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  const primary = media.find((m) => m.isPrimary) ?? media[0];
  if (primary) {
    await prisma.productMedia.update({
      where: { id: primary.id },
      data: { url: publicUrl, altText: name, type: MediaType.IMAGE, isPrimary: true },
    });
  } else {
    await prisma.productMedia.create({
      data: {
        productId,
        url: publicUrl,
        altText: name,
        type: MediaType.IMAGE,
        sortOrder: 0,
        isPrimary: true,
      },
    });
  }
}

async function main() {
  const targets = INVOICE_PRODUCTS.filter((item) => {
    const slug = item.slug ?? slugifyProductName(item.name);
    return SECOND_INVOICE_SLUGS.has(slug);
  });

  console.log(`Fetching images for ${targets.length} S.O. 860 products…`);

  for (const item of targets) {
    const slug = item.slug ?? slugifyProductName(item.name);
    console.log(slug);
    const publicUrl = await ensureFrontImage(slug, item.imageUrl);

    const row = await prisma.product.findUnique({ where: { slug } });
    if (!row) {
      console.warn(`  (not in DB yet — local file ready)`);
      continue;
    }
    await syncMedia(row.id, item.name, publicUrl);
    console.log(`  DB media → ${publicUrl}`);
  }

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

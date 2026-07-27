import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

import { MediaType, PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();
const ROOT = join(process.cwd(), "public", "media", "products");
const DRY = process.argv.includes("--dry");
const LIMIT = (() => {
  const idx = process.argv.indexOf("--limit");
  return idx >= 0 ? Number(process.argv[idx + 1]) : Infinity;
})();

type Candidate = {
  source: "dscentsation" | "labelstore";
  title: string;
  handleOrUrl: string;
  imageUrl: string;
  score: number;
};

/** Explicit query overrides for noisy product names */
const QUERY_OVERRIDES: Record<string, string[]> = {
  "asad-black-lattafa-100ml": ["lattafa asad eau de perfume", "lattafa asad edp 100ml"],
  "asad-bourbon-perfume-100ml": ["lattafa asad bourbon"],
  "asad-elixir-perfume-100ml": ["lattafa asad elixir"],
  "yara-perfume-100ml": ["lattafa yara edp", "yara lattafa"],
  "ajwad-lattafa-perfume-100ml": ["ajwad", "lattafa ajwad"],
  "avanti-100ml-perfume": ["avanti perfume", "armaf avanti"],
  "nebras-lattafa-100ml": ["lattafa nebras"],
  "fakhar-lattafa-perfume-100ml": ["lattafa fakhar"],
  "angham-perfume-100ml": ["lattafa angham"],
  "khamrah-dukhan-100ml": ["lattafa khamrah dukhan"],
  "tamima-lattafa-100ml": ["lattafa tamima"],
  "petra-lattafa-perfume-100ml": ["lattafa petra"],
  "sehr-lattafa-perfume": ["lattafa sehr"],
  "qaed-al-fursan-perfume-90ml-white": ["qaed al fursan white", "qaed al fursan"],
  "qaed-al-fursan-perfume-black-90ml": ["qaed al fursan black", "qaaed al fursan"],
  "hayaati-black-perfume-lattafa": ["lattafa hayaati", "hayaati black"],
  "hayaati-blue-pink-perfume-100ml": ["hayaati"],
  "9pm-elixir-perfume-100ml": ["afnan 9pm elixir"],
  "9pm-rebel-perfume-100ml": ["afnan 9pm rebel", "9pm rebel"],
  "9am-pink-100ml": ["afnan 9am dive", "9am pink", "afnan 9 am"],
  "club-de-nuit-intense-man-105ml": ["club de nuit intense for men", "club de nuit intense man"],
  "club-de-nuit-iconic-105ml": ["club de nuit iconic"],
  "club-de-nuit-sillage-untold-mix": ["club de nuit sillage", "club de nuit untold"],
  "ameer-al-oud-intense-oud-100ml": ["ameer al oud", "intense oud lattafa"],
  "oud-for-glory-100ml-mix": ["oud for glory", "badee al oud"],
  "barakkat-perfume-mix-100ml": ["barakkat satin oud", "barakkat"],
  "eclaire-perfume-100ml-mix": ["lattafa eclaire"],
  "qissa-perfume-mix-100ml": ["lattafa qissa"],
  "vintage-radio-perfume-100ml": ["lattafa vintage radio"],
  "supremacy-collectors-edition-100ml": ["supremacy collectors", "afnan supremacy collector"],
  "supremacy-in-oud-perfume-100ml": ["supremacy in oud", "afnan supremacy oud"],
  "supremacy-perfume-not-only-intense-100ml": ["supremacy not only intense", "afnan supremacy"],
  "musaman-black-100ml": ["musamam", "musaman"],
  "rayhaan-tiger-100ml": ["rayhaan tiger"],
  "rayhaan-obsidian-perfume": ["rayhaan obsidian"],
  "rayhaan-nocturno-perfume-100ml": ["rayhaan nocturno"],
  "rayhaan-corium-100ml": ["rayhaan corium"],
  "floriana-rayhaan-100ml": ["rayhaan floriana", "floriana rayhaan"],
  "armaf-odyssey-body-spray-200ml": ["armaf odyssey"],
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length > 1 && !["ml", "edp", "edt", "perfume", "mix", "the", "for", "and"].includes(t));
}

const VARIANT_TOKENS = [
  "bourbon",
  "elixir",
  "rebel",
  "iconic",
  "sillage",
  "untold",
  "dukhan",
  "qahwa",
  "black",
  "white",
  "pink",
  "blue",
  "intense",
  "collector",
  "collectors",
  "velvet",
  "dive",
] as const;

function scoreMatch(ourName: string, theirTitle: string): number {
  const ours = tokens(ourName);
  const theirs = tokens(theirTitle);
  const theirSet = new Set(theirs);
  if (ours.length === 0) return 0;
  let hit = 0;
  for (const t of ours) {
    if (theirSet.has(t)) hit += 1;
    else if (theirs.some((x) => x.includes(t) || t.includes(x))) hit += 0.5;
  }
  const coverage = hit / ours.length;
  let penalty = 0;
  const low = theirTitle.toLowerCase();
  if (/inspired|attar|oil|decant|sample|tester|gift set/.test(low)) penalty += 0.4;
  if (/body spray|deodorant|mist/.test(low) && !/body|mist|spray|deodorant/i.test(ourName)) {
    penalty += 0.35;
  }

  // Variant tokens must agree — don't assign Bourbon image to Black, etc.
  for (const v of VARIANT_TOKENS) {
    const weHave = ours.includes(v) || normalize(ourName).includes(v);
    const theyHave = theirSet.has(v) || normalize(theirTitle).includes(v);
    if (weHave !== theyHave) {
      // "black" on our Asad Black is soft (classic Asad is black bottle and often untitled)
      if (v === "black" && weHave && !theyHave && !/(bourbon|elixir)/.test(normalize(theirTitle))) {
        continue;
      }
      // "intense" appears in many Club de Nuit titles — only enforce when distinctive
      if (v === "intense" && !weHave) {
        // allow CDN Intense match only when our name includes intense
        penalty += 0.25;
        continue;
      }
      penalty += weHave || theyHave ? 0.45 : 0;
    }
  }

  return coverage - penalty;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VERONICA-MARK-catalog-image-matcher/1.0",
        Accept: "application/json",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function searchDscentsation(query: string): Promise<Candidate[]> {
  const url = `https://dscentsation.ng/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=8`;
  const data = (await fetchJson(url)) as {
    resources?: { results?: { products?: Array<{ title: string; url: string; image?: string; handle?: string }> } };
  } | null;
  const products = data?.resources?.results?.products ?? [];
  return products
    .filter((p) => p.image)
    .map((p) => ({
      source: "dscentsation" as const,
      title: p.title,
      handleOrUrl: p.url?.startsWith("http") ? p.url : `https://dscentsation.ng${p.url}`,
      imageUrl: p.image!.startsWith("//") ? `https:${p.image}` : p.image!,
      score: 0,
    }));
}

async function enrichDscentsationProduct(pageUrl: string): Promise<string | null> {
  // Prefer Shopify product JSON for full-size primary image
  const handle = pageUrl.split("/products/")[1]?.split(/[?#]/)[0];
  if (!handle) return null;
  const data = (await fetchJson(`https://dscentsation.ng/products/${handle}.json`)) as {
    product?: { image?: { src?: string }; images?: Array<{ src: string }> };
  } | null;
  return data?.product?.image?.src ?? data?.product?.images?.[0]?.src ?? null;
}

async function searchLabelStore(query: string): Promise<Candidate[]> {
  const url = `https://thelabelstores.com/wp-json/wc/store/v1/products?search=${encodeURIComponent(query)}&per_page=8`;
  const data = (await fetchJson(url)) as
    | Array<{ name: string; permalink: string; images?: Array<{ src: string }> }>
    | null;
  if (!Array.isArray(data)) return [];
  return data
    .filter((p) => p.images?.[0]?.src)
    .map((p) => ({
      source: "labelstore" as const,
      title: p.name,
      handleOrUrl: p.permalink,
      imageUrl: p.images![0]!.src,
      score: 0,
    }));
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  mkdirSync(join(dest, ".."), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "VERONICA-MARK-catalog-image-matcher/1.0" },
      redirect: "follow",
    });
    if (!res.ok || !res.body) return false;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("image") && !/\.(jpe?g|png|webp)(\?|$)/i.test(url)) return false;
    await pipeline(Readable.fromWeb(res.body as never), createWriteStream(dest));
    return existsSync(dest) && readFileSync(dest).byteLength > 8_000;
  } catch {
    return false;
  }
}

async function uploadToSupabase(localPath: string, storagePath: string, contentType: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "veronica-mark-media";
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.storage.from(bucket).upload(storagePath, readFileSync(localPath), {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return client.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

function buildQueries(slug: string, name: string): string[] {
  const overrides = QUERY_OVERRIDES[slug];
  if (overrides?.length) return overrides;
  // Strip size suffixes for search
  const cleaned = name
    .replace(/\d+\s*ml/gi, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\bMix\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return [cleaned, name];
}

async function bestCandidate(slug: string, name: string): Promise<Candidate | null> {
  const queries = buildQueries(slug, name);
  const all: Candidate[] = [];

  for (const q of queries) {
    const ds = await searchDscentsation(q);
    for (const c of ds) {
      c.score = scoreMatch(name, c.title);
      // Prefer dscentsation slightly
      c.score += 0.05;
      all.push(c);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  // Only hit Label Store if D'Scentsation is weak
  const topDs = all.filter((c) => c.source === "dscentsation").sort((a, b) => b.score - a.score)[0];
  if (!topDs || topDs.score < 0.62) {
    for (const q of queries.slice(0, 2)) {
      const ls = await searchLabelStore(q);
      for (const c of ls) {
        c.score = scoreMatch(name, c.title);
        all.push(c);
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  all.sort((a, b) => b.score - a.score);
  const best = all[0];
  if (!best || best.score < 0.62) return null;

  if (best.source === "dscentsation") {
    const hiRes = await enrichDscentsationProduct(best.handleOrUrl);
    if (hiRes) best.imageUrl = hiRes;
  }
  return best;
}

async function applyImage(slug: string, name: string, imageUrl: string, sourceTitle: string) {
  const ext = /\.png(\?|$)/i.test(imageUrl) ? "png" : /\.webp(\?|$)/i.test(imageUrl) ? "webp" : "jpg";
  const localDir = join(ROOT, slug);
  mkdirSync(localDir, { recursive: true });
  const localPath = join(localDir, `front.${ext}`);
  const oldJpg = join(localDir, "front.jpg");
  const oldPng = join(localDir, "front.png");

  const ok = await downloadImage(imageUrl, localPath);
  if (!ok) throw new Error(`download failed: ${imageUrl}`);

  if (ext !== "jpg" && existsSync(oldJpg)) unlinkSync(oldJpg);
  if (ext !== "png" && existsSync(oldPng)) unlinkSync(oldPng);

  const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const publicUrl = await uploadToSupabase(localPath, `products/${slug}/front.${ext}`, contentType);

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { media: { where: { deletedAt: null } } },
  });
  if (!product) throw new Error(`DB product missing: ${slug}`);

  if (product.media.length) {
    await prisma.productMedia.updateMany({
      where: { productId: product.id, deletedAt: null },
      data: { deletedAt: new Date(), isPrimary: false },
    });
  }

  await prisma.productMedia.create({
    data: {
      productId: product.id,
      url: publicUrl,
      altText: `${name} — ${sourceTitle}`.slice(0, 180),
      type: MediaType.IMAGE,
      sortOrder: 0,
      isPrimary: true,
    },
  });

  return publicUrl;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { name: "asc" },
  });

  const need = products.filter((p) => !p.media[0]?.url?.includes("supabase.co"));
  console.log(`Need images: ${need.length} / ${products.length}`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const report: string[] = [];

  for (const product of need.slice(0, LIMIT)) {
    process.stdout.write(`\n→ ${product.slug} … `);
    try {
      const match = await bestCandidate(product.slug, product.name);
      if (!match) {
        console.log("NO MATCH");
        skipped += 1;
        report.push(`SKIP\t${product.slug}\t${product.name}`);
        continue;
      }
      console.log(`[${match.source}] ${match.title} (score ${match.score.toFixed(2)})`);
      if (DRY) {
        report.push(`DRY\t${product.slug}\t${match.title}\t${match.imageUrl}`);
        updated += 1;
        continue;
      }
      const url = await applyImage(product.slug, product.name, match.imageUrl, match.title);
      console.log(`  saved ${url}`);
      report.push(`OK\t${product.slug}\t${match.title}`);
      updated += 1;
      await new Promise((r) => setTimeout(r, 400));
    } catch (error) {
      failed += 1;
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`FAIL ${msg}`);
      report.push(`FAIL\t${product.slug}\t${msg}`);
    }
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped} failed=${failed}`);
  console.log(report.join("\n"));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
  source: "dscentsation" | "labelstore" | "muna" | "fragrancesng" | "mkhasa";
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
  "ajwad-lattafa-perfume-100ml": ["lattafa ajwad", "ajwad edp"],
  "avanti-100ml-perfume": ["avanti perfume", "armaf avanti"],
  "nebras-lattafa-100ml": ["lattafa nebras"],
  "fakhar-lattafa-perfume-100ml": ["lattafa fakhar"],
  "angham-perfume-100ml": ["lattafa angham"],
  "khamrah-dukhan-100ml": ["lattafa khamrah dukhan"],
  "tamima-lattafa-100ml": ["lattafa tamima", "tamima"],
  "petra-lattafa-perfume-100ml": ["lattafa petra", "petra"],
  "sehr-lattafa-perfume": ["lattafa sehr", "sehr"],
  "qaed-al-fursan-perfume-90ml-white": ["qaed al fursan unlimited", "qaed al fursan white"],
  "qaed-al-fursan-perfume-black-90ml": ["qaed al fursan edp 90", "lattafa qaed al fursan"],
  "hayaati-black-perfume-lattafa": ["lattafa hayaati", "hayaati black"],
  "9pm-elixir-perfume-100ml": ["afnan 9pm elixir"],
  "9pm-rebel-perfume-100ml": ["afnan 9pm rebel", "9pm rebel"],
  "9am-pink-100ml": ["afnan 9am dive", "9am dive"],
  "9pm-deodorant": ["afnan 9pm deodorant", "9pm deodorant"],
  "club-de-nuit-intense-man-105ml": ["club de nuit intense for men", "club de nuit intense man"],
  "club-de-nuit-iconic-105ml": ["club de nuit iconic"],
  "ameer-al-oud-intense-oud-100ml": ["ameer al oudh intense", "ameer al oud intense oud"],
  "oud-for-glory-100ml-mix": ["oud for glory", "badee al oud"],
  "barakkat-perfume-mix-100ml": ["barakkat satin oud", "barakkat"],
  "eclaire-perfume-100ml-mix": ["lattafa eclaire"],
  "musaman-black-100ml": ["lattafa musamam", "musamam"],
  "vintage-radio-perfume-100ml": ["lattafa vintage radio", "vintage radio"],
  "rayhaan-tiger-100ml": ["rayhaan tiger"],
  "rayhaan-obsidian-perfume": ["rayhaan obsidian"],
  "rayhaan-nocturno-perfume-100ml": ["rayhaan nocturno"],
  "rayhaan-corium-100ml": ["rayhaan corium"],
  "floriana-rayhaan-100ml": ["rayhaan floriana", "floriana rayhaan"],
  "armaf-odyssey-body-spray-200ml": ["armaf odyssey"],
  "liquid-burn-perfume-100ml": ["liquid brun", "french avenue liquid brun"],
  "marshmallow-perfume-blush-paris-corner": ["paris corner marshmallow blush"],
  "riggs-perfume-100ml": ["riggs of london", "riggs perfume"],
  "saheb-70ml": ["lattafa saheb", "saheb"],
  "24-carrat-perfume-mix-100ml": ["lattafa 24 carat pure gold", "24 carat pure gold"],
  "vanilla-voyage-perfume": ["maison asrar vanilla voyage", "vanilla voyage"],
  "memories-man-perfume": ["fragrance world memories for men", "memories edp men"],
  "hayaati-blue-pink-perfume-100ml": ["lattafa hayaati florence", "hayaati florence"],
  "viking-perfume-115ml": ["abraaj viking", "fa paris viking"],
  "club-de-nuit-sillage-untold-mix": ["armaf club de nuit sillage"],
  "armaf-odyssey-body-spray-200ml": ["armaf odyssey body spray"],
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

  // Reject designer/luxury titles when our SKU is a generic/mix name
  const foreignLuxury =
    /(jo malone|guerlain|kurkdjian|maison francis|vertus|chanel|dior|ysl|yves saint|tom ford|creed|initio|parfums de marly|victoria'?s secret|la petite robe|burberry|jimmy choo|valentino|montale|dolce|gabbana|carolina herrera|bvlgari|bulgari|giorgio armani|michael kors|kenzo|byredo|louis vuitton|mugler)/i;
  if (foreignLuxury.test(theirTitle) && !foreignLuxury.test(ourName)) {
    penalty += 0.8;
  }
  // Generic weekend/man/my way names must not steal designer packshots
  if (/berries weekend/i.test(ourName) && /burberry/i.test(theirTitle)) penalty += 0.8;
  if (/breed my man/i.test(ourName) && /jimmy choo/i.test(theirTitle)) penalty += 0.8;
  if (/oud noir/i.test(ourName) && /valentino/i.test(theirTitle)) penalty += 0.8;
  if (/royal taboo/i.test(ourName) && /montale|royal aoud/i.test(theirTitle)) penalty += 0.8;
  if (/velvet oud/i.test(ourName) && /dolce|gabbana|desert oud/i.test(theirTitle)) penalty += 0.8;
  if (/my way perfume/i.test(ourName) && /giorgio armani/i.test(theirTitle)) penalty += 0.8;
  if (/viking/i.test(ourName) && /creed viking/i.test(theirTitle)) penalty += 0.8;
  // "Giorgio" alone must not match Giorgio Armani designer SKUs for a mix line
  if (/giorgio perfume mix/i.test(ourName) && /giorgio armani/i.test(theirTitle)) {
    penalty += 0.8;
  }
  if (/salt perfume/i.test(ourName) && /sea salt|jo malone/i.test(theirTitle)) {
    penalty += 0.8;
  }
  if (/silk mood/i.test(ourName) && /kurkdjian|oud silk mood/i.test(theirTitle)) {
    penalty += 0.8;
  }
  if (/velvet oud/i.test(ourName) && /maison oud/i.test(theirTitle)) {
    penalty += 0.5;
  }
  if (/intense noir/i.test(ourName) && /petite robe|guerlain/i.test(theirTitle)) {
    penalty += 0.8;
  }
  if (/victoria world/i.test(ourName) && /victoria'?s secret/i.test(theirTitle)) {
    penalty += 0.8;
  }
  // Afnan 9AM Dive is sold as "9AM Pink" in our catalog
  if (/9am pink/i.test(ourName) && /9am dive/i.test(theirTitle)) {
    penalty -= 0.35;
  }

  // Variant tokens must agree — don't assign Bourbon image to Black, etc.
  for (const v of VARIANT_TOKENS) {
    const weHave = ours.includes(v) || normalize(ourName).includes(v);
    const theyHave = theirSet.has(v) || normalize(theirTitle).includes(v);
    if (weHave !== theyHave) {
      if (v === "pink" && weHave && theirSet.has("dive") && /9am/i.test(ourName)) continue;
      if (v === "dive" && theyHave && ours.includes("pink") && /9am/i.test(ourName)) continue;
      // Classic Asad is the black bottle and often untitled as "black"
      if (v === "black" && weHave && !theyHave && !/(bourbon|elixir)/.test(normalize(theirTitle))) {
        continue;
      }
      // Qaed Al Fursan Unlimited is the white variant
      if (v === "white" && weHave && (theirSet.has("unlimited") || normalize(theirTitle).includes("unlimited"))) {
        continue;
      }
      if (v === "intense" && !weHave) {
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

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VERONICA-MARK/1.0)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function isFragranceTitle(title: string): boolean {
  return /(edp|edt|perfume|parfum|mist|spray|deodorant|cologne|fragrance|oud|eau de)/i.test(title);
}

async function searchMuna(query: string): Promise<Candidate[]> {
  const url = `https://munacosmetics.com/index.php?route=product/search&search=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);
  if (!html) return [];
  const links = [...html.matchAll(/class="name"\s*>\s*<a href="([^"]+)"[^>]*>([^<]+)<\/a>/gi)];
  const out: Candidate[] = [];
  for (const match of links.slice(0, 6)) {
    const href = match[1]!;
    const title = match[2]!.replace(/&amp;/g, "&").trim();
    if (!isFragranceTitle(title)) continue;
    const page = await fetchHtml(href.split("?")[0]!);
    if (!page) continue;
    const large =
      page.match(/data-largeimg="([^"]+)"/i)?.[1] ??
      [...page.matchAll(/https:\/\/munacosmetics\.com\/image\/cache\/catalog\/[^"'\s]+-1[056]00x1[056]00\.(?:jpe?g|png|webp)/gi)].map(
        (m) => m[0],
      )[0] ??
      page.match(/property="og:image"\s+content="([^"]+)"/i)?.[1];
    if (!large) continue;
    out.push({
      source: "muna",
      title,
      handleOrUrl: href,
      imageUrl: large.replace(/&amp;/g, "&"),
      score: 0,
    });
    await new Promise((r) => setTimeout(r, 150));
  }
  return out;
}

async function searchFragrancesNg(query: string): Promise<Candidate[]> {
  const url = `https://fragrances.com.ng/catalogsearch/result/?q=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);
  if (!html) return [];
  const items = [...html.matchAll(/<a class="product-item-link"[^>]*href="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/a>/gi)];
  const out: Candidate[] = [];
  for (const match of items.slice(0, 6)) {
    const href = match[1]!;
    const title = match[2]!.replace(/&amp;/g, "&").trim();
    if (!isFragranceTitle(title)) continue;
    // Prefer non gift-set pages when our product isn't a set
    if (/gift set/i.test(title) && !/gift|set|mix/i.test(query)) continue;
    const page = await fetchHtml(href);
    if (!page) continue;
    const og = page.match(/property="og:image"\s+content="([^"]+)"/i)?.[1];
    if (!og) continue;
    out.push({
      source: "fragrancesng",
      title,
      handleOrUrl: href,
      imageUrl: og,
      score: 0,
    });
    await new Promise((r) => setTimeout(r, 150));
  }
  return out;
}

/** Mkhasa product pages are SSR with GCS images — try known/guessed slugs. */
const MKHASA_DIRECT: Record<string, { slug: string; title: string }> = {
  "9am-pink-100ml": {
    slug: "afnan-9am-dive-eau-de-parfum-100ml",
    title: "Afnan 9am Dive Eau de Parfum 100ml",
  },
  "qissa-perfume-mix-100ml": {
    slug: "paris-corner-qissa-pink-eau-de-parfum-100ml",
    title: "Paris Corner Qissa Pink Eau de Parfum 100ml",
  },
};

async function searchMkhasa(ourSlug: string): Promise<Candidate[]> {
  const direct = MKHASA_DIRECT[ourSlug];
  if (!direct) return [];
  const html = await fetchHtml(`https://www.mkhasa.com/products/${direct.slug}`);
  if (!html) return [];
  const gcs = [...html.matchAll(/https:\/\/storage\.googleapis\.com\/mkhasa[^"'\\\s>]+/g)].map((m) =>
    m[0].replace(/&amp;/g, "&"),
  );
  const imageUrl = gcs.find((u) => /1\.(jpe?g|png|webp)/i.test(u)) ?? gcs[0];
  if (!imageUrl) return [];
  return [
    {
      source: "mkhasa",
      title: direct.title,
      handleOrUrl: `https://www.mkhasa.com/products/${direct.slug}`,
      imageUrl,
      score: 0,
    },
  ];
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  mkdirSync(join(dest, ".."), { recursive: true });
  try {
    // Encode spaces in path while keeping query string intact
    const safeUrl = url.includes("%") ? url : encodeURI(url);
    const res = await fetch(safeUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VERONICA-MARK/1.0)" },
      redirect: "follow",
    });
    if (!res.ok || !res.body) return false;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("image") && !/\.(jpe?g|png|webp)(\?|$)/i.test(url)) return false;
    await pipeline(Readable.fromWeb(res.body as never), createWriteStream(dest));
    return existsSync(dest) && readFileSync(dest).byteLength > 5_000;
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

  for (const q of queries.slice(0, 2)) {
    const ds = await searchDscentsation(q);
    for (const c of ds) {
      c.score = scoreMatch(name, c.title) + 0.05;
      all.push(c);
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  const top = () => all.slice().sort((a, b) => b.score - a.score)[0];
  if (!top() || top()!.score < 0.62) {
    for (const q of queries.slice(0, 2)) {
      const ls = await searchLabelStore(q);
      for (const c of ls) {
        c.score = scoreMatch(name, c.title);
        all.push(c);
      }
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  if (!top() || top()!.score < 0.62) {
    for (const q of queries.slice(0, 2)) {
      const muna = await searchMuna(q);
      for (const c of muna) {
        c.score = scoreMatch(name, c.title) + 0.03;
        all.push(c);
      }
    }
  }

  if (!top() || top()!.score < 0.62) {
    for (const q of queries.slice(0, 2)) {
      const fg = await searchFragrancesNg(q);
      for (const c of fg) {
        c.score = scoreMatch(name, c.title) + 0.02;
        all.push(c);
      }
    }
  }

  // Mkhasa curated / direct
  const mk = await searchMkhasa(slug);
  for (const c of mk) {
    c.score = scoreMatch(name, c.title) + 0.04;
    all.push(c);
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

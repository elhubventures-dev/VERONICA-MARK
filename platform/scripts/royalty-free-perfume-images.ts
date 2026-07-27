/**
 * Royalty-free perfume / beauty stills (Unsplash License).
 * Stand-in catalog imagery — not official brand bottle photography for our SKUs.
 * Drop your own shot at: public/media/products/<product-slug>/front.jpg
 */
export const PERFUME_IMAGE_IDS = [
  // Previously verified
  "1541643600914-78b084683601",
  "1594035910387-fea47794261f",
  "1592945403244-b3fbafd7f539",
  "1615634260167-c8cdede054de",
  "1611930022073-b7a4ba5fcccd",
  "1571781926291-c477ebfd024b",
  "1556228578-8c89e6adf883",
  "1612817288484-6f916006741a",
  "1522335789203-aabd1fc54bc9",
  "1596462502278-27bfdc403348",
  "1487412947147-5cebf100ffc2",
  "1571875257727-256c39da42af",
  "1556228720-195a672e8a03",
  "1509631179647-0177331693ae",
  // Fragrance search set (Unsplash)
  "1458538977777-0549b2370168",
  "1590736704728-f4730bb30770",
  "1622618991746-fe6004db3a47",
  "1547887537-6158d64c35b3",
  "1588514912908-8f5891714f8d",
  "1535683577427-740aaac4ec25",
  "1543422655-ac1c6ca993ed",
  "1595425959632-34f2822322ce",
  "1593487568720-92097fb460fb",
  "1723391962154-8a2b6299bc09",
  "1557170334-a9632e77c6e4",
  "1718466044521-d38654f3ba0a",
  "1705338670422-01133208eab9",
  "1621814374283-57cc5d0d39c2",
  "1763631403216-8d193008481e",
  "1774682060910-ba9a26f958ad",
  "1768025719875-48ed072f3084",
] as const;

export function unsplashUrl(photoId: string, width = 1200): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=85`;
}

export function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

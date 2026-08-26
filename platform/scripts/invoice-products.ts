/**
 * Perfume Invoice catalog (C-GLOBAL / PEE VEE).
 * S.O. 846 (1st) + S.O. 860 (2nd, 2026-07-31).
 * costPrice = invoice Rate (NGN). sellPrice = costPrice * 1.6 (60% markup). stock = Qty.
 */
export type InvoiceProduct = {
  name: string;
  qty: number;
  /** Purchase / wholesale cost (NGN). Optional when `sellPrice` is set. */
  costPrice?: number;
  /** Customer-facing selling price (NGN). Defaults to costPrice × 1.6. */
  sellPrice?: number;
  category: "perfume" | "body";
  /** Stable storefront slug when it must not follow slugify(name). */
  slug?: string;
  /** Stable SKU. Defaults to VM-INV-NNN from array order. */
  sku?: string;
  /** Invoice / barcode when available. */
  barcode?: string;
  shortDescription?: string;
  description?: string;
  /** Optional reference product image URL (official / retailer CDN). */
  imageUrl?: string;
};

export const INVOICE_PRODUCTS: InvoiceProduct[] = [
  { name: "Maahir Perfume", qty: 2, costPrice: 27000, category: "perfume" },
  { name: "Brulee Perfume", qty: 1, costPrice: 50500, category: "perfume" },
  { name: "Spectre Perfume Mix (French Avenue) 80ml", qty: 2, costPrice: 50000, category: "perfume" },
  { name: "Club De Nuit Limited Edition", qty: 2, costPrice: 103000, category: "perfume" },
  { name: "Oud For Glory 100ml Mix", qty: 4, costPrice: 27800, category: "perfume" },
  { name: "Ishq Al Shuyukh Gold Perfume 100ml", qty: 2, costPrice: 37500, category: "perfume" },
  { name: "Golden Bullet Top Gun Perfume 100ml", qty: 2, costPrice: 24000, category: "perfume" },
  { name: "Now Rave Perfume Mix 100ml", qty: 4, costPrice: 20400, category: "perfume" },
  { name: "Supremacy Collectors Edition 100ml", qty: 2, costPrice: 79000, category: "perfume" },
  { name: "Supremacy Perfume Not Only Intense 100ml", qty: 1, costPrice: 60000, category: "perfume" },
  { name: "Supremacy In Oud Perfume 100ml", qty: 1, costPrice: 62000, category: "perfume" },
  { name: "Club De Nuit Intense Man 105ml", qty: 2, costPrice: 44000, category: "perfume" },
  { name: "Club De Nuit Iconic 105ml", qty: 2, costPrice: 50000, category: "perfume" },
  { name: "Club De Nuit Sillage / Untold Mix", qty: 2, costPrice: 52000, category: "perfume" },
  { name: "Asad Bourbon Perfume 100ml", qty: 1, costPrice: 29000, category: "perfume" },
  { name: "Asad Black Lattafa 100ml", qty: 2, costPrice: 24500, category: "perfume" },
  { name: "Asad Elixir Perfume 100ml", qty: 2, costPrice: 24500, category: "perfume" },
  { name: "Breed Lovely Girl Perfume 100ml", qty: 1, costPrice: 25700, category: "perfume" },
  { name: "Breed My Man Perfume 100ml", qty: 1, costPrice: 33000, category: "perfume" },
  { name: "Breed Lovely Story Perfume 100ml", qty: 1, costPrice: 25700, category: "perfume" },
  { name: "Breed The Boss 100ml", qty: 1, costPrice: 29500, category: "perfume" },
  { name: "Vanilla Voyage Perfume", qty: 2, costPrice: 38000, category: "perfume" },
  { name: "Riggs Perfume 100ml", qty: 3, costPrice: 10300, category: "perfume" },
  { name: "Montwood Paris Perfume Mix 100ml", qty: 3, costPrice: 20200, category: "perfume" },
  { name: "Ajwad Lattafa Perfume 100ml", qty: 2, costPrice: 23000, category: "perfume" },
  { name: "Qaed Al Fursan Perfume 90ml White", qty: 1, costPrice: 14500, category: "perfume" },
  { name: "Qaed Al Fursan Perfume Black 90ml", qty: 1, costPrice: 20500, category: "perfume" },
  { name: "Addicted Silver Perfume 120ml", qty: 2, costPrice: 50000, category: "perfume" },
  { name: "Royal Taboo Perfume 100ml", qty: 2, costPrice: 62000, category: "perfume" },
  { name: "9PM Rebel Perfume 100ml", qty: 1, costPrice: 50000, category: "perfume" },
  { name: "9AM Pink 100ml", qty: 1, costPrice: 39000, category: "perfume" },
  { name: "9PM Elixir Perfume 100ml", qty: 1, costPrice: 50500, category: "perfume" },
  { name: "Giorgio Perfume Mix", qty: 2, costPrice: 14500, category: "perfume" },
  { name: "Liquid Burn Perfume 100ml", qty: 2, costPrice: 45600, category: "perfume" },
  { name: "Oud Touch Perfume Mix 100ml", qty: 2, costPrice: 30000, category: "perfume" },
  { name: "Musaman Black 100ml", qty: 2, costPrice: 39000, category: "perfume" },
  { name: "Eclaire Perfume 100ml Mix", qty: 2, costPrice: 28660, category: "perfume" },
  { name: "Dynasty Perfume 100ml", qty: 2, costPrice: 23500, category: "perfume" },
  { name: "Nebras Lattafa 100ml", qty: 2, costPrice: 38000, category: "perfume" },
  { name: "Pinnace Perfume 100ml", qty: 2, costPrice: 45750, category: "perfume" },
  { name: "Avanti 100ml Perfume", qty: 2, costPrice: 11800, category: "perfume" },
  { name: "Oud Noir Perfume 100ml", qty: 2, costPrice: 20600, category: "perfume" },
  { name: "Khamrah (Dukhan) 100ml", qty: 2, costPrice: 32000, category: "perfume" },
  { name: "Abraaj Valour Perfume 100ml", qty: 2, costPrice: 20300, category: "perfume" },
  { name: "Mocha Wood Perfume 100ml", qty: 2, costPrice: 28500, category: "perfume" },
  { name: "Oud Al Layl 100ml", qty: 2, costPrice: 11000, category: "perfume" },
  { name: "Al Faris Perfume 100ml", qty: 2, costPrice: 10800, category: "perfume" },
  { name: "Berries Weekend Perfume 100ml", qty: 2, costPrice: 14300, category: "perfume" },
  { name: "Opulent Perfume Dubai 100ml Mix", qty: 2, costPrice: 14800, category: "perfume" },
  { name: "Suave Perfume", qty: 2, costPrice: 14200, category: "perfume" },
  { name: "Floriana Rayhaan 100ml", qty: 1, costPrice: 25300, category: "perfume" },
  { name: "Rayhaan Obsidian Perfume", qty: 1, costPrice: 33000, category: "perfume" },
  { name: "Rayhaan Nocturno Perfume 100ml", qty: 1, costPrice: 23300, category: "perfume" },
  { name: "Rayhaan Corium 100ml", qty: 1, costPrice: 28500, category: "perfume" },
  { name: "Qissa Perfume Mix 100ml", qty: 2, costPrice: 17600, category: "perfume" },
  { name: "Salt Perfume 100ml", qty: 2, costPrice: 30000, category: "perfume" },
  { name: "Ameer Al Oud (Intense Oud) 100ml", qty: 2, costPrice: 22000, category: "perfume" },
  { name: "Saheb 70ml", qty: 2, costPrice: 21000, category: "perfume" },
  { name: "My Her Perfume 100ml", qty: 2, costPrice: 14000, category: "perfume" },
  { name: "Aventos Blue For Him Perfume", qty: 2, costPrice: 14000, category: "perfume" },
  { name: "Arabiyat Prestige Nyla Perfume 100ml", qty: 2, costPrice: 24000, category: "perfume" },
  { name: "Monsieur Intense Vanille 100ml", qty: 2, costPrice: 15500, category: "perfume" },
  { name: "Lamsat Harir 100ml Perfume", qty: 2, costPrice: 11000, category: "perfume" },
  { name: "Victoria Flower Orchid Perfume 100ml", qty: 2, costPrice: 16900, category: "perfume" },
  { name: "Oud Satin Perfume Mix 100ml", qty: 2, costPrice: 23250, category: "perfume" },
  { name: "Hayaati Blue / Pink Perfume 100ml", qty: 2, costPrice: 20500, category: "perfume" },
  { name: "Hayaati Black Perfume Lattafa", qty: 1, costPrice: 16500, category: "perfume" },
  { name: "My Way Perfume 100ml", qty: 2, costPrice: 160000, category: "perfume" },
  { name: "Petra Lattafa Perfume 100ml", qty: 2, costPrice: 30500, category: "perfume" },
  { name: "Intense Noir Perfume 100ml", qty: 2, costPrice: 21100, category: "perfume" },
  { name: "Rayhaan Tiger 100ml", qty: 2, costPrice: 35500, category: "perfume" },
  { name: "Yara Perfume 100ml", qty: 2, costPrice: 23000, category: "perfume" },
  { name: "Zara Man Perfume 100ml", qty: 2, costPrice: 14300, category: "perfume" },
  { name: "Amante Nocturno Perfume", qty: 2, costPrice: 50000, category: "perfume" },
  { name: "Tofy Caramel Perfume 100ml", qty: 2, costPrice: 11500, category: "perfume" },
  { name: "Marshmallow Perfume Blush (Paris Corner)", qty: 2, costPrice: 35000, category: "perfume" },
  { name: "Angham Perfume 100ml", qty: 2, costPrice: 26100, category: "perfume" },
  { name: "Ajayeb Dubai Perfume 100ml", qty: 2, costPrice: 17800, category: "perfume" },
  { name: "Vintage Radio Perfume 100ml", qty: 2, costPrice: 39800, category: "perfume" },
  { name: "Taskeen Perfume Mix 100ml", qty: 2, costPrice: 19000, category: "perfume" },
  { name: "Georgian's Legend Of Kleopatra 100ml", qty: 2, costPrice: 24000, category: "perfume" },
  {
    name: "Eclair Affair Perfume",
    qty: 2,
    costPrice: 44000,
    category: "perfume",
    slug: "eclaire-affair-perfume",
  },
  { name: "Barez Perfume 100ml", qty: 2, costPrice: 16000, category: "perfume" },
  { name: "Flower Garden Perfume", qty: 2, costPrice: 19000, category: "perfume" },
  { name: "Sugar Green", qty: 2, costPrice: 13500, category: "perfume" },
  { name: "Just Jack 1691 Perfume 100ml Mix", qty: 5, costPrice: 17000, category: "perfume" },
  { name: "Velvet Oud Perfume", qty: 2, costPrice: 20500, category: "perfume" },
  { name: "Qaeed Al Shabaab", qty: 2, costPrice: 21000, category: "perfume" },
  { name: "Tamima Lattafa 100ml", qty: 2, costPrice: 16000, category: "perfume" },
  { name: "Zul Perfume", qty: 2, costPrice: 24000, category: "perfume" },
  { name: "24 Carrat Perfume Mix 100ml", qty: 2, costPrice: 14900, category: "perfume" },
  { name: "Silk Mood Perfume 100ml", qty: 2, costPrice: 12500, category: "perfume" },
  { name: "Viking Perfume 115ml", qty: 2, costPrice: 11900, category: "perfume" },
  { name: "Sehr Lattafa Perfume", qty: 2, costPrice: 47000, category: "perfume" },
  { name: "Memories Man Perfume", qty: 2, costPrice: 17900, category: "perfume" },
  { name: "Confetti Perfume 100ml Mix", qty: 4, costPrice: 11000, category: "perfume" },
  { name: "Barakkat Perfume Mix 100ml", qty: 3, costPrice: 14200, category: "perfume" },
  { name: "Sugar Mummy / Sugar Pink Perfume 100ml", qty: 1, costPrice: 15500, category: "perfume" },
  { name: "Sugar Colours", qty: 2, costPrice: 14150, category: "perfume" },
  { name: "Genie Kaly Perfume 50ml", qty: 4, costPrice: 7300, category: "perfume" },
  { name: "Fakhar Lattafa Perfume 100ml", qty: 1, costPrice: 23000, category: "perfume" },
  { name: "Armaf Odyssey Body Spray 200ml", qty: 5, costPrice: 3370, category: "body" },
  {
    name: "Tesori D'oriente Spray",
    qty: 2,
    costPrice: 2700,
    category: "body",
    slug: "tesori-oriente-spray",
  },
  { name: "Lattafa Body Spray 200ml", qty: 6, costPrice: 2500, category: "body" },
  { name: "Victoria World Mist 250ml", qty: 6, costPrice: 3050, category: "body" },
  { name: "Pendora / Lomani Body Mist 236ml", qty: 4, costPrice: 5250, category: "body" },
  {
    name: "Secret Amour Body Mist",
    qty: 3,
    costPrice: 4100,
    category: "body",
    slug: "secrete-amour-body-mist",
  },
  { name: "Clive Dorris Mist 250ml", qty: 2, costPrice: 3900, category: "body" },
  { name: "9PM Deodorant", qty: 12, costPrice: 2750, category: "body" },
  { name: "House Of Kinz Spray", qty: 4, costPrice: 2900, category: "body" },
  { name: "Ossum Spray", qty: 4, costPrice: 3450, category: "body" },
  { name: "Bath & Body Works 236ml", qty: 6, costPrice: 5500, category: "body" },
  { name: "V.V Love Mist 250ml", qty: 6, costPrice: 3100, category: "body" },
  { name: "Nexegy Deodorant", qty: 12, costPrice: 2100, category: "body" },
  { name: "Cuba Mist 100ml", qty: 2, costPrice: 3000, category: "body" },
  { name: "Story Of Love Body Mist", qty: 6, costPrice: 3000, category: "body" },
  { name: "Brosia Body Spray", qty: 5, costPrice: 2600, category: "body" },
  { name: "Matelot Perfume 100ml", qty: 2, costPrice: 12100, category: "perfume" },
  { name: "Matelot Body Mist Mix 250ml", qty: 6, costPrice: 3600, category: "body" },
  { name: "My Dear Body Mist 250ml", qty: 4, costPrice: 3500, category: "body" },
  { name: "Monogotas Mist 100ml", qty: 12, costPrice: 1900, category: "body" },
  { name: "Betress Mist 100ml", qty: 12, costPrice: 2000, category: "body" },

  // ─── S.O. 860 (2nd invoice, 2026-07-31) — designer + niche restock ───
  {
    name: "Dior Sauvage Elixir 100ml",
    qty: 1,
    costPrice: 370000,
    category: "perfume",
    barcode: "6741121166",
    slug: "dior-sauvage-elixir-100ml",
    shortDescription: "Concentrated spicy-woody elixir — Dior’s most intense Sauvage.",
    description:
      "Dior Sauvage Elixir is a rich, highly concentrated interpretation of the Sauvage signature. Spicy, woody, and long-wearing — crafted for evening presence and cooler weather. 100ml.",
  },
  {
    name: "Emporio Armani Power Of You 90ml",
    qty: 1,
    costPrice: 198000,
    category: "perfume",
    barcode: "3614274752717",
    slug: "emporio-armani-power-of-you-90ml",
    shortDescription: "Passionfruit and frangipani over creamy Madagascar vanilla.",
    description:
      "Emporio Armani Power Of You is a floral-fruity gourmand eau de parfum. Top notes of passionfruit, bitter orange, and lemon open onto a radiant frangipani heart, settling into Madagascar vanilla, benzoin, and labdanum. 90ml.",
  },
  {
    name: "Chanel Coco Mademoiselle 200ml",
    qty: 1,
    costPrice: 520000,
    category: "perfume",
    barcode: "3145891166705",
    slug: "chanel-coco-mademoiselle-200ml",
    shortDescription: "Fresh oriental classic — orange, rose, and patchouli in a 200ml bottle.",
    description:
      "Chanel Coco Mademoiselle is a bright, modern oriental. Sparkling citrus and orange meet rose and jasmine over a patchouli-vetiver base. This 200ml eau de parfum is the generous house size for everyday luxury.",
  },
  {
    name: "Maison Crivelli Oud Maracuja 100ml",
    qty: 1,
    costPrice: 720000,
    category: "perfume",
    barcode: "3760394880240",
    slug: "maison-crivelli-oud-maracuja-100ml",
    shortDescription: "Passionfruit and oud extrait — Best Niche Fragrance 2024 (Fragrantica).",
    description:
      "Maison Crivelli Oud Maracujá is an extrait de parfum by Jordi Fernández. Luminous passionfruit, saffron, and Turkish rose contrast deep oud, benzoin, and patchouli over leather, vanilla, and amber. Exotic, woody, and addictive. 100ml.",
  },
  {
    name: "Gucci Intense Oud 90ml",
    qty: 1,
    costPrice: 137000,
    category: "perfume",
    barcode: "8005610328256",
    slug: "gucci-intense-oud-90ml",
    shortDescription: "Smoky amber-oud from Gucci’s Private Collection.",
    description:
      "Gucci Intense Oud is a deep amber-oud eau de parfum. Incense, leather, and woody notes wrap a rich oud heart for a bold, evening-leaning trail. 90ml.",
  },
  {
    name: "Chanel Allure Homme Sport",
    qty: 1,
    costPrice: 236000,
    category: "perfume",
    barcode: "3145891236309",
    slug: "chanel-allure-homme-sport",
    shortDescription: "Fresh aromatic sport — citrus, pepper, and tonka.",
    description:
      "Chanel Allure Homme Sport opens with sparkling citrus and mandarin, moves through pepper and cedar, and dries down to tonka and white musk. Clean, energetic, and versatile for day wear.",
  },
  {
    name: "Chanel Gabrielle 100ml",
    qty: 1,
    costPrice: 319000,
    category: "perfume",
    barcode: "3145891206302",
    slug: "chanel-gabrielle-100ml",
    shortDescription: "Solar white florals — jasmine, ylang-ylang, orange blossom, and tuberose.",
    description:
      "Chanel Gabrielle is a luminous white-floral eau de parfum built around four flowers: jasmine, ylang-ylang, orange blossom, and tuberose. Bright, feminine, and radiant. 100ml.",
  },
  {
    name: "Tom Ford Ombre Leather 100ml",
    qty: 1,
    costPrice: 214000,
    category: "perfume",
    barcode: "888066075145",
    slug: "tom-ford-ombre-leather-100ml",
    shortDescription: "Smooth leather, jasmine, and amber — Private Blend icon.",
    description:
      "Tom Ford Ombre Leather pairs white jasmine with a soft, wearable leather accord over amber and moss. Modern, sensual, and unisex-leaning. 100ml eau de parfum.",
  },
  {
    name: "Dior Sauvage 100ml",
    qty: 1,
    costPrice: 247000,
    category: "perfume",
    barcode: "3348901368247",
    slug: "dior-sauvage-100ml",
    shortDescription: "Bergamot and ambroxan — the modern masculine bestseller.",
    description:
      "Dior Sauvage is a fresh aromatic fougère. Calabrian bergamot and Sichuan pepper lead into ambroxan and cedar for a clean, powerful trail. 100ml eau de toilette.",
  },
  {
    name: "Valentino Uomo",
    qty: 1,
    costPrice: 154000,
    category: "perfume",
    barcode: "3614273790826",
    slug: "valentino-uomo",
    shortDescription: "Italian leather, myrtle, and coffee — refined masculine.",
    description:
      "Valentino Uomo is a warm, elegant masculine fragrance with myrtle and bergamot over coffee, hazelnut, and leather. Polished for day-to-evening wear.",
  },
  {
    name: "Giorgio Armani Acqua Di Gio",
    qty: 1,
    costPrice: 415000,
    category: "perfume",
    barcode: "3614270157639",
    slug: "giorgio-armani-acqua-di-gio",
    shortDescription: "Marine citrus classic — Mediterranean freshness.",
    description:
      "Giorgio Armani Acqua di Gio is the iconic aquatic-aromatic. Marine notes, citrus, and rosemary over cedar and patchouli. Clean, timeless summer signature.",
  },
  {
    name: "Dior Homme Intense 100ml",
    qty: 1,
    costPrice: 231000,
    category: "perfume",
    barcode: "3348900838185",
    slug: "dior-homme-intense-100ml",
    shortDescription: "Iris and cacao — powdery, sensual, evening-ready.",
    description:
      "Dior Homme Intense centers on iris with ambrette and Virginia cedar, finishing in vetiver and cacao. Elegant, powdery, and deeply masculine. 100ml eau de parfum.",
  },
  {
    name: "Bleu De Chanel 100ml",
    qty: 1,
    costPrice: 264000,
    category: "perfume",
    barcode: "3145891073607",
    slug: "bleu-de-chanel-100ml",
    shortDescription: "Woody aromatic — citrus, incense, and cedar.",
    description:
      "Bleu de Chanel is a woody-aromatic eau de parfum. Grapefruit and mint open into ginger, nutmeg, and jasmine over incense, sandalwood, and cedar. Versatile signature scent. 100ml.",
  },
  {
    name: "Chanel Allure Homme",
    qty: 1,
    costPrice: 235000,
    category: "perfume",
    barcode: "9624526495",
    slug: "chanel-allure-homme",
    shortDescription: "Fresh oriental — mandarin, pepper, vetiver, and vanilla.",
    description:
      "Chanel Allure Homme is a refined fresh oriental. Mandarin and fresh notes meet pepper and vetiver over sandalwood, tonka, and vanilla. Smooth and classic.",
  },
  {
    name: "Maison Crivelli Hibiscus Mahajad",
    qty: 1,
    costPrice: 495000,
    category: "perfume",
    barcode: "3770014898890",
    slug: "maison-crivelli-hibiscus-mahajad",
    shortDescription: "Hibiscus and rose extrait over leather and vanilla — Quentin Bisch.",
    description:
      "Maison Crivelli Hibiscus Mahajád is an extrait inspired by hibiscus tea in a gemstone market. Hibiscus and Damask rose with mint and cassis contrast leather, cinnamon, and vanilla absolute. Flamboyant and long-lasting.",
  },
  {
    name: "Lattafa Musamam White Intense 100ml",
    qty: 2,
    costPrice: 41300,
    category: "perfume",
    barcode: "6290360593159",
    slug: "lattafa-musamam-white-intense-100ml",
    shortDescription: "Creamy coconut-floral with bergamot, sandalwood, and musk.",
    description:
      "Lattafa Musamam White Intense (2023, Gaël Montero) opens with spices, bergamot, and orange, moves through coconut, ylang-ylang, and ambroxan, and settles into sandalwood, benzoin, and musk. Creamy, tropical, unisex. 100ml EDP.",
  },
  {
    name: "Ahmed Al Maghribi Ignite Oud 60ml",
    qty: 2,
    costPrice: 63000,
    category: "perfume",
    barcode: "6290360617244",
    slug: "ahmed-al-maghribi-ignite-oud-60ml",
    shortDescription: "Leather and geranium over patchouli, amber, and sandalwood.",
    description:
      "Ahmed Al Maghribi Ignite Oud (2024) is a bold oriental-woody eau de parfum. Leather and geranium open onto patchouli and cedar, with a smouldering base of moss, musk, amber, and sandalwood. 60ml.",
  },
  {
    name: "Assaf Tobacco Jam 10ml",
    qty: 2,
    costPrice: 71500,
    category: "perfume",
    barcode: "6287042405220",
    slug: "assaf-tobacco-jam-10ml",
    shortDescription: "Resinous tobacco extrait with saffron, suede, and vanilla.",
    description:
      "Assaf Tobacco Jam is an oriental-woody extrait built on tobacco, resins, pink pepper, and bergamot. Heart of papyrus, sandalwood, and rose; base of akigalawood, vanilla, suede, and saffron. Compact 10ml size.",
  },
  {
    name: "Rasasi Hawas Ice 100ml",
    qty: 2,
    costPrice: 44000,
    category: "perfume",
    barcode: "614514331040",
    slug: "rasasi-hawas-ice-100ml",
    shortDescription: "Cool aquatic twist on the Hawas DNA — fresh and projecting.",
    description:
      "Rasasi Hawas Ice is a fresh, icy take on the popular Hawas profile — aquatic-aromatic with strong projection and longevity. Ideal for warm weather and daytime wear. 100ml eau de parfum.",
  },
  {
    name: "Ahmed Al Maghribi Leather 50ml",
    qty: 2,
    costPrice: 31500,
    category: "perfume",
    barcode: "6290360610603",
    slug: "ahmed-al-maghribi-leather-50ml",
    shortDescription: "Raspberry-saffron leather with iris and suede.",
    description:
      "Ahmed Al Maghribi Leather is a vivid leather eau de parfum. Citrus and raspberry meet saffron and thyme, with iris and violet leaf over leather, suede, cedar, and amber woods. 50ml.",
  },
  {
    name: "Miss Dior 100ml",
    qty: 2,
    costPrice: 285000,
    category: "perfume",
    slug: "miss-dior-100ml",
    shortDescription: "Rose and peony — romantic floral signature from Dior.",
    description:
      "Miss Dior is a sparkling floral eau de parfum. Fresh peony and rose accents over a soft woody-musky base — romantic, feminine, and wearable day to night. 100ml.",
  },
  {
    name: "Atralia Elixir 100ml",
    qty: 2,
    costPrice: 41500,
    category: "perfume",
    barcode: "850051296378",
    slug: "atralia-elixir-100ml",
    shortDescription: "Mint, lavender, and pineapple over amber, vanilla, and tonka.",
    description:
      "Atralia Elixir (2024) is an oriental fougère eau de parfum. Mint, lavender, and bergamot open onto amber, benzoin, and pineapple, finishing with vanilla, tonka bean, and musk. Fresh yet warm. 100ml.",
  },
  {
    name: "Reef Pink Perfume",
    qty: 2,
    costPrice: 63000,
    category: "perfume",
    barcode: "RF148682",
    slug: "reef-pink-perfume",
    shortDescription: "Pear, amber, and sandalwood — sweet amber silk blend.",
    description:
      "Reef Pink (Reef Perfumes) opens with crisp pear, unfolds into amber, and settles on sandalwood. A sweet, fruity-floral amber for casual everyday wear.",
  },
  {
    name: "Reef 33 Perfume 100ml",
    qty: 2,
    costPrice: 63500,
    category: "perfume",
    barcode: "RP100033",
    slug: "reef-33-perfume-100ml",
    shortDescription: "Saffron, rosemary, and oud — Reef’s signature oriental woody.",
    description:
      "Reef 33 by Reef Perfumes (2020, Kevin Mathys) is an oriental woody eau de parfum. Indian saffron and aromatic rosemary over rich oud — spicy, smoky, and evening-ready. 100ml.",
  },
  {
    name: "Elizabeth Arden Red Door EDT 100ml For Women",
    qty: 10,
    sellPrice: 75000,
    category: "perfume",
    sku: "VM-EA-RED-DOOR-100",
    slug: "elizabeth-arden-red-door-edt-100ml",
    imageUrl: "/media/products/elizabeth-arden-red-door-edt-100ml/front.png",
    shortDescription:
      "Iconic chypre floral — red rose, orchid, and freesia over honey and sandalwood.",
    description:
      "Elizabeth Arden Red Door is the house’s signature eau de toilette, inspired by the famous Red Door Spa. An elegant chypre floral: ylang-ylang, rose, and a hint of fruit open onto orchid, jasmine, lily of the valley, Moroccan orange blossom, freesia, and wild violet. The dry-down is oakmoss, sandalwood, vetiver, honey, and musk — glamorous, classic, and made for day-to-evening wear. 100ml spray.",
  },
];

export const MARKUP_MULTIPLIER = 1.6;

export function sellPriceFromCost(costPrice: number): number {
  return Math.round(costPrice * MARKUP_MULTIPLIER * 100) / 100;
}

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

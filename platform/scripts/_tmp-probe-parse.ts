async function main() {
  const html = await (
    await fetch("https://munacosmetics.com/index.php?route=product/search&search=ajwad", {
      headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" },
    })
  ).text();

  // product cards
  const blocks = html.split(/class="product-thumb|class="product-layout/);
  console.log("blocks", blocks.length);
  const linkImg = [
    ...html.matchAll(
      /<a href="(https?:\/\/munacosmetics\.com\/[^"]+)"[^>]*>\s*<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi,
    ),
  ];
  console.log(
    "linkImg",
    linkImg.slice(0, 8).map((m) => ({ href: m[1], img: m[2], alt: m[3] })),
  );

  const fg = await (
    await fetch("https://fragrances.com.ng/catalogsearch/result/?q=liquid+brun", {
      headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" },
    })
  ).text();
  const fgItems = [
    ...fg.matchAll(/<a class="product-item-link"[^>]*href="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/a>/gi),
  ];
  console.log(
    "fg items",
    fgItems.slice(0, 8).map((m) => ({ href: m[1], name: m[2]?.trim() })),
  );

  const mk = await (
    await fetch("https://www.mkhasa.com/search?q=qissa", {
      headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" },
    })
  ).text();
  const mkProducts = [...mk.matchAll(/\/products\/([a-z0-9-]+)/gi)].map((m) => m[1]);
  console.log("mk products", [...new Set(mkProducts)].slice(0, 20));
  const mkNames = [...mk.matchAll(/"name"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  console.log("mk names", mkNames.slice(0, 15));
}

main().catch(console.error);

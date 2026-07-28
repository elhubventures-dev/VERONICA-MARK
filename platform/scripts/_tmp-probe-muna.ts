async function main() {
  const html = await (
    await fetch("https://munacosmetics.com/index.php?route=product/search&search=qaed", {
      headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" },
    })
  ).text();

  // Save a snippet around first perfume name
  const idx = html.toLowerCase().indexOf("qaed");
  console.log("idx", idx);
  console.log(html.slice(Math.max(0, idx - 400), idx + 600));

  const nameLinks = [
    ...html.matchAll(/class="name"\s*>\s*<a href="([^"]+)"[^>]*>([^<]+)<\/a>/gi),
  ];
  console.log(
    "\nnameLinks",
    nameLinks.slice(0, 10).map((m) => ({ href: m[1], name: m[2]?.replace(/&amp;/g, "&").trim() })),
  );

  // For each product page, get image
  if (nameLinks[0]) {
    const page = await (
      await fetch(nameLinks[0]![1]!, { headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" } })
    ).text();
    const og = page.match(/property="og:image"\s+content="([^"]+)"/i)?.[1];
    const mainImg = page.match(/<img[^>]+class="[^"]*main-image[^"]*"[^>]+src="([^"]+)"/i)?.[1];
    const zoom = page.match(/data-zoom-image="([^"]+)"/i)?.[1];
    console.log({ og, mainImg, zoom });
  }
}

main().catch(console.error);

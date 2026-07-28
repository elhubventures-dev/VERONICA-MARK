async function main() {
  const mkSearch = await fetch("https://www.mkhasa.com/search?q=ajwad", {
    headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" },
  });
  const mkHtml = await mkSearch.text();
  const nextData = mkHtml.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextData) {
    const json = JSON.parse(nextData[1]!);
    console.log("mk search pageProps keys", Object.keys(json.props?.pageProps ?? {}));
    console.log(JSON.stringify(json.props?.pageProps, null, 2).slice(0, 2500));
  } else {
    const hrefs = [...mkHtml.matchAll(/href="(\/products\/[^"]+)"/g)].map((m) => m[1]);
    console.log("mk product hrefs", [...new Set(hrefs)].slice(0, 15));
  }

  // Fragrances product page og:image
  const p = await fetch("https://fragrances.com.ng/lattafa-musamam-edp-100ml.html", {
    headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" },
  });
  const pHtml = await p.text();
  const og = pHtml.match(/property="og:image"\s+content="([^"]+)"/i)?.[1];
  console.log("musamam og", og);

  // Muna search
  for (const url of [
    "https://munacosmetics.com/index.php?route=product/search&search=lattafa",
    "https://munacosmetics.com/?route=product/search&search=ajwad",
    "https://munacosmetics.com/index.php?route=product/search&search=yara",
  ]) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 VERONICA-MARK/1.0" } });
    const html = await res.text();
    const titles = [...html.matchAll(/class="name"[^>]*>[\s\S]*?<a[^>]*>([^<]+)/gi)].map((m) =>
      m[1]?.trim(),
    );
    const imgs = [...html.matchAll(/image\/cache\/[^"'\s]+/g)].slice(0, 3);
    console.log("muna", res.status, url, "titles", titles.slice(0, 5), "imgs", imgs.length);
  }
}

main().catch(console.error);

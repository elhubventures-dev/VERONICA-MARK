import { absoluteUrl } from "@/lib/seo/metadata";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VERONICA MARK",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/vm-icon.svg"),
    description:
      "A luxury marketplace curating exceptional products from trusted brands. Curated for the Exceptional.",
    slogan: "Curated for the Exceptional.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VERONICA MARK",
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: StorefrontProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "EUR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

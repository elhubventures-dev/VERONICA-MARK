import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VERONICA MARK",
    short_name: "VERONICA MARK",
    description:
      "Curated for the Exceptional. Luxury managed-brand marketplace for premium perfumes and lifestyle collections.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8F4EC",
    theme_color: "#4B246A",
    icons: [
      {
        src: "/brand/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/pwa/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

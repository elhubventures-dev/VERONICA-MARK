/**
 * Brand Guidelines Volume VI — Photography & media standards brief
 * for uploads, PDP, campaigns, and social creatives.
 */

export type PhotographyRule = {
  id: string;
  title: string;
  body: string;
};

export const PHOTOGRAPHY_BRIEF_SUMMARY =
  "Luxury editorial style. Soft natural lighting. Minimal backgrounds. Neutral colour palette. High-resolution imagery. Focus on craftsmanship and product detail.";

export const PHOTOGRAPHY_RULES: PhotographyRule[] = [
  {
    id: "resolution",
    title: "Resolution & format",
    body: "Minimum 2000px on the long edge for hero/PDP. Prefer WebP/AVIF for web delivery; keep masters as high-quality PNG/JPEG or TIFF. Print assets at 300 DPI.",
  },
  {
    id: "lighting",
    title: "Lighting",
    body: "Soft, natural, or diffused studio light. Avoid harsh flash, heavy HDR, or neon colour casts that fight Royal Purple / Champagne Gold.",
  },
  {
    id: "background",
    title: "Backgrounds",
    body: "Minimal and quiet — cream, soft stone, charcoal, or gently textured surfaces. No cluttered props that compete with the product.",
  },
  {
    id: "composition",
    title: "Composition",
    body: "Premium framing with generous negative space. Showcase silhouette, material, and craftsmanship. Keep the product the clear hero.",
  },
  {
    id: "color",
    title: "Colour accuracy",
    body: "True-to-life product colour. Do not oversaturate. Align campaign overlays to official brand hex values only.",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    body: "Elegant real-life settings that feel aspirational and culturally inclusive — never caricatured luxury or price-led staging.",
  },
  {
    id: "video",
    title: "Video",
    body: "Cinematic, concise storytelling. Clean transitions, subtle motion, premium music. Quality over quantity.",
  },
  {
    id: "reject",
    title: "Do not upload",
    body: "Watermarked stock with competing brands, low-res phone snaps, heavy filters, bargain-style price callouts, or distorted logo treatments.",
  },
];

export const PHOTOGRAPHY_CHECKLIST = [
  "Long edge ≥ 2000px (hero/PDP) or ≥ 1080px (social crop)",
  "Soft lighting; no harsh flash",
  "Minimal / neutral background",
  "Product is sharp and colour-accurate",
  "No competing logos or watermarks",
  "No bargain/hype typography overlays",
] as const;

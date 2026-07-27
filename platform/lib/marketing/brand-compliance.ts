/**
 * Brand Guidelines Volume VI — Brand Compliance Checklist
 * Required before publishing any public campaign or creative.
 */

export type ComplianceItemId =
  | "logo"
  | "colors"
  | "typography"
  | "imagery"
  | "tone"
  | "messaging"
  | "legal"
  | "qa";

export type ComplianceItem = {
  id: ComplianceItemId;
  title: string;
  description: string;
  reference: string;
};

export const BRAND_COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: "logo",
    title: "Logo usage",
    description:
      "Approved lockup, icon, or monogram only. Clear space respected. No stretch, recolour, or busy backgrounds without contrast.",
    reference: "Vol II · LOGO.md",
  },
  {
    id: "colors",
    title: "Official colors",
    description:
      "Royal Purple #4B246A, Luxury Cream #F8F4EC, Charcoal #1A1A1A, Champagne Gold #C7A25A. Gold for premium accents only (~10%).",
    reference: "Vol II · COLORS.md",
  },
  {
    id: "typography",
    title: "Typography",
    description:
      "Playfair Display for display, Inter for UI/body, Manrope for supporting labels. Elegant spacing; restrained weight.",
    reference: "Vol II",
  },
  {
    id: "imagery",
    title: "Imagery",
    description:
      "Luxury editorial style: soft natural light, minimal backgrounds, high resolution, craftsmanship focus. Matches photography brief.",
    reference: "Vol VI · PHOTOGRAPHY_BRIEF.md",
  },
  {
    id: "tone",
    title: "Tone of voice",
    description:
      "Quiet confidence — refined, warm, knowledgeable. Never arrogant, exaggerated, or overly casual.",
    reference: "Vol III · VOICE.md",
  },
  {
    id: "messaging",
    title: "Messaging consistency",
    description:
      "Prefer: curated, exceptional, authentic, timeless, craftsmanship. Avoid: cheap, bargain, crazy sale, massive discount, best ever, lowest price.",
    reference: "Vol III",
  },
  {
    id: "legal",
    title: "Legal compliance",
    description:
      "Claims are accurate; trademarks respected; required disclosures present; NDAs/licensing followed for partner assets.",
    reference: "Vol VII",
  },
  {
    id: "qa",
    title: "Quality assurance",
    description:
      "Final proof on desktop and mobile. Spelling, links, CTAs, and asset resolution checked. Brand Management sign-off recorded.",
    reference: "Vol VI–VII",
  },
];

/** Words/phrases that should not appear in customer-facing campaign copy. */
export const CAMPAIGN_AVOID_PHRASES = [
  "cheap",
  "bargain",
  "crazy sale",
  "massive discount",
  "best ever",
  "lowest price",
] as const;

export const CAMPAIGN_PREFERRED_WORDS = [
  "curated",
  "exceptional",
  "authentic",
  "timeless",
  "craftsmanship",
  "refined",
  "premium",
  "exclusive",
  "elegant",
  "luxury",
] as const;

export const GOVERNANCE_NOTE =
  "The Brand Management Team must approve all public-facing campaigns, packaging, and partnerships before release (Volume VII).";

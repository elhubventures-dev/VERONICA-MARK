# Official Colors & Logo Color Analysis

**Status:** Confirmed — adopt Volume II flat hex as product tokens.  
**Logo masters:** `logo/VM_Logo.png`, `logo/VM_Logo1.png`, `logo/VM_Logo2.png`, `logo/VM_Logo3.png`  
**Sampled:** 2026-07-25 (resized raster analysis; metallic gold is a range, not one flat fill)

---

## 1. Official flat palette (Volume II — source of truth for UI)

| Role | Name | Hex | Digital role |
| ---- | ---- | --- | ------------ |
| Primary | Royal Purple | `#4B246A` | Brand chrome, primary buttons, key links, nav emphasis |
| Surface | Luxury Cream | `#F8F4EC` | Default light page background, soft panels |
| Neutral | Charcoal Black | `#1A1A1A` | Body text, strong neutrals, dark chrome |
| Accent | Champagne Gold | `#C7A25A` | Focus rings, premium highlights, dividers, luxury finishes |

### Logo-faithful brand panels (storefront chrome only)

These echo the textured purple field in `VM_Logo` / `VM_Logo1`. Do **not** use as body text or default page canvas.

| Role | Name | Hex | CSS token | Digital role |
| ---- | ---- | --- | --------- | ------------ |
| Brand deep | Logo vignette plum | `#2A002C` | `--color-brand-deep` | Hero/footer/page-banner bases & overlays |
| Brand field | Logo mid purple | `#3A013C` | `--color-brand-field` | Mid stops in brand gradients |
| Accent bright | Logo mid-gold gleam | `#EFB12E` | `--color-accent-bright` | Soft gold radial highlights only |

### Usage ratio (Volume II)

| Share | Color | Guidance |
| ----- | ----- | -------- |
| **~65%** | Luxury Cream | Dominant canvas — page backgrounds, breathing room |
| **~25%** | Royal Purple | Signature brand moments — CTAs, headers, selected states |
| **~10%** | Charcoal + Champagne Gold | Text hierarchy + premium accents only |

**Rules**

- Purple is the **signature** brand color — not every surface.
- Gold is **reserved** for premium highlights and luxury finishes — never flood large UI regions with gold.
- Prefer cream or white space around the logo; keep contrast strong on busy imagery.
- On dark editorial bands (hero, collections, footer), prefer **logo plum** overlays + **champagne/gold** CTAs — not generic pure black + white.

### White & supporting

| Role | Hex | Notes |
| ---- | --- | ----- |
| Pure white | `#FFFFFF` | Cards, elevated surfaces, text on purple |
| Dark mode canvas | `#121212` | Near-black page background (product convention; charcoal `#1A1A1A` for elevated surfaces) |

Semantic success / warning / error / info colors stay functional (not brand-defining); see design-system tokens.

---

## 2. What the logo files actually contain

The logo is a **3D metallic gold monogram** on a **deep purple** field (or black for the isolated icon). Flat UI tokens approximate that look; they do not try to reproduce every highlight in CSS.

### Asset roles

| File | Composition | Color story |
| ---- | ----------- | ----------- |
| `VM_Logo.png` | Full lockup: VM monogram + **VERONICA MARK** wordmark + hairline + star + **CURATED FOR THE EXCEPTIONAL** | Gold metal on deep royal purple, pebble/leather-like texture |
| `VM_Logo1.png` | Icon lockup: monogram only in rounded square | Same gold-on-purple treatment — primary app icon / avatar candidate |
| `VM_Logo2.png` | Isolated monogram | Gold metal on **solid black** — favicon / dark surfaces / emboss contexts |
| `VM_Logo3.png` | Additional approved variant | Magenta–violet field with soft lilac highlights |

Shared motifs across all three: interlocking **VM** serif monogram, small **four-pointed star** in the letter junction, high-contrast bevel lighting (light from upper-left).

### Purple as seen in the logo (not the flat token)

Raster sampling of the purple field (excluding near-white canvas) shows a **darker, more plum** purple than the Volume II flat swatch — intentional for embossed drama and texture:

| Zone | Approx hex | Notes |
| ---- | ---------- | ----- |
| Deepest vignette / corners | `#1B001C` → `#220023` | Near-black plum |
| Mid field | `#320134` → `#3A013C` | Core purple mass → `--color-brand-field` |
| Product deep token | `#2A002C` | `--color-brand-deep` for overlays |
| Lighter mid | `#4A024C` → `#510354` | Closer to Volume II `#4B246A` |
| Saturated edge (highlights) | `#6D0674` → `#7C0B7B` | Embossed field edges only |
| Official flat (UI) | `#4B246A` | Use this in CSS / print specs — readable, WCAG-friendlier as a solid |

**Product rule:** Use `#4B246A` for solid fills, buttons, and chrome. Use `#2A002C` / `#3A013C` for **hero gradients / textured brand panels** that echo the logo artwork — never as default body text color on cream.

### Gold as seen in the logo (metallic range)

Gold in the artwork is **not one hex**. It reads as polished metal:

| Zone | Approx hex | Use in product |
| ---- | ----------- | -------------- |
| Specular highlights | `#FEFDE2` → `#F9D36B` | Optional gradient stops; never body text |
| Bright mid-gold | `#EFB12E` → `#F2BE43` | `--color-accent-bright` gleam / illustration only |
| Official flat (UI) | `#C7A25A` | Buttons accents, rings, hairlines, badges |
| Burnished shadow | `#734F1A` → `#4A3210` | Illustration / 3D assets only |
| Near-black undercut | `#020000` → `#130A03` | Logo bevel depth only |

Gold (`#C7A25A`) on cream is **accent-only** — do not use for small body or eyebrow text (fails WCAG). Eyebrows on cream use Royal Purple. See [PHASE_F_QA.md](./PHASE_F_QA.md).

### Cream & charcoal relative to the logo

- **Luxury Cream `#F8F4EC`** does not dominate the logo PNGs (those are purple/black grounds). It is the **marketplace canvas** so gold+purple lockups sit on a calm, warm field.
- **Charcoal `#1A1A1A`** aligns with dark logo grounds and body copy; prefer it over pure `#000000` for long-form UI text. Pure black remains acceptable behind the isolated gold monogram (`VM_Logo2`).

---

## 3. Token mapping (target)

| Brand name | CSS custom property | Target value |
| ---------- | ------------------- | ------------ |
| Royal Purple | `--color-primary` | `#4B246A` |
| Text on purple | `--color-primary-foreground` | `#FFFFFF` |
| Luxury Cream | `--color-secondary` / `--color-background` | `#F8F4EC` |
| Champagne Gold | `--color-accent` / `--color-ring` | `#C7A25A` |
| Charcoal Black | `--color-neutral` / `--color-foreground` | `#1A1A1A` |
| Logo deep plum | `--color-brand-deep` | `#2A002C` |
| Logo mid purple | `--color-brand-field` | `#3A013C` |
| Logo gold gleam | `--color-accent-bright` | `#EFB12E` |

Implemented in `app/globals.css`.

### Legacy → official (delta)

| Role | Legacy (Stage 2) | Official (confirmed) |
| ---- | ---------------- | -------------------- |
| Purple | `#5B2E91` | `#4B246A` |
| Cream | `#F8F5EE` | `#F8F4EC` |
| Gold | `#C9A227` | `#C7A25A` |
| Black | `#111111` | `#1A1A1A` |

---

## 4. Contrast & accessibility notes

- Target **WCAG 2.2 AA** (Volume V).
- Purple `#4B246A` on white/cream: use for large UI chrome and **bold/large** text; verify normal-size text contrast before using purple as body copy.
- Gold `#C7A25A` on cream: accent only — do **not** use gold for small body text.
- Charcoal `#1A1A1A` on cream `#F8F4EC`: primary reading combination.
- Provide monochrome / single-color logo versions where required (Volume II).

---

## 5. Quality control (Volume IV)

Before publishing any external asset, verify against:

`#4B246A`, `#F8F4EC`, `#1A1A1A`, `#C7A25A`

plus logo panel tokens `#2A002C`, `#3A013C` where dark brand chrome is used,

plus typography, spacing, and logo clear-space rules in [LOGO.md](./LOGO.md).

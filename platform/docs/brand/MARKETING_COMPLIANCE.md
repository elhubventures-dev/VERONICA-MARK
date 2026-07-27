# Marketing Brand Compliance (Volume VI–VII)

**In product:** `/admin/marketing/brand-standards`  
**Checklist component:** `components/marketing/brand-compliance-checklist.tsx`  
**Source data:** `lib/marketing/brand-compliance.ts`

## Purpose

Every public campaign, creative, or promotional send must pass the Brand Compliance Checklist before release. This protects logo, colour, type, imagery, voice, messaging, legal, and QA standards.

## Checklist (8 items)

1. Logo usage  
2. Official colors  
3. Typography  
4. Imagery  
5. Tone of voice  
6. Messaging consistency  
7. Legal compliance  
8. Quality assurance + Brand Management sign-off  

## Where it appears

| Surface | Behaviour |
| ------- | --------- |
| Brand standards hub | Full checklist + preferred/avoid language |
| Email campaigns | Compact checklist before scheduling |
| Push notifications | Compact checklist before send |
| Campaign scheduling | Compact checklist before go-live |

Progress is stored per surface in `localStorage` (demo). Production should persist sign-off to the campaign record and audit log.

## Governance (Volume VII)

The Brand Management Team approves all public-facing campaigns, packaging, and partnerships before release. Maintain versioned approved assets; do not recreate or alter official marks.

## Related

- [VOICE.md](./VOICE.md)  
- [COLORS.md](./COLORS.md)  
- [LOGO.md](./LOGO.md)  
- [PHOTOGRAPHY_BRIEF.md](./PHOTOGRAPHY_BRIEF.md)  

---
name: veronica-mark
description: "Acts as the lead engineering + product team (architecture, frontend, backend, database, UX, design system, DevOps, QA) for VERONICA MARK, a luxury managed-brand marketplace (launch category: perfumes; future: fashion, clothing, shoes, bags, cosmetics, accessories) built on Next.js, React, TypeScript, Prisma, Neon PostgreSQL, Supabase Storage, Vercel, Auth.js, Paystack and SquadCo. Use this skill whenever the user is working on the VERONICA MARK project: building features, writing or reviewing code, designing or extending the Prisma schema, building UI components against the design system, planning sprints/roadmap, writing requirements, or asking any architectural, product, or UX question about that platform. Also trigger on mentions of 'VERONICA MARK', 'Veronica Mark marketplace', or its Customer/Brand Manager/Super Admin dashboards, even if the specific discipline (frontend/backend/db/etc.) isn't named. Do not use for unrelated e-commerce or marketplace projects."
---

# VERONICA MARK Project Skill

This skill turns Claude into the persistent product + engineering team for VERONICA MARK: a luxury managed-brand marketplace (perfumes at launch) built on Next.js + TypeScript + Prisma + Neon PostgreSQL + Supabase Storage + Vercel.

It does not replace Claude's normal identity or safety behavior — it's a working style and knowledge base to apply consistently to this one project, the way a real team would follow its own internal specs instead of generic marketplace conventions.

**Managed-brand marketplace, not a vendor marketplace.** Brands are curated and onboarded by VERONICA MARK itself — there is no vendor self-registration, and "Vendor" terminology should not appear in code or copy; use "Brand" / "Brand Manager" throughout.

## Project Knowledge Base

Full specs live in `references/`, organized as 7 volumes covering product through implementation:

| Volume | File | Covers |
|---|---|---|
| 1 | `references/01-requirements-srs.md` | Business objectives, scope, functional/non-functional requirements, roles |
| 2 | `references/02-ux-specification.md` | Information architecture, navigation, page layouts, journeys, dashboards |
| 3 | `references/03-design-system.md` | Colors, typography, spacing, components, themes, breakpoints (implementation-authoritative) |
| 4 | `references/04-technical-architecture.md` | Layered architecture, project structure, auth, API/server actions, security, deployment |
| 5 | `references/05-database-overview.md` | Narrative/conceptual database design across Users, Commerce, Marketing, Administration |
| 6 | `references/06-prisma-schema.md` | Actual Prisma `model`/`enum` code drafted so far — the implementation-level source of truth for the schema |
| 7 | `references/07-development-roadmap.md` | Sprint phases, CI/CD, release milestones |

Read the relevant volume(s) before generating code or making architectural recommendations — don't rely on memory of "typical" Next.js/marketplace conventions when this project has its own documented standards.

**Known gaps — do not paper over these:**
- **OrderStatus enum conflict.** SRS/UX describe an 11-state order flow; the Prisma draft only has 7 states (missing PACKED, OUT_FOR_DELIVERY, COMPLETED, REFUND_REQUESTED). Flag this and ask before implementing order-status logic.
- **Two parallel, unconnected RBAC mechanisms.** Part I's `User.role` enum (SUPER_ADMIN/BRAND_MANAGER/CUSTOMER) and Part IV's granular `Role`/`Permission`/`RolePermission` tables aren't wired together yet — no relation from `User` to `Role`. Ask which is authoritative (or whether one is additive fine-grained scoping on top of the other) before implementing permission checks. See references/06-prisma-schema.md for full detail.
- **CMS is thinner than the narrative describes** — no `CMSSection` (page-block composition) or dedicated admin `EmailTemplate`/`NotificationTemplate` models exist yet. Design these fresh if a task needs them.
- **Breakpoint sets differ slightly** between the UX spec (768/1024/1440) and the Design System (640/768/1024/1280/1536). The Design System volume is authoritative for actual Tailwind config.
- The full production schema is expected to reach **70–100 models**; what's in `references/06-prisma-schema.md` is a partial draft (Parts I–IV, now complete) to extend, not a finished schema.

When you hit a genuine gap or conflict beyond these, say so explicitly and ask the user or propose a sensible default — don't silently invent project "standards" that aren't in the docs.

## Working Modes

Determine the mode(s) needed from the request, and apply the relevant volume(s):

- Product/requirements question → Requirements Mode (Vol 1)
- UX/IA/page layout/journey → UX Mode (Vol 2)
- UI component, styling, theming → Design System Mode (Vol 3)
- Architecture, project structure, security, auth → Technical Architecture Mode (Vol 4)
- Database schema (conceptual) → Database Mode (Vol 5)
- Prisma code, migrations → Prisma Mode (Vol 6)
- Sprint planning, "what's next", release/CI-CD → Roadmap Mode (Vol 7)
- Feature request spanning layers → combine modes (e.g. "add flash sale badges to product cards" touches Vol 2 + 3 + 5/6 + 4)

## Decision Framework

For any non-trivial feature request, work through:

1. Understand the business/product requirement (check Vol 1 scope — is this in-scope? e.g. vendor self-registration, native apps, and a public REST API are explicitly OUT of scope).
2. Identify affected volumes/systems.
3. Check for conflicts with the known gaps/discrepancies above, or with anything already established earlier in the conversation.
4. Determine the working mode(s) needed.
5. Design the solution, staying consistent with the managed-brand model (RBAC scoping: Guest < Customer < Brand Manager [own brand only] < Super Admin [unrestricted]).
6. Generate the implementation.
7. Validate consistency against the relevant volume(s).
8. Recommend the next logical task per the roadmap (Vol 7) if relevant.

## Architecture Protection

Before creating anything new, check whether it already exists in `references/06-prisma-schema.md` or in code the user has shared in this conversation. Prefer reuse, refactor, extend, or compose over creating duplicate models, API routes, components, or business logic. In particular:
- Product variants, media, SEO, and inventory are intentionally **separate tables from Product** — don't collapse them back in.
- "Vendor" is not a concept in this project — it's "Brand" everywhere.

## File Management

When generating code, list every affected file, separated into: New files / Modified files / Deleted files / Moved files. Don't leave architectural changes implicit.

## Cross-Cutting Disciplines

Apply these regardless of which mode is active:

**Database** — schema changes need: schema review against Vol 5/6, relationship review, index review, migration, seed updates, `npx prisma format && npx prisma validate`, API review, frontend review, tests, docs. Never modify schema casually — this project targets 70–100 models, so consistency matters more than usual.

**API/Server Actions** — every endpoint or action needs: Zod validation, authentication, RBAC authorization scoped correctly (Brand Manager → own brand only), error handling, logging, tests.

**UI** — every screen needs: loading state, empty state, error state (Vol 2 §"Error States" gives the required list — empty cart, empty wishlist, no results, offline, payment failure, out-of-stock — each with a recovery action), responsive layout (breakpoints per Vol 3), accessibility (WCAG 2.2 AA), keyboard support, consistent typography/spacing per Vol 3 tokens.

**Business rules** — never implement UI without knowing the business rule behind it (e.g. tax/shipping calculation is server-side per Vol 4); never trust client-side price/total calculations — recompute server-side at checkout.

**Security** — authN/authZ, input validation, output sanitization, rate limiting, secure uploads (Supabase signed URLs), least privilege, sensitive data handling (payment references, wallet balances) on every feature.

**Performance** — bundle size, RSC vs client component boundaries, query efficiency, caching (Vol 4 caching strategy), pagination, image optimization, lazy loading, indexing (per Vol 5/6 index lists). Target Lighthouse >95.

**Testing** — completed features should have unit, integration, edge-case, validation, permission, and error-handling tests (scale to the size of the change).

**i18n** — this project supports 7 languages (EN/FR/AR/ES/HA/IG/YO — note AR needs RTL handling) and 4 currencies (NGN default, USD, GBP, EUR) with automatic regional switching. New user-facing copy/prices should account for this, not hardcode English or NGN.

**Documentation** — significant features should update relevant reference volumes' understanding and note any new discrepancies discovered.

## Response Format

For substantive engineering/product requests (new features, architectural changes, non-trivial bugs, schema changes), structure the response as:

1. Objective
2. Requirements Analysis (cite Vol 1/2 as relevant)
3. Architectural Impact (Vol 4/5/6)
4. Business Rules
5. Files Affected
6. Database / API / Frontend Changes (whichever apply)
7. Production Code
8. Testing Strategy
9. Security Considerations
10. Performance Considerations
11. Next Recommended Task (per Vol 7 roadmap)

For small, obvious requests (a typo fix, a one-line style tweak, a quick factual question about the spec), skip the full format and just answer directly.

## Code Quality Bar

Generate production-ready implementations: no pseudocode, no placeholder functions, no fake API/DB calls, no unrequested TODOs. Before finishing, check: is this consistent with the loaded volumes, reusable, secure, scalable, tested, maintainable, and true to the luxury/premium brand tone (Vol 2 UX Vision, Vol 3 Design System)? Would a senior engineer on a luxury e-commerce team approve it? If not, revise before responding.

## Project Continuity

Treat each conversation about VERONICA MARK as a continuation of the same project. Don't redesign previously established systems (schema, IA, design tokens) without clear justification — extend them. If the user's request would resolve one of the known gaps/discrepancies above (e.g. they hand you the real Part IV admin schema, or pick an OrderStatus resolution), treat that as updating the project's working assumptions for the rest of the conversation.

# Contributor Guide — VERONICA MARK

## Working agreement

This codebase follows the VERONICA MARK skill volumes:

1. Requirements (SRS)
2. UX Specification
3. Design System
4. Technical Architecture
5. Database Overview
6. Prisma Schema
7. Development Roadmap

Read the relevant volume before changing behavior. Prefer reuse over duplication. Never introduce “Vendor” terminology — use **Brand**.

## Branching

- `main` — production
- `develop` — integration
- `feature/*`, `fix/*`, `chore/*` — short-lived branches

Open PRs into `develop` (or `main` for hotfixes). CI must pass.

## Local setup

Follow [INSTALLATION.md](./INSTALLATION.md).

## Coding standards

See [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md).

## Commit hooks

Husky runs `lint-staged` on commit:

- ESLint fix for TS/TSX
- Prettier for supported files
- `prisma format` for schema changes

## Pull requests

Include:

1. Objective and linked requirement/UX notes
2. Files affected (new / modified / deleted)
3. Test plan (unit + manual paths)
4. Security notes for auth, payments, uploads
5. Any unresolved spec gaps you encountered

## Feature modules

Place new product capabilities under `features/<name>/` with co-located:

- `components/`
- `actions/`
- `schemas/`
- `types.ts`

Do not scatter feature logic only by file type.

## Database changes

1. Update `prisma/schema.prisma`
2. `pnpm db:validate`
3. Create migration via `pnpm db:migrate`
4. Update seed if needed
5. Update repositories/services/tests
6. Flag conflicts with known gaps (OrderStatus, dual RBAC, CMS)

## Security checklist (every PR)

- [ ] Zod validation on inputs
- [ ] AuthN + RBAC (Brand Manager = own brand only)
- [ ] No client-trusted prices/totals
- [ ] Secrets only via env
- [ ] Audit-worthy admin mutations logged (when admin features land)

## Testing expectations

Completed work should cover unit + permission + validation + error paths proportional to risk. E2E for critical journeys once commerce lands.

## Questions / gaps

If you hit a documented discrepancy (OrderStatus, RBAC wiring, CMS models), **stop and ask** — do not silently invent a standard.

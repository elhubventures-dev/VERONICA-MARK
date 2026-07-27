/**
 * Feature modules live here (Vol 4).
 * Each feature owns its UI, server actions, schemas, and feature-local types.
 *
 * Example (Phase 2+):
 * features/products/
 *   components/
 *   actions/
 *   schemas/
 *   types.ts
 *   index.ts
 */

export const FEATURE_MODULES = [
  "auth",
  "catalog",
  "cart",
  "checkout",
  "orders",
  "brands",
  "marketing",
  "admin",
  "account",
] as const;

export type FeatureModule = (typeof FEATURE_MODULES)[number];

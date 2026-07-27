"use server";

/**
 * Server-side cart sync stubs for future authenticated / guest session persistence.
 * Guest checkout uses client localStorage via CartProvider.
 */

export async function syncCartLines(_lines: unknown[]): Promise<{ ok: boolean }> {
  return { ok: true };
}

export async function mergeGuestCart(_sessionId: string): Promise<{ ok: boolean }> {
  return { ok: true };
}

export async function clearServerCart(_cartId: string): Promise<{ ok: boolean }> {
  return { ok: true };
}

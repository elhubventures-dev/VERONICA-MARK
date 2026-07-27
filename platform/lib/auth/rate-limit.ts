import "server-only";

import { AUTH_RATE_LIMITS, type AuthRateLimitAction } from "@/lib/auth/constants";
import { enforceRateLimit } from "@/lib/cache/redis";
import { RateLimitedError } from "@/lib/errors";
import { logger } from "@/lib/logger";

type Attempt = { timestamp: number };
const fallbackAttempts = new Map<string, Attempt[]>();
const MAX_FALLBACK_KEYS = 10_000;

function enforceFallback(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;
  const current = (fallbackAttempts.get(key) ?? []).filter((attempt) => attempt.timestamp > cutoff);

  if (current.length >= limit) {
    fallbackAttempts.set(key, current);
    return false;
  }

  current.push({ timestamp: now });
  fallbackAttempts.set(key, current);

  if (fallbackAttempts.size > MAX_FALLBACK_KEYS) {
    for (const [storedKey, attempts] of fallbackAttempts) {
      if (attempts.every((attempt) => attempt.timestamp <= cutoff)) {
        fallbackAttempts.delete(storedKey);
      }
    }
  }
  return true;
}

export async function assertAuthRateLimit(
  action: AuthRateLimitAction,
  identifier: string,
): Promise<void> {
  const config = AUTH_RATE_LIMITS[action];
  const normalizedIdentifier = identifier.trim().toLowerCase() || "unknown";
  const key = `auth:${action}:${normalizedIdentifier}`;

  try {
    const result = await enforceRateLimit(key, config);
    if (!result.success) {
      throw new RateLimitedError();
    }

    // The local window protects development and remains a safety net during Redis outages.
    if (!enforceFallback(key, config.limit, config.windowMs)) {
      throw new RateLimitedError();
    }
  } catch (error) {
    if (error instanceof RateLimitedError) {
      throw error;
    }
    logger.warn({ action, err: error }, "auth.rate_limit.redis_unavailable");
    if (!enforceFallback(key, config.limit, config.windowMs)) {
      throw new RateLimitedError();
    }
  }
}

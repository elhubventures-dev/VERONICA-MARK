import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

let redis: Redis | null = null;
let rateLimiter: Ratelimit | null = null;
const configuredRateLimiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (!env.server.UPSTASH_REDIS_REST_URL || !env.server.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: env.server.UPSTASH_REDIS_REST_URL,
      token: env.server.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}

export function getRateLimiter(): Ratelimit | null {
  const client = getRedis();
  if (!client) {
    return null;
  }

  if (!rateLimiter) {
    rateLimiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "veronica-mark:ratelimit",
    });
  }

  return rateLimiter;
}

export async function enforceRateLimit(
  identifier: string,
  options?: { limit: number; windowMs: number },
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const client = getRedis();
  let limiter = getRateLimiter();

  if (client && options) {
    const key = `${options.limit}:${options.windowMs}`;
    limiter = configuredRateLimiters.get(key) ?? null;
    if (!limiter) {
      limiter = new Ratelimit({
        redis: client,
        limiter: Ratelimit.slidingWindow(options.limit, `${options.windowMs} ms`),
        analytics: true,
        prefix: `veronica-mark:ratelimit:${key}`,
      });
      configuredRateLimiters.set(key, limiter);
    }
  }

  if (!limiter) {
    logger.debug({ identifier }, "rate_limit.skipped_no_redis");
    return { success: true, remaining: -1, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

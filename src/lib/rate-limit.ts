/**
 * Rate Limiting Library
 * Simple in-memory rate limiting (use Redis in production)
 */

import { NextRequest } from 'next/server';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory store (use Redis in production)
const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  window: number // seconds
): Promise<RateLimitResult> {
  const now = Date.now();
  const data = store.get(key);

  // Clean up if window expired
  if (data && now > data.resetAt) {
    store.delete(key);
  }

  const current = store.get(key);

  if (!current) {
    // First request in window
    store.set(key, {
      count: 1,
      resetAt: now + window * 1000,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + window * 1000,
    };
  }

  if (current.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: current.resetAt,
    };
  }

  // Increment count
  current.count++;

  return {
    success: true,
    limit,
    remaining: limit - current.count,
    reset: current.resetAt,
  };
}

export const rateLimit = {
  // 100 requests per minute
  check: async (
    request: NextRequest,
    key: string,
    limit: number = 100,
    window: number = 60
  ) => checkRateLimit(key, limit, window),

  // 10 requests per minute (strict)
  strict: async (request: NextRequest, key: string) =>
    checkRateLimit(key, 10, 60),

  // 20 requests per minute (auth)
  auth: async (request: NextRequest, key: string) =>
    checkRateLimit(key, 20, 60),
};

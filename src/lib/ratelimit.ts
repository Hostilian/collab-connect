import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Create a Redis instance
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

// Configure rate limiters for different endpoints
export const rateLimiters = {
  // API endpoints - 100 requests per 15 minutes
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '15 m'),
        analytics: true,
        prefix: '@ratelimit/api',
      })
    : null,

  // Authentication - 5 attempts per 15 minutes
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: '@ratelimit/auth',
      })
    : null,

  // Email sending - 3 emails per hour
  email: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: '@ratelimit/email',
      })
    : null,

  // Map queries - 300 requests per minute
  map: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(300, '1 m'),
        analytics: true,
        prefix: '@ratelimit/map',
      })
    : null,

  // File uploads - 10 uploads per hour
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
        analytics: true,
        prefix: '@ratelimit/upload',
      })
    : null,

  // Search queries - 60 requests per minute
  search: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '1 m'),
        analytics: true,
        prefix: '@ratelimit/search',
      })
    : null,
};

/**
 * Get client identifier for rate limiting
 */
export function getClientId(request: Request): string {
  // Try to get IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';

  return ip;
}

/**
 * Apply rate limiting to a request
 */
export async function rateLimit(
  request: Request,
  limiter: Ratelimit | null,
  identifier?: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending: Promise<unknown>;
}> {
  // If no rate limiter configured (e.g., development), allow all requests
  if (!limiter) {
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
      pending: Promise.resolve(),
    };
  }

  const clientId = identifier || getClientId(request);
  const result = await limiter.limit(clientId);

  return result;
}

/**
 * Create rate limit response headers
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number | Date
): HeadersInit {
  const resetDate = typeof reset === 'number' ? new Date(reset) : reset;

  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetDate.toISOString(),
  };
}

/**
 * Create a rate limit exceeded response
 */
export function createRateLimitResponse(limit: number, reset: Date) {
  const retryAfter = Math.ceil((reset.getTime() - Date.now()) / 1000)

  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      limit,
      remaining: 0,
      reset: reset.toISOString(),
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        ...getRateLimitHeaders(limit, 0, reset),
      },
    }
  )
}

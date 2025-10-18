import { Redis } from '@upstash/redis';

// Create Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

/**
 * Cache configuration for different data types
 */
export const cacheConfig = {
  // User profiles - 5 minutes
  userProfile: {
    ttl: 5 * 60,
    prefix: 'user:profile',
  },

  // Map users - 2 minutes (frequently updated)
  mapUsers: {
    ttl: 2 * 60,
    prefix: 'map:users',
  },

  // Search results - 10 minutes
  searchResults: {
    ttl: 10 * 60,
    prefix: 'search:results',
  },

  // User count - 30 minutes
  userCount: {
    ttl: 30 * 60,
    prefix: 'stats:users',
  },

  // Session data - 1 hour
  session: {
    ttl: 60 * 60,
    prefix: 'session',
  },
};

/**
 * Get data from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    console.warn('Redis not configured, cache disabled');
    return null;
  }

  try {
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set data in cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl?: number
): Promise<boolean> {
  if (!redis) {
    console.warn('Redis not configured, cache disabled');
    return false;
  }

  try {
    if (ttl) {
      await redis.setex(key, ttl, JSON.stringify(value));
    } else {
      await redis.set(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

/**
 * Delete data from cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  if (!redis) {
    return 0;
  }

  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;

    await redis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return 0;
  }
}

/**
 * Check if key exists in cache
 */
export async function hasCache(key: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Cache exists error:', error);
    return false;
  }
}

/**
 * Get or set cache (cache-aside pattern)
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const fresh = await fetcher();

  // Store in cache
  await setCache(key, fresh, ttl);

  return fresh;
}

/**
 * Cache invalidation helpers
 */
export const invalidateCache = {
  /**
   * Invalidate all user-related caches
   */
  user: async (userId: string) => {
    const pattern = `*:user:${userId}:*`;
    return deleteCachePattern(pattern);
  },

  /**
   * Invalidate user profile cache
   */
  userProfile: async (userId: string) => {
    const key = `${cacheConfig.userProfile.prefix}:${userId}`;
    return deleteCache(key);
  },

  /**
   * Invalidate map users cache
   */
  mapUsers: async () => {
    const pattern = `${cacheConfig.mapUsers.prefix}:*`;
    return deleteCachePattern(pattern);
  },

  /**
   * Invalidate search results cache
   */
  searchResults: async (query?: string) => {
    if (query) {
      const key = `${cacheConfig.searchResults.prefix}:${query}`;
      return deleteCache(key);
    }
    const pattern = `${cacheConfig.searchResults.prefix}:*`;
    return deleteCachePattern(pattern);
  },

  /**
   * Invalidate all caches
   */
  all: async () => {
    const pattern = '*';
    return deleteCachePattern(pattern);
  },
};

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(
  prefix: string,
  params: Record<string, unknown>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join(':');

  return `${prefix}:${sortedParams}`;
}

/**
 * Cached query wrapper for Prisma
 */
export async function cachedQuery<T>(
  cacheKey: string,
  ttl: number,
  query: () => Promise<T>
): Promise<T> {
  return getOrSetCache(cacheKey, query, ttl);
}

/**
 * Cache statistics
 */
export async function getCacheStats(): Promise<{
  isConfigured: boolean;
  keyCount?: number;
  memory?: string;
}> {
  if (!redis) {
    return { isConfigured: false };
  }

  try {
    const info = await redis.info();
    const keys = await redis.dbsize();

    return {
      isConfigured: true,
      keyCount: keys,
      memory: info,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { isConfigured: true };
  }
}

export { redis };

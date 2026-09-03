import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || ''
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ''

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})

/**
 * Cache helper to get or set a value in Redis with an optional TTL
 */
export async function getOrSetCache<T>(key: string, fetchFn: () => Promise<T>, ttlInSeconds?: number): Promise<T> {
  // If no Redis URL provided, gracefully fallback to fetching directly
  if (!redisUrl) {
    return fetchFn()
  }

  try {
    const cachedData = await redis.get<T>(key)
    if (cachedData !== null) {
      return cachedData
    }
  } catch (error) {
    console.warn(`Redis get error for key ${key}:`, error)
  }

  // Cache miss or error, fetch fresh data
  const data = await fetchFn()

  try {
    if (ttlInSeconds) {
      await redis.set(key, data, { ex: ttlInSeconds })
    } else {
      await redis.set(key, data)
    }
  } catch (error) {
    console.warn(`Redis set error for key ${key}:`, error)
  }

  return data
}

// Server-side only Redis client
// This file should only be imported from API routes (server-side)
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redis = null;

if (redisUrl) {
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) return null;
            return Math.min(times * 200, 1000);
        }
    });

    redis.on('error', (err) => {
        console.error('[Redis] Connection error:', err.message);
    });

    redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
    });
} else {
    console.warn('[Redis] REDIS_URL not defined. Caching disabled.');
}

export default redis;

/**
 * Get cached data or fetch from source
 */
export async function getOrFetch(key, fetcher, ttlSeconds = 3600) {
    if (!redis) {
        console.log('[Cache] Redis unavailable, calling API directly');
        return await fetcher();
    }

    try {
        const cached = await redis.get(key);
        if (cached) {
            console.log(`[Cache] HIT: ${key}`);
            return JSON.parse(cached);
        }

        console.log(`[Cache] MISS: ${key}`);
        const freshData = await fetcher();

        if (freshData && freshData.data && freshData.data.length > 0) {
            await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
            console.log(`[Cache] STORED: ${key} (TTL: ${ttlSeconds}s)`);
        }

        return freshData;
    } catch (error) {
        console.error('[Cache] Error:', error.message);
        return await fetcher();
    }
}

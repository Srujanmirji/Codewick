import Redis from 'ioredis';

// Connect to Railway Redis (or fallback to an empty string if missing)
const redis = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 3) return null; // stop retrying after 3 attempts
    return Math.min(times * 50, 2000);
  }
});

// Handle connection errors gracefully to prevent crashing
redis.on('error', (err) => {
  // console.warn('Redis connection error:', err.message);
});


export const redisCache = {
  // Get an item from Redis and parse it back to JSON
  get: async (key: string) => {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Redis Get Error:', error);
      return null;
    }
  },
  
  // Save an item to Redis as a string, expiring after ttlSeconds
  set: async (key: string, value: any, ttlSeconds: number = 60) => {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      console.error('Redis Set Error:', error);
    }
  },
  
  // Delete a specific key
  del: async (key: string) => {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis Del Error:', error);
    }
  },

  // Delete all keys that start with a specific prefix (e.g. 'marketplace:')
  delByPrefix: async (prefix: string) => {
    try {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis Prefix Del Error:', error);
    }
  }
};

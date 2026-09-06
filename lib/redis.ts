// Redis optional — app works without it in dev mode
let redis: { get: (k: string) => Promise<string | null>; set: (k: string, v: string, ...args: unknown[]) => Promise<void>; del: (k: string) => Promise<void>; incr: (k: string) => Promise<number>; expire: (k: string, s: number) => Promise<void> } | null = null;

// Global in-memory fallback (persists across Next.js compilation, route workers & HMR)
const globalForOTP = globalThis as unknown as {
  __buildEdge_memStore?: Map<string, { value: string; expiry?: number }>;
};

if (!globalForOTP.__buildEdge_memStore) {
  globalForOTP.__buildEdge_memStore = new Map();
}
const memStore = globalForOTP.__buildEdge_memStore;

function cleanKey(k: string): string {
  if (k.startsWith('otp:')) {
    const raw = k.slice(4);
    const digits = raw.replace(/\D/g, '').slice(-10);
    return `otp:${digits}`;
  }
  return k;
}

const mem = {
  get: async (k: string) => {
    const key = cleanKey(k);
    const item = memStore.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) { memStore.delete(key); return null; }
    return item.value;
  },
  set: async (k: string, v: string, ex?: string, ttl?: number) => {
    const key = cleanKey(k);
    memStore.set(key, { value: v, expiry: ttl ? Date.now() + ttl * 1000 : undefined });
  },
  del: async (k: string) => { 
    const key = cleanKey(k);
    memStore.delete(key); 
  },
  incr: async (k: string) => {
    const key = cleanKey(k);
    const cur = parseInt((await mem.get(key)) ?? '0') + 1;
    await mem.set(key, String(cur));
    return cur;
  },
  expire: async (k: string, s: number) => {
    const key = cleanKey(k);
    const item = memStore.get(key);
    if (item) memStore.set(key, { ...item, expiry: Date.now() + s * 1000 });
  },
};

try {
  if (process.env.REDIS_URL && process.env.REDIS_URL.trim() !== '') {
    const Redis = require('ioredis');
    const client = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 2000 });
    client.on('error', () => {
      // Suppress unhandled redis errors and fallback
    });
    redis = client;
  }
} catch {
  // Use in-memory fallback
}

const store = redis ?? mem;

export async function setOTP(phone: string, otp: string): Promise<void> {
  const normKey = cleanKey(`otp:${phone}`);
  // Always write to in-memory store immediately to guarantee availability across Next.js API routes
  await mem.set(normKey, otp, 'EX', 600); // 10 minutes expiry
  if (redis) {
    try {
      await redis.set(normKey, otp, 'EX', 600);
    } catch {
      // Fallback already saved in mem
    }
  }
}

export async function getOTP(phone: string): Promise<string | null> {
  const normKey = cleanKey(`otp:${phone}`);
  // Check in-memory first for zero-latency across route calls
  const memValue = await mem.get(normKey);
  if (memValue) return memValue;
  if (redis) {
    try {
      return await redis.get(normKey);
    } catch {
      return null;
    }
  }
  return null;
}

export async function deleteOTP(phone: string): Promise<void> {
  const normKey = cleanKey(`otp:${phone}`);
  await mem.del(normKey);
  if (redis) {
    try {
      await redis.del(normKey);
    } catch {}
  }
}
export async function setRefreshToken(userId: string, token: string): Promise<void> {
  try {
    await store.set(`refresh:${userId}`, token, 'EX', 30 * 24 * 60 * 60);
  } catch {
    await mem.set(`refresh:${userId}`, token, 'EX', 30 * 24 * 60 * 60);
  }
}
export async function getRefreshToken(userId: string): Promise<string | null> {
  try {
    return await store.get(`refresh:${userId}`);
  } catch {
    return await mem.get(`refresh:${userId}`);
  }
}
export async function deleteRefreshToken(userId: string): Promise<void> {
  try {
    await store.del(`refresh:${userId}`);
  } catch {
    await mem.del(`refresh:${userId}`);
  }
}
export async function checkRateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  try {
    const current = await store.incr(`rl:${key}`);
    if (current === 1) await store.expire(`rl:${key}`, windowSec);
    return current <= limit;
  } catch {
    const current = await mem.incr(`rl:${key}`);
    if (current === 1) await mem.expire(`rl:${key}`, windowSec);
    return current <= limit;
  }
}

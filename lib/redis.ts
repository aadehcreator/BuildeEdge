// Redis optional — app works without it in dev mode
let redis: { get: (k: string) => Promise<string | null>; set: (k: string, v: string, ...args: unknown[]) => Promise<void>; del: (k: string) => Promise<void>; incr: (k: string) => Promise<number>; expire: (k: string, s: number) => Promise<void> } | null = null;

// In-memory fallback (for dev without Redis)
const memStore = new Map<string, { value: string; expiry?: number }>();

const mem = {
  get: async (k: string) => {
    const item = memStore.get(k);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) { memStore.delete(k); return null; }
    return item.value;
  },
  set: async (k: string, v: string, ex?: string, ttl?: number) => {
    memStore.set(k, { value: v, expiry: ttl ? Date.now() + ttl * 1000 : undefined });
  },
  del: async (k: string) => { memStore.delete(k); },
  incr: async (k: string) => {
    const cur = parseInt((await mem.get(k)) ?? '0') + 1;
    await mem.set(k, String(cur));
    return cur;
  },
  expire: async (k: string, s: number) => {
    const item = memStore.get(k);
    if (item) memStore.set(k, { ...item, expiry: Date.now() + s * 1000 });
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
  try {
    await store.set(`otp:${phone}`, otp, 'EX', 300);
  } catch {
    await mem.set(`otp:${phone}`, otp, 'EX', 300);
  }
}
export async function getOTP(phone: string): Promise<string | null> {
  try {
    return await store.get(`otp:${phone}`);
  } catch {
    return await mem.get(`otp:${phone}`);
  }
}
export async function deleteOTP(phone: string): Promise<void> {
  try {
    await store.del(`otp:${phone}`);
  } catch {
    await mem.del(`otp:${phone}`);
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

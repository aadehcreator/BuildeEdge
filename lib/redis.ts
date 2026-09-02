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
  if (process.env.REDIS_URL) {
    const Redis = require('ioredis');
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 2000 });
  }
} catch {
  console.log('Redis not available — using in-memory fallback');
}

const store = redis ?? mem;

export async function setOTP(phone: string, otp: string): Promise<void> {
  await store.set(`otp:${phone}`, otp, 'EX', 300);
}
export async function getOTP(phone: string): Promise<string | null> {
  return store.get(`otp:${phone}`);
}
export async function deleteOTP(phone: string): Promise<void> {
  await store.del(`otp:${phone}`);
}
export async function setRefreshToken(userId: string, token: string): Promise<void> {
  await store.set(`refresh:${userId}`, token, 'EX', 30 * 24 * 60 * 60);
}
export async function getRefreshToken(userId: string): Promise<string | null> {
  return store.get(`refresh:${userId}`);
}
export async function deleteRefreshToken(userId: string): Promise<void> {
  await store.del(`refresh:${userId}`);
}
export async function checkRateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const current = await store.incr(`rl:${key}`);
  if (current === 1) await store.expire(`rl:${key}`, windowSec);
  return current <= limit;
}

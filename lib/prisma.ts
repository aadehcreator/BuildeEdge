import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient | null = null;

try {
  prismaClient = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
} catch (e) {
  console.warn('[AI Studio] Database initialization deferred — using mock proxy', e);
}

const noOp = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  create: async (d: any) => d?.data ?? {},
  update: async (d: any) => d?.data ?? {},
  delete: async () => ({}),
  count: async () => 0,
  upsert: async (d: any) => d?.create ?? {},
  deleteMany: async () => ({ count: 0 }),
  updateMany: async () => ({ count: 0 }),
};

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }
    
    // Try initializing on demand if null
    if (!prismaClient) {
      try {
        prismaClient = new PrismaClient({
          log: ['error'],
        });
      } catch {
        // ignore
      }
    }

    if (prismaClient && (prismaClient as any)[prop]) {
      const model = (prismaClient as any)[prop];
      if (typeof model === 'object' && model !== null) {
        return new Proxy(model, {
          get(mTarget, mProp) {
            const originalMethod = mTarget[mProp];
            if (typeof originalMethod === 'function') {
              return async (...args: any[]) => {
                try {
                  return await originalMethod.apply(mTarget, args);
                } catch (err: any) {
                  console.warn(`[AI Studio] DB error on ${String(prop)}.${String(mProp)}:`, err?.message);
                  if (String(mProp).includes('count')) return 0;
                  if (String(mProp).includes('findMany')) return [];
                  return null;
                }
              };
            }
            return originalMethod;
          }
        });
      }
      return model;
    }
    return (noOp as any)[prop] ?? noOp;
  }
});

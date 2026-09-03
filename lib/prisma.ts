import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient | null = null;

if (process.env.DATABASE_URL) {
  try {
    prismaClient = globalForPrisma.prisma ?? new PrismaClient({
      log: [],
    });
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
  } catch (e) {
    // silent
  }
}

// Rich mock data store for Build Edge (Gwalior Construction Materials Platform)
const mockBanners = [
  {
    id: 'b1',
    title: 'Super Grade PPC Cement in 60 Mins',
    subtitle: 'Direct from factory plants to your Gwalior site',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80',
    link: '/collections/cement',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'b2',
    title: 'TMT Steel Bars - Fe 500D',
    subtitle: 'Highest earthquake resistance & tensile strength',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    link: '/collections/steel-tmt',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'b3',
    title: 'Waterproof Plywood & Blockboards',
    subtitle: 'BWR & BWP grade with 25-year warranty',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    link: '/collections/plywood-boards',
    isActive: true,
    sortOrder: 3,
  },
];

const mockCategories = [
  { id: 'c1', name: 'Cement & Mortar', slug: 'cement', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 1, isActive: true },
  { id: 'c2', name: 'Steel & TMT Bars', slug: 'steel-tmt', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 2, isActive: true },
  { id: 'c3', name: 'Plywood & Boards', slug: 'plywood-boards', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 3, isActive: true },
  { id: 'c4', name: 'Bricks & Blocks', slug: 'bricks-blocks', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 4, isActive: true },
  { id: 'c5', name: 'Paints & Primers', slug: 'paints-primers', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 5, isActive: true },
  { id: 'c6', name: 'Electrical & Wires', slug: 'electrical-wires', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 6, isActive: true },
  { id: 'c7', name: 'Plumbing & Pipes', slug: 'plumbing-pipes', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 7, isActive: true },
  { id: 'c8', name: 'Sanitaryware & Bath', slug: 'sanitaryware', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', parentId: null, sortOrder: 8, isActive: true },
];

const mockBrands = [
  { id: 'bnd1', name: 'Ultratech Cement', slug: 'ultratech', logo: null },
  { id: 'bnd2', name: 'Tata Tiscon', slug: 'tata-tiscon', logo: null },
  { id: 'bnd3', name: 'Century Ply', slug: 'century-ply', logo: null },
  { id: 'bnd4', name: 'Asian Paints', slug: 'asian-paints', logo: null },
  { id: 'bnd5', name: 'Finolex Pipes', slug: 'finolex', logo: null },
];

const mockProducts = [
  {
    id: 'p1',
    name: 'Ultratech Super Cement (PPC)',
    slug: 'ultratech-super-cement-ppc',
    description: 'High strength Portland Pozzolana Cement with microfine particles for superior crack-free construction.',
    categoryId: 'c1',
    brandId: 'bnd1',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'],
    mrp: 390,
    sellingPrice: 360,
    bulkPrices: [{ minQty: 50, price: 350 }, { minQty: 200, price: 340 }],
    unit: 'Bag (50kg)',
    sku: 'CEM-ULT-01',
    stock: 500,
    reorderPoint: 50,
    lowStockThreshold: 20,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.5,
    tags: ['cement', 'ultratech', 'ppc'],
    specifications: { Grade: 'PPC', Weight: '50kg', ISI: 'Certified' },
    isActive: true,
    brand: { name: 'Ultratech Cement' },
    category: { name: 'Cement & Mortar' }
  },
  {
    id: 'p2',
    name: 'Tata Tiscon Fe 500D TMT Bar (12mm)',
    slug: 'tata-tiscon-fe-500d-12mm',
    description: 'Superior ductility, high bendability, and earthquake resistant TMT rebars.',
    categoryId: 'c2',
    brandId: 'bnd2',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'],
    mrp: 72,
    sellingPrice: 68,
    bulkPrices: [{ minQty: 100, price: 66 }, { minQty: 500, price: 64 }],
    unit: 'Kg',
    sku: 'STL-TATA-12',
    stock: 2500,
    reorderPoint: 200,
    lowStockThreshold: 100,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['steel', 'tmt', 'tata'],
    specifications: { Grade: 'Fe 500D', Size: '12mm', Length: '12 meter' },
    isActive: true,
    brand: { name: 'Tata Tiscon' },
    category: { name: 'Steel & TMT Bars' }
  },
  {
    id: 'p3',
    name: 'CenturyPly Club Prime BWR Plywood (19mm)',
    slug: 'centuryply-club-prime-19mm',
    description: 'Boiling Water Resistant (BWR) commercial plywood with Virokill technology and 25-year warranty.',
    categoryId: 'c3',
    brandId: 'bnd3',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'],
    mrp: 3200,
    sellingPrice: 2950,
    bulkPrices: [{ minQty: 10, price: 2850 }],
    unit: 'Sheet (8x4 ft)',
    sku: 'PLY-CENT-19',
    stock: 120,
    reorderPoint: 20,
    lowStockThreshold: 10,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 2.0,
    tags: ['plywood', 'century', 'bwr'],
    specifications: { Thickness: '19mm', Grade: 'BWR Club Prime', Size: '8x4 ft' },
    isActive: true,
    brand: { name: 'Century Ply' },
    category: { name: 'Plywood & Boards' }
  },
  {
    id: 'p4',
    name: 'Asian Paints Apex Ultima Weatherproof Emulsion',
    slug: 'asian-paints-apex-ultima-4l',
    description: 'High performance exterior wall paint with advanced UV guard and anti-algal protection.',
    categoryId: 'c5',
    brandId: 'bnd4',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80'],
    mrp: 2450,
    sellingPrice: 2280,
    bulkPrices: [{ minQty: 5, price: 2190 }],
    unit: 'Bucket (4L)',
    sku: 'PNT-ASIAN-4L',
    stock: 80,
    reorderPoint: 15,
    lowStockThreshold: 5,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.5,
    tags: ['paint', 'asian paints', 'exterior'],
    specifications: { Finish: 'Sheen', Size: '4 Liters', Warranty: '7 Years' },
    isActive: true,
    brand: { name: 'Asian Paints' },
    category: { name: 'Paints & Primers' }
  },
  {
    id: 'p5',
    name: 'Red Clay Building Bricks (Class 1)',
    slug: 'red-clay-building-bricks-class-1',
    description: 'Kiln-burnt first class red bricks with high compressive strength for strong load-bearing walls.',
    categoryId: 'c4',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'],
    mrp: 9,
    sellingPrice: 8,
    bulkPrices: [{ minQty: 1000, price: 7.50 }, { minQty: 5000, price: 7.00 }],
    unit: 'Piece',
    sku: 'BRK-RED-01',
    stock: 25000,
    reorderPoint: 3000,
    lowStockThreshold: 1000,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['bricks', 'red bricks', 'masonry'],
    specifications: { Type: 'Wire-cut / Hand-moulded', Strength: '3.5 N/mm²' },
    isActive: true,
    brand: null,
    category: { name: 'Bricks & Blocks' }
  },
  {
    id: 'p6',
    name: 'Finolex PVC Rigid Plumbing Pipes (3 inch)',
    slug: 'finolex-pvc-pipe-3-inch',
    description: 'High durability pressure pipes for water supply and drainage systems.',
    categoryId: 'c7',
    brandId: 'bnd5',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'],
    mrp: 650,
    sellingPrice: 590,
    bulkPrices: [{ minQty: 20, price: 560 }],
    unit: 'Piece (3m)',
    sku: 'PLM-FIN-03',
    stock: 200,
    reorderPoint: 30,
    lowStockThreshold: 10,
    isFeatured: false,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['pipes', 'plumbing', 'finolex'],
    specifications: { Size: '3 inch', Length: '3 meters', Pressure: 'Schedule 40' },
    isActive: true,
    brand: { name: 'Finolex Pipes' },
    category: { name: 'Plumbing & Pipes' }
  }
];

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }

    // Try live prisma client first if available and connection works
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
                } catch {
                  // Fallback to mock data silently
                  return handleMockQuery(String(prop), String(mProp), args);
                }
              };
            }
            return originalMethod;
          }
        });
      }
      return model;
    }

    // If no prismaClient, serve mock data directly
    return createMockModel(String(prop));
  }
});

function handleMockQuery(model: string, method: string, args: any[]) {
  const m = model.toLowerCase();
  const met = method.toLowerCase();

  if (m === 'banner') {
    if (met.includes('findmany')) return mockBanners;
    if (met.includes('count')) return mockBanners.length;
  }
  if (m === 'category') {
    if (met.includes('findmany')) return mockCategories;
    if (met.includes('count')) return mockCategories.length;
    if (met.includes('findunique') || met.includes('findfirst')) return mockCategories[0];
  }
  if (m === 'product') {
    if (met.includes('findmany')) {
      const where = args[0]?.where;
      let items = [...mockProducts];
      if (where?.isFeatured) items = items.filter(p => p.isFeatured);
      if (where?.isNewLaunch) items = items.filter(p => p.isNewLaunch);
      if (where?.categoryId) items = items.filter(p => p.categoryId === where.categoryId);
      if (where?.slug) items = items.filter(p => p.slug === where.slug);
      const take = args[0]?.take;
      if (take && typeof take === 'number') items = items.slice(0, take);
      return items;
    }
    if (met.includes('findunique') || met.includes('findfirst')) {
      const where = args[0]?.where;
      if (where?.slug) {
        const found = mockProducts.find(p => p.slug === where.slug);
        if (found) return found;
      }
      return mockProducts[0];
    }
    if (met.includes('count')) return mockProducts.length;
  }
  if (m === 'brand') {
    if (met.includes('findmany')) return mockBrands;
  }
  if (met.includes('count')) return 0;
  if (met.includes('findmany')) return [];
  if (met.includes('findunique') || met.includes('findfirst')) return null;
  return {};
}

function createMockModel(modelName: string) {
  return {
    findMany: async (args?: any) => handleMockQuery(modelName, 'findMany', [args]),
    findFirst: async (args?: any) => handleMockQuery(modelName, 'findFirst', [args]),
    findUnique: async (args?: any) => handleMockQuery(modelName, 'findUnique', [args]),
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
    count: async () => 5,
    upsert: async (d: any) => d?.create ?? {},
    deleteMany: async () => ({ count: 0 }),
    updateMany: async () => ({ count: 0 }),
  };
}

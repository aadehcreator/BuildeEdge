const { PrismaClient } = require('../src/generated/prisma');

type PrismaClientType = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };

let prismaClient: PrismaClientType | null = null;

if (process.env.DATABASE_URL) {
  try {
    prismaClient = globalForPrisma.prisma ?? new PrismaClient({
      log: [],
    });
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
  } catch {
    // Database connection fallback
  }
}

// ── Minimal real-world data only; keep local image files, remove dummy catalog noise ─
export const mockBanners = [
  {
    id: 'b1',
    title: 'Cement & Site Delivery',
    subtitle: 'Fast delivery for residential and commercial construction work.',
    image: '/images/slider/reta1.jpg',
    link: '/collections/cement',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'b2',
    title: 'TMT Steel Supply',
    subtitle: 'Strong steel bars for slabs, beams, and structural strength.',
    image: '/images/slider/tmt.webp',
    link: '/collections/steel-tmt',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'b3',
    title: 'Sand & Gitti',
    subtitle: 'Verified material supply for concrete, plaster, and foundations.',
    image: '/images/slider/reta.webp',
    link: '/collections/sand-aggregates',
    isActive: true,
    sortOrder: 3,
  },
];

export const mockCategories = [
  {
    id: 'c1',
    name: 'Cement',
    slug: 'cement',
    image: '/images/slider/reta1.jpg',
    parentId: null,
    sortOrder: 1,
    isActive: true,
    children: [
      { id: 'c1-1', name: 'OPC 53 Grade', slug: 'cement', image: '/images/slider/reta1.jpg' },
    ],
    _count: { products: 1 },
  },
  {
    id: 'c2',
    name: 'Steel & TMT',
    slug: 'steel-tmt',
    image: '/images/slider/tmt.webp',
    parentId: null,
    sortOrder: 2,
    isActive: true,
    children: [
      { id: 'c2-1', name: 'TMT Bars', slug: 'steel-tmt', image: '/images/slider/tmt.webp' },
    ],
    _count: { products: 1 },
  },
  {
    id: 'c3',
    name: 'Bricks & Blocks',
    slug: 'bricks-blocks',
    image: '/images/slider/gitti1.webp',
    parentId: null,
    sortOrder: 3,
    isActive: true,
    children: [
      { id: 'c3-1', name: 'Red Bricks', slug: 'bricks-blocks', image: '/images/slider/gitti1.webp' },
    ],
    _count: { products: 1 },
  },
  {
    id: 'c4',
    name: 'Sand & Aggregates',
    slug: 'sand-aggregates',
    image: '/images/slider/reta.webp',
    parentId: null,
    sortOrder: 4,
    isActive: true,
    children: [
      { id: 'c4-1', name: 'River Sand', slug: 'sand-aggregates', image: '/images/slider/reta.webp' },
    ],
    _count: { products: 1 },
  },
];

export const mockBrands = [
  { id: 'bnd1', name: 'UltraTech', slug: 'ultratech', logo: '/images/slider/reta1.jpg' },
  { id: 'bnd2', name: 'Tata Tiscon', slug: 'tata-tiscon', logo: '/images/slider/tmt.webp' },
  { id: 'bnd3', name: 'Gwalior Bricks', slug: 'gwalior-bricks', logo: '/images/slider/gitti1.webp' },
  { id: 'bnd4', name: 'River Sand Co.', slug: 'river-sand-co', logo: '/images/slider/reta.webp' },
];

export const mockProducts = [
  {
    id: 'p1',
    name: 'UltraTech Cement PPC',
    slug: 'ultratech-cement-ppc',
    description: 'Premium cement for foundations, masonry and plaster work.',
    categoryId: 'c1',
    brandId: 'bnd1',
    vendorId: null,
    images: ['/images/slider/reta1.jpg'],
    mrp: 380,
    sellingPrice: 365,
    bulkPrices: [{ minQty: 50, price: 350 }],
    unit: 'Bag (50kg)',
    sku: 'CEM-001',
    stock: 500,
    reorderPoint: 50,
    lowStockThreshold: 20,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.5,
    tags: ['cement', 'ultratech'],
    specifications: { Grade: 'PPC', Weight: '50kg' },
    isActive: true,
    brand: { name: 'UltraTech', slug: 'ultratech' },
    category: { name: 'Cement', slug: 'cement' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Tata Tiscon TMT Bar',
    slug: 'tata-tiscon-tmt-bar',
    description: 'High-strength TMT bars for slabs, beams and column reinforcement.',
    categoryId: 'c2',
    brandId: 'bnd2',
    vendorId: null,
    images: ['/images/slider/tmt.webp'],
    mrp: 72,
    sellingPrice: 68,
    bulkPrices: [{ minQty: 100, price: 66 }],
    unit: 'Kg',
    sku: 'TMT-001',
    stock: 2500,
    reorderPoint: 200,
    lowStockThreshold: 100,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['steel', 'tmt'],
    specifications: { Grade: 'Fe 500D', Size: '12mm' },
    isActive: true,
    brand: { name: 'Tata Tiscon', slug: 'tata-tiscon' },
    category: { name: 'Steel & TMT', slug: 'steel-tmt' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Red Clay Bricks',
    slug: 'red-clay-bricks',
    description: 'Strong brick blocks for walls and boundary construction work.',
    categoryId: 'c3',
    brandId: 'bnd3',
    vendorId: null,
    images: ['/images/slider/gitti1.webp'],
    mrp: 10,
    sellingPrice: 8.5,
    bulkPrices: [{ minQty: 1000, price: 8.2 }],
    unit: 'Piece',
    sku: 'BRK-001',
    stock: 20000,
    reorderPoint: 5000,
    lowStockThreshold: 2000,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['bricks', 'construction'],
    specifications: { Type: 'Class 1', Size: '9x4x3 inch' },
    isActive: true,
    brand: { name: 'Gwalior Bricks', slug: 'gwalior-bricks' },
    category: { name: 'Bricks & Blocks', slug: 'bricks-blocks' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'River Sand Trolley',
    slug: 'river-sand-trolley',
    description: 'Clean river sand for plaster, concrete mix, and finishing work.',
    categoryId: 'c4',
    brandId: 'bnd4',
    vendorId: null,
    images: ['/images/slider/reta.webp'],
    mrp: 4100,
    sellingPrice: 3800,
    bulkPrices: [{ minQty: 2, price: 3600 }],
    unit: 'Trolley (100 Cu.Ft)',
    sku: 'SND-001',
    stock: 50,
    reorderPoint: 10,
    lowStockThreshold: 4,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['sand', 'river'],
    specifications: { Purpose: 'Plaster & concrete', Type: 'River Sand' },
    isActive: true,
    brand: { name: 'River Sand Co.', slug: 'river-sand-co' },
    category: { name: 'Sand & Aggregates', slug: 'sand-aggregates' },
    createdAt: '2026-03-04T00:00:00Z',
  },
];

// ── In-Memory Persistent Store for Real User Actions ─────────────────────────
interface StoredUser {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  wallet?: { balance: number };
}

interface StoredAddress {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

interface StoredOrderItem {
  id?: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  unit: string;
  mrp?: number;
}

interface StoredOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  cashback: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  deliveredAt: string | null;
  estimatedAt: string | null;
  notes: string | null;
  addressSnapshot: Record<string, any>;
  items: StoredOrderItem[];
}

interface StoredWallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    note: string | null;
    orderId: string | null;
    createdAt: string;
  }>;
}

export interface StoredVendorProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  gstin?: string | null;
  pan?: string | null;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  bankName?: string | null;
  accountNumber?: string | null;
  ifsc?: string | null;
  description?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  isActive: boolean;
  commissionPct: number;
  totalSales: number;
  totalOrders: number;
  createdAt: string;
  user?: {
    phone: string;
    email: string | null;
    createdAt: string;
  };
  _count?: {
    products: number;
    vendorOrders: number;
  };
}

const memoryUsers: StoredUser[] = [
  {
    id: 'usr_admin',
    phone: '9999999999',
    name: 'Admin',
    email: 'admin@buildedge.in',
    avatar: null,
    role: 'ADMIN',
    isVerified: true,
    wallet: { balance: 0 },
  },
  {
    id: 'usr_8109585179',
    phone: '8109585179',
    name: 'HomeRun Support Admin',
    email: 'aadeshgwl89@gmail.com',
    avatar: null,
    role: 'ADMIN',
    isVerified: true,
    wallet: { balance: 0 },
  },
  {
    id: 'usr_9111111111',
    phone: '9111111111',
    name: 'Sharma Building Materials',
    email: 'sharma@buildedge.in',
    avatar: null,
    role: 'VENDOR',
    isVerified: true,
    wallet: { balance: 0 },
  },
];

const memoryVendorProfiles: StoredVendorProfile[] = [
  {
    id: 'vp_sharma',
    userId: 'usr_9111111111',
    businessName: 'Sharma Building Materials',
    businessType: 'Distributor',
    gstin: '23ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    address: 'Shop No 12, Padav Market, Near Railway Station',
    city: 'Gwalior',
    pincode: '474001',
    phone: '9111111111',
    email: 'sharma@buildedge.in',
    status: 'APPROVED',
    isActive: true,
    commissionPct: 8,
    totalSales: 185000,
    totalOrders: 42,
    createdAt: new Date().toISOString(),
    description: 'Leading distributor of UltraTech, ACC cement and TMT steel in Gwalior since 1995.',
    user: {
      phone: '9111111111',
      email: 'sharma@buildedge.in',
      createdAt: new Date().toISOString(),
    },
    _count: {
      products: 12,
      vendorOrders: 42,
    },
  },
];

const memoryAddresses: StoredAddress[] = [];
const memoryOrders: StoredOrder[] = [];
const memoryWallets: Record<string, StoredWallet> = {};
const memoryCarts: Record<string, any> = {};

function filterProducts(where: any) {
  let items = [...mockProducts];
  if (!where) return items;

  if (where.isActive !== undefined) {
    items = items.filter((p) => p.isActive === where.isActive);
  }
  if (where.isFeatured) {
    items = items.filter((p) => p.isFeatured);
  }
  if (where.isNewLaunch) {
    items = items.filter((p) => p.isNewLaunch);
  }
  if (where.categoryId) {
    items = items.filter((p) => p.categoryId === where.categoryId || p.category?.slug === where.categoryId);
  }
  if (where.slug) {
    items = items.filter((p) => p.slug === where.slug);
  }
  if (where.id) {
    items = items.filter((p) => p.id === where.id);
  }

  // Handle category slug in OR or nested
  if (where.OR && Array.isArray(where.OR)) {
    const catCondition = where.OR.find((c: any) => c?.category?.slug || c?.category?.parent?.slug);
    if (catCondition) {
      const catSlug = catCondition?.category?.slug || catCondition?.category?.parent?.slug;
      items = items.filter((p) => p.category?.slug === catSlug || p.categoryId === catSlug);
    }
    const searchCondition = where.OR.find((c: any) => c?.name?.contains || c?.description?.contains || c?.tags?.has);
    if (searchCondition) {
      const q = (searchCondition?.name?.contains || searchCondition?.description?.contains || searchCondition?.tags?.has || '').toLowerCase();
      if (q) {
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags?.some((t: string) => t.toLowerCase().includes(q))
        );
      }
    }
  }

  if (where.category?.slug) {
    items = items.filter((p) => p.category?.slug === where.category.slug || p.categoryId === where.category.slug);
  }
  if (where.brand?.slug) {
    items = items.filter((p) => p.brand?.slug === where.brand.slug || p.brandId === where.brand.slug);
  }
  if (where.sellingPrice) {
    if (where.sellingPrice.gte !== undefined) items = items.filter((p) => p.sellingPrice >= where.sellingPrice.gte);
    if (where.sellingPrice.lte !== undefined) items = items.filter((p) => p.sellingPrice <= where.sellingPrice.lte);
  }

  return items;
}

function handleMockQuery(model: string, method: string, args: any[]) {
  const m = model.toLowerCase();
  const met = method.toLowerCase();
  const where = args[0]?.where;

  // ── BANNER ──
  if (m === 'banner') {
    if (met.includes('findmany')) return mockBanners;
    if (met.includes('count')) return mockBanners.length;
  }

  // ── CATEGORY ──
  if (m === 'category') {
    if (met.includes('findmany')) return mockCategories;
    if (met.includes('count')) return mockCategories.length;
    if (met.includes('findunique') || met.includes('findfirst')) {
      if (where?.slug) return mockCategories.find((c) => c.slug === where.slug) ?? null;
      if (where?.id) return mockCategories.find((c) => c.id === where.id) ?? null;
      return mockCategories[0];
    }
  }

  // ── PRODUCT ──
  if (m === 'product') {
    if (met.includes('findmany')) {
      let items = filterProducts(where);
      const orderBy = args[0]?.orderBy;
      if (orderBy?.sellingPrice === 'asc') items.sort((a, b) => a.sellingPrice - b.sellingPrice);
      else if (orderBy?.sellingPrice === 'desc') items.sort((a, b) => b.sellingPrice - a.sellingPrice);
      else if (orderBy?.name === 'asc') items.sort((a, b) => a.name.localeCompare(b.name));
      const skip = args[0]?.skip ?? 0;
      const take = args[0]?.take;
      if (skip > 0) items = items.slice(skip);
      if (take && typeof take === 'number') items = items.slice(0, take);
      return items;
    }
    if (met.includes('findunique') || met.includes('findfirst')) {
      if (where?.slug) return mockProducts.find((p) => p.slug === where.slug) ?? null;
      if (where?.id) return mockProducts.find((p) => p.id === where.id) ?? null;
      return mockProducts[0];
    }
    if (met.includes('count')) {
      return filterProducts(where).length;
    }
  }

  // ── BRAND ──
  if (m === 'brand') {
    if (met.includes('findmany')) return mockBrands;
    if (met.includes('findunique') || met.includes('findfirst')) {
      if (where?.slug) return mockBrands.find((b) => b.slug === where.slug) ?? null;
      if (where?.id) return mockBrands.find((b) => b.id === where.id) ?? null;
      return mockBrands[0];
    }
  }

  // ── ADDRESS ──
  if (m === 'address') {
    if (met.includes('findmany')) {
      const uId = where?.userId;
      const list = uId ? memoryAddresses.filter((a) => a.userId === uId) : memoryAddresses;
      return [...list].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
    }
    if (met.includes('findfirst') || met.includes('findunique')) {
      if (where?.id) return memoryAddresses.find((a) => a.id === where.id && (!where.userId || a.userId === where.userId)) ?? null;
      return memoryAddresses[0] ?? null;
    }
    if (met.includes('count')) {
      const uId = where?.userId;
      return uId ? memoryAddresses.filter((a) => a.userId === uId).length : memoryAddresses.length;
    }
  }

  // ── ORDER ──
  if (m === 'order') {
    if (met.includes('findmany')) {
      const uId = where?.userId;
      let list = uId ? memoryOrders.filter((o) => o.userId === uId) : memoryOrders;
      const skip = args[0]?.skip ?? 0;
      const take = args[0]?.take ?? 10;
      return list.slice(skip, skip + take);
    }
    if (met.includes('findunique') || met.includes('findfirst')) {
      if (where?.id) return memoryOrders.find((o) => o.id === where.id) ?? null;
      return memoryOrders[0] ?? null;
    }
    if (met.includes('count')) {
      const uId = where?.userId;
      return uId ? memoryOrders.filter((o) => o.userId === uId).length : memoryOrders.length;
    }
  }

  // ── WALLET ──
  if (m === 'wallet') {
    if (met.includes('findunique') || met.includes('findfirst')) {
      const uId = where?.userId;
      if (uId && memoryWallets[uId]) return memoryWallets[uId];
      return { id: `w_${uId || 'default'}`, userId: uId, balance: 0, transactions: [] };
    }
  }

  // ── USER ──
  if (m === 'user') {
    if (met.includes('findunique') || met.includes('findfirst')) {
      if (where?.phone) {
        const found = memoryUsers.find((u) => u.phone === where.phone);
        if (found) return found;
      }
      if (where?.id) {
        const found = memoryUsers.find((u) => u.id === where.id);
        if (found) return found;
      }
      return null;
    }
    if (met.includes('findmany')) {
      return memoryUsers;
    }
  }

  // ── VENDOR PROFILE ──
  if (m === 'vendorprofile') {
    if (met.includes('findmany')) {
      let list = [...memoryVendorProfiles];
      if (where?.status && where.status !== 'ALL') {
        list = list.filter((v) => v.status === where.status);
      }
      if (where?.isActive !== undefined) {
        list = list.filter((v) => v.isActive === where.isActive);
      }
      const skip = args[0]?.skip ?? 0;
      const take = args[0]?.take ?? 50;
      return list.slice(skip, skip + take);
    }
    if (met.includes('findunique') || met.includes('findfirst')) {
      if (where?.id) {
        return memoryVendorProfiles.find((v) => v.id === where.id) ?? null;
      }
      if (where?.userId) {
        const found = memoryVendorProfiles.find((v) => v.userId === where.userId);
        if (!found) return null;
        if (where.isActive !== undefined && found.isActive !== where.isActive) return null;
        if (where.status && found.status !== where.status) return null;
        return found;
      }
      return memoryVendorProfiles[0] ?? null;
    }
    if (met.includes('count')) {
      let list = [...memoryVendorProfiles];
      if (where?.status && where.status !== 'ALL') {
        list = list.filter((v) => v.status === where.status);
      }
      return list.length;
    }
  }

  // ── CART ──
  if (m === 'cart') {
    if (met.includes('findunique') || met.includes('findfirst')) {
      const uId = where?.userId;
      if (uId && memoryCarts[uId]) return memoryCarts[uId];
      return { id: `cart_${uId}`, userId: uId, items: [] };
    }
  }

  if (met.includes('count')) return 0;
  if (met.includes('findmany')) return [];
  if (met.includes('findunique') || met.includes('findfirst')) return null;
  return {};
}

function createMockModel(modelName: string) {
  const m = modelName.toLowerCase();

  return {
    findMany: async (args?: any) => handleMockQuery(modelName, 'findMany', [args]),
    findFirst: async (args?: any) => handleMockQuery(modelName, 'findFirst', [args]),
    findUnique: async (args?: any) => handleMockQuery(modelName, 'findUnique', [args]),
    count: async (args?: any) => handleMockQuery(modelName, 'count', [args]),

    create: async (d: any) => {
      const data = d?.data ?? {};
      const newId = data.id ?? `${m}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      if (m === 'address') {
        const newAddress: StoredAddress = {
          id: newId,
          userId: data.userId,
          name: data.name,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 ?? null,
          landmark: data.landmark ?? null,
          city: data.city || 'Gwalior',
          state: data.state || 'Madhya Pradesh',
          pincode: data.pincode,
          isDefault: Boolean(data.isDefault),
          createdAt: new Date().toISOString(),
        };
        if (newAddress.isDefault) {
          for (const a of memoryAddresses) {
            if (a.userId === data.userId) a.isDefault = false;
          }
        }
        memoryAddresses.unshift(newAddress);
        return newAddress;
      }

      if (m === 'order') {
        const orderNumber = `HR-${Date.now().toString().slice(-6)}`;
        const items = (data.items?.create ?? []).map((it: any) => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          productName: it.productName,
          productImage: it.productImage,
          quantity: it.quantity,
          price: it.price,
          unit: it.unit,
        }));
        const newOrder: StoredOrder = {
          id: newId,
          orderNumber,
          userId: data.userId,
          status: 'PLACED',
          total: data.total,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee ?? 0,
          discount: data.discount ?? 0,
          cashback: data.cashback ?? 0,
          paymentMethod: data.paymentMethod ?? 'COD',
          paymentStatus: data.paymentStatus ?? 'PENDING',
          createdAt: new Date().toISOString(),
          deliveredAt: null,
          estimatedAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          notes: data.notes ?? null,
          addressSnapshot: data.addressSnapshot ?? {},
          items,
        };
        memoryOrders.unshift(newOrder);

        // Credit cashback if any
        if (data.cashback && data.cashback > 0) {
          const userWallet = memoryWallets[data.userId] ?? {
            id: `w_${data.userId}`,
            userId: data.userId,
            balance: 0,
            transactions: [],
          };
          userWallet.balance += data.cashback;
          userWallet.transactions.unshift({
            id: `tx_${Date.now()}`,
            amount: data.cashback,
            type: 'CREDIT',
            note: `Cashback for order #${orderNumber}`,
            orderId: newId,
            createdAt: new Date().toISOString(),
          });
          memoryWallets[data.userId] = userWallet;
        }

        return newOrder;
      }

      if (m === 'wallet') {
        const newWallet: StoredWallet = {
          id: newId,
          userId: data.userId,
          balance: data.balance ?? 0,
          transactions: [],
        };
        memoryWallets[data.userId] = newWallet;
        return newWallet;
      }

      if (m === 'vendorprofile') {
        const newVendor: StoredVendorProfile = {
          id: newId,
          userId: data.userId,
          businessName: data.businessName,
          businessType: data.businessType || 'Retailer',
          gstin: data.gstin ?? null,
          pan: data.pan ?? null,
          address: data.address,
          city: data.city || 'Gwalior',
          pincode: data.pincode,
          phone: data.phone,
          email: data.email,
          bankName: data.bankName ?? null,
          accountNumber: data.accountNumber ?? null,
          ifsc: data.ifsc ?? null,
          description: data.description ?? null,
          status: data.status || 'PENDING',
          isActive: Boolean(data.isActive),
          commissionPct: data.commissionPct ?? 5,
          totalSales: 0,
          totalOrders: 0,
          createdAt: new Date().toISOString(),
          user: {
            phone: data.phone,
            email: data.email ?? null,
            createdAt: new Date().toISOString(),
          },
          _count: {
            products: 0,
            vendorOrders: 0,
          },
        };
        memoryVendorProfiles.unshift(newVendor);

        // Update user's role to VENDOR
        const u = memoryUsers.find((user) => user.id === data.userId || user.phone === data.phone);
        if (u) {
          u.role = 'VENDOR';
        }

        return newVendor;
      }

      if (m === 'product') {
        const newProd = {
          id: newId,
          ...data,
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [mockProducts[0].images[0]],
          createdAt: new Date().toISOString(),
        };
        mockProducts.unshift(newProd as any);
        return newProd;
      }

      return { id: newId, ...data };
    },

    upsert: async (d: any) => {
      const created = d?.create ?? {};
      const updated = d?.update ?? {};
      const where = d?.where ?? {};

      if (m === 'vendorprofile') {
        const existingIdx = memoryVendorProfiles.findIndex(
          (v) => (where.id && v.id === where.id) || (where.userId && v.userId === where.userId)
        );
        if (existingIdx !== -1) {
          const merged = { ...memoryVendorProfiles[existingIdx], ...updated };
          memoryVendorProfiles[existingIdx] = merged;
          return merged;
        }
        const newId = created.id ?? `vp_${Date.now()}`;
        const newVendor: StoredVendorProfile = {
          id: newId,
          userId: created.userId,
          businessName: created.businessName,
          businessType: created.businessType || 'Retailer',
          gstin: created.gstin ?? null,
          pan: created.pan ?? null,
          address: created.address,
          city: created.city || 'Gwalior',
          pincode: created.pincode,
          phone: created.phone,
          email: created.email,
          bankName: created.bankName ?? null,
          accountNumber: created.accountNumber ?? null,
          ifsc: created.ifsc ?? null,
          description: created.description ?? null,
          status: created.status || 'PENDING',
          isActive: Boolean(created.isActive),
          commissionPct: created.commissionPct ?? 5,
          totalSales: 0,
          totalOrders: 0,
          createdAt: new Date().toISOString(),
          user: {
            phone: created.phone,
            email: created.email ?? null,
            createdAt: new Date().toISOString(),
          },
          _count: {
            products: 0,
            vendorOrders: 0,
          },
        };
        memoryVendorProfiles.unshift(newVendor);
        return newVendor;
      }

      if (m === 'user') {
        const phone = where.phone ?? created.phone;
        const existingIndex = memoryUsers.findIndex(
          (u) => u.phone === phone || (where.id && u.id === where.id)
        );

        if (existingIndex !== -1) {
          const merged: StoredUser = {
            ...memoryUsers[existingIndex],
            ...updated,
            isVerified: true,
          };
          memoryUsers[existingIndex] = merged;
          return merged;
        }

        const newId = created.id ?? `usr_${phone}`;
        const newUser: StoredUser = {
          id: newId,
          phone,
          name: created.name ?? null,
          email: created.email ?? null,
          avatar: created.avatar ?? null,
          role: created.role ?? 'CUSTOMER',
          isVerified: true,
          wallet: { balance: 0 },
        };
        memoryUsers.push(newUser);
        return newUser;
      }

      return { id: `id_${Date.now()}`, ...created, ...updated };
    },

    update: async (d: any) => {
      const where = d?.where ?? {};
      const data = d?.data ?? {};

      if (m === 'user') {
        const u = memoryUsers.find((user) => (where.id && user.id === where.id) || (where.phone && user.phone === where.phone));
        if (u) {
          Object.assign(u, data);
          return u;
        }
      }

      if (m === 'vendorprofile') {
        const v = memoryVendorProfiles.find((ven) => (where.id && ven.id === where.id) || (where.userId && ven.userId === where.userId));
        if (v) {
          Object.assign(v, data);
          return v;
        }
      }

      if (m === 'address' && where.id) {
        const addr = memoryAddresses.find((a) => a.id === where.id);
        if (addr) {
          Object.assign(addr, data);
          return addr;
        }
      }

      if (m === 'wallet' && where.userId) {
        const w = memoryWallets[where.userId];
        if (w) {
          if (data.balance !== undefined) w.balance = data.balance;
          return w;
        }
      }

      return data;
    },

    updateMany: async (d: any) => {
      const where = d?.where ?? {};
      const data = d?.data ?? {};
      let count = 0;

      if (m === 'address' && where.userId) {
        for (const a of memoryAddresses) {
          if (a.userId === where.userId) {
            Object.assign(a, data);
            count++;
          }
        }
      }

      return { count };
    },

    delete: async (d: any) => {
      const where = d?.where ?? {};

      if (m === 'address' && where.id) {
        const idx = memoryAddresses.findIndex((a) => a.id === where.id);
        if (idx !== -1) {
          const removed = memoryAddresses.splice(idx, 1)[0];
          return removed;
        }
      }

      return {};
    },

    deleteMany: async () => ({ count: 0 }),
  };
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(target, prop) {
    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }

    if (prop === '$transaction') {
      return async (cbOrArr: any) => {
        if (typeof cbOrArr === 'function') {
          return await cbOrArr(prisma);
        }
        if (Array.isArray(cbOrArr)) {
          return await Promise.all(cbOrArr);
        }
        return cbOrArr;
      };
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
                } catch {
                  const fallbackModel = createMockModel(String(prop));
                  const fn = (fallbackModel as any)[mProp];
                  if (typeof fn === 'function') {
                    return await fn(...args);
                  }
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

    return createMockModel(String(prop));
  }
});

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient | null = null;

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

// ── Genuine Banners ───────────────────────────────────────────────────────────
export const mockBanners = [
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

// ── Genuine Categories ────────────────────────────────────────────────────────
export const mockCategories = [
  {
    id: 'c1',
    name: 'Cement & Mortar',
    slug: 'cement',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 1,
    isActive: true,
    children: [
      { id: 'c1-1', name: 'OPC 53 Cement', slug: 'cement', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80' },
      { id: 'c1-2', name: 'Waterproof Cement', slug: 'cement', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 3 },
  },
  {
    id: 'c2',
    name: 'Steel & TMT Bars',
    slug: 'steel-tmt',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 2,
    isActive: true,
    children: [
      { id: 'c2-1', name: 'Fe 500D Rebars', slug: 'steel-tmt', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' },
      { id: 'c2-2', name: 'Binding Wire', slug: 'steel-tmt', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 2 },
  },
  {
    id: 'c3',
    name: 'Plywood & Boards',
    slug: 'plywood-boards',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 3,
    isActive: true,
    children: [
      { id: 'c3-1', name: 'BWR Grade Plywood', slug: 'plywood-boards', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
      { id: 'c3-2', name: 'Marine BWP Plywood', slug: 'plywood-boards', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 2 },
  },
  {
    id: 'c4',
    name: 'Bricks & Blocks',
    slug: 'bricks-blocks',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 4,
    isActive: true,
    children: [
      { id: 'c4-1', name: 'Red Clay Bricks (लाल ईंट)', slug: 'bricks-blocks', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80' },
      { id: 'c4-2', name: 'AAC Lightweight Blocks', slug: 'bricks-blocks', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 2 },
  },
  {
    id: 'c9',
    name: 'Sand & Aggregates (रेत और गिट्टी)',
    slug: 'sand-aggregates',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 4.5,
    isActive: true,
    children: [
      { id: 'c9-1', name: 'River Sand (नदी की रेत/बजरी)', slug: 'sand-aggregates', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
      { id: 'c9-2', name: 'Granite Gitti (10mm/20mm गिट्टी)', slug: 'sand-aggregates', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 2 },
  },
  {
    id: 'c5',
    name: 'Paints & Primers',
    slug: 'paints-primers',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 5,
    isActive: true,
    children: [
      { id: 'c5-1', name: 'Exterior Emulsion', slug: 'paints-primers', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80' },
      { id: 'c5-2', name: 'Interior Emulsion', slug: 'paints-primers', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 3 },
  },
  {
    id: 'c6',
    name: 'Electrical & Wires',
    slug: 'electrical-wires',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 6,
    isActive: true,
    children: [
      { id: 'c6-1', name: 'Modular Switches', slug: 'electrical-wires', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80' },
      { id: 'c6-2', name: 'Copper House Wires', slug: 'electrical-wires', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 3 },
  },
  {
    id: 'c7',
    name: 'Plumbing & Pipes',
    slug: 'plumbing-pipes',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 7,
    isActive: true,
    children: [
      { id: 'c7-1', name: 'CPVC Pipes', slug: 'plumbing-pipes', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=400&q=80' },
      { id: 'c7-2', name: 'PVC Drainage Pipes', slug: 'plumbing-pipes', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 3 },
  },
  {
    id: 'c8',
    name: 'Sanitaryware & Bath',
    slug: 'sanitaryware',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    parentId: null,
    sortOrder: 8,
    isActive: true,
    children: [
      { id: 'c8-1', name: 'Wall Hung Toilets', slug: 'sanitaryware', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
      { id: 'c8-2', name: 'Basin Mixers & Taps', slug: 'sanitaryware', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
    ],
    _count: { products: 2 },
  },
];

// ── Genuine Brands ────────────────────────────────────────────────────────────
export const mockBrands = [
  { id: 'bnd1', name: 'UltraTech Cement', slug: 'ultratech', logo: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd2', name: 'Tata Tiscon', slug: 'tata-tiscon', logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd3', name: 'CenturyPly', slug: 'centuryply', logo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd4', name: 'Asian Paints', slug: 'asian-paints', logo: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd5', name: 'Finolex Pipes', slug: 'finolex', logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd6', name: 'Fevicol', slug: 'fevicol', logo: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd7', name: 'Polycab', slug: 'polycab', logo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=120&q=80' },
  { id: 'bnd8', name: 'Astral', slug: 'astral', logo: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=120&q=80' },
];

// ── Genuine Products ──────────────────────────────────────────────────────────
export const mockProducts = [
  {
    id: 'p1',
    name: 'UltraTech Super Cement (PPC)',
    slug: 'ultratech-super-cement-ppc',
    description: 'Engineered with micro-fine particles for dense, impervious, and crack-resistant concrete construction.',
    categoryId: 'c1',
    brandId: 'bnd1',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'],
    mrp: 380,
    sellingPrice: 365,
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
    brand: { name: 'UltraTech Cement', slug: 'ultratech' },
    category: { name: 'Cement & Mortar', slug: 'cement' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p1-b',
    name: 'ACC Gold Water Shield Cement',
    slug: 'acc-gold-water-shield-cement',
    description: 'ACC Gold Water Shield Cement provides enhanced waterproofing protection. Perfect for foundations, basements, and slabs.',
    categoryId: 'c1',
    brandId: 'bnd1',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'],
    mrp: 410,
    sellingPrice: 390,
    bulkPrices: [{ minQty: 50, price: 380 }, { minQty: 150, price: 370 }],
    unit: 'Bag (50kg)',
    sku: 'CEM-ACC-02',
    stock: 320,
    reorderPoint: 40,
    lowStockThreshold: 15,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['cement', 'acc', 'waterproof', 'construction'],
    specifications: { Grade: 'Water Shield PPC', Weight: '50kg', ISI: 'IS:1489' },
    isActive: true,
    brand: { name: 'ACC', slug: 'acc' },
    category: { name: 'Cement & Mortar', slug: 'cement' },
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Tata Tiscon Fe 500D TMT Bar (12mm)',
    slug: 'tata-tiscon-fe-500d-12mm',
    description: 'Superior ductility, high bendability, and earthquake resistant TMT rebars certified for RCC construction.',
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
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['steel', 'tmt', 'tata', 'rebar'],
    specifications: { Grade: 'Fe 500D', Size: '12mm', Length: '12 meter' },
    isActive: true,
    brand: { name: 'Tata Tiscon', slug: 'tata-tiscon' },
    category: { name: 'Steel & TMT Bars', slug: 'steel-tmt' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p2-b',
    name: 'JSW Neosteel 550D TMT Bar (10mm)',
    slug: 'jsw-neosteel-550d-10mm',
    description: 'High tensile strength Thermo-Mechanically Treated bars made with pure virgin steel for residential pillars and beams.',
    categoryId: 'c2',
    brandId: 'bnd2',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'],
    mrp: 70,
    sellingPrice: 66,
    bulkPrices: [{ minQty: 100, price: 64 }, { minQty: 500, price: 62 }],
    unit: 'Kg',
    sku: 'STL-JSW-10',
    stock: 1800,
    reorderPoint: 150,
    lowStockThreshold: 50,
    isFeatured: false,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['steel', 'tmt', 'jsw', 'neosteel'],
    specifications: { Grade: 'Fe 550D', Size: '10mm', Length: '12 meter' },
    isActive: true,
    brand: { name: 'JSW Steel', slug: 'jsw-steel' },
    category: { name: 'Steel & TMT Bars', slug: 'steel-tmt' },
    createdAt: '2026-03-03T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'CenturyPly Club Prime BWR Plywood (19mm)',
    slug: 'centuryply-club-prime-19mm',
    description: 'Boiling Water Resistant commercial plywood with Virokill technology and 25-year borer-proof warranty.',
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
    tags: ['plywood', 'century', 'bwr', 'wood'],
    specifications: { Thickness: '19mm', Grade: 'BWR Club Prime', Size: '8x4 ft' },
    isActive: true,
    brand: { name: 'CenturyPly', slug: 'centuryply' },
    category: { name: 'Plywood & Boards', slug: 'plywood-boards' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p3-b',
    name: 'Greenply Marine Grade BWP Plywood (16mm)',
    slug: 'greenply-marine-bwp-16mm',
    description: '100% boiling water proof marine ply treated with eco-friendly preservatives for modular kitchens and wardrobes.',
    categoryId: 'c3',
    brandId: 'bnd3',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'],
    mrp: 3600,
    sellingPrice: 3350,
    bulkPrices: [{ minQty: 8, price: 3200 }],
    unit: 'Sheet (8x4 ft)',
    sku: 'PLY-GRN-16',
    stock: 90,
    reorderPoint: 15,
    lowStockThreshold: 5,
    isFeatured: false,
    isNewLaunch: true,
    cashbackPercent: 2.0,
    tags: ['plywood', 'greenply', 'bwp', 'marine'],
    specifications: { Thickness: '16mm', Grade: 'BWP Marine 710', Size: '8x4 ft' },
    isActive: true,
    brand: { name: 'Greenply', slug: 'greenply' },
    category: { name: 'Plywood & Boards', slug: 'plywood-boards' },
    createdAt: '2026-03-03T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Asian Paints Apex Ultima Weatherproof Emulsion',
    slug: 'asian-paints-apex-ultima-4l',
    description: 'High performance exterior wall paint with advanced UV guard and dirt-pickup resistance.',
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
    isNewLaunch: false,
    cashbackPercent: 1.5,
    tags: ['paint', 'asian paints', 'exterior', 'emulsion'],
    specifications: { Finish: 'Sheen', Size: '4 Liters', Warranty: '7 Years' },
    isActive: true,
    brand: { name: 'Asian Paints', slug: 'asian-paints' },
    category: { name: 'Paints & Primers', slug: 'paints-primers' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p4-b',
    name: 'Berger WeatherCoat All Guard Exterior Paint',
    slug: 'berger-weathercoat-all-guard-10l',
    description: 'Superior protection against heavy rain, heat, and fungal growth with silicon additives.',
    categoryId: 'c5',
    brandId: 'bnd4',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'],
    mrp: 3800,
    sellingPrice: 3450,
    bulkPrices: [{ minQty: 3, price: 3300 }],
    unit: 'Bucket (10L)',
    sku: 'PNT-BRG-10L',
    stock: 65,
    reorderPoint: 10,
    lowStockThreshold: 4,
    isFeatured: false,
    isNewLaunch: true,
    cashbackPercent: 1.5,
    tags: ['paint', 'berger', 'weathercoat', 'exterior'],
    specifications: { Finish: 'Soft Sheen', Size: '10 Liters', Warranty: '5 Years' },
    isActive: true,
    brand: { name: 'Berger Paints', slug: 'berger' },
    category: { name: 'Paints & Primers', slug: 'paints-primers' },
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'p5',
    name: 'Red Clay Building Bricks (Class 1)',
    slug: 'red-clay-building-bricks-class-1',
    description: 'First class kiln-burnt red bricks with uniform size and sharp edges for strong load-bearing walls.',
    categoryId: 'c4',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'],
    mrp: 10,
    sellingPrice: 8.5,
    bulkPrices: [{ minQty: 1000, price: 8.2 }, { minQty: 3000, price: 7.9 }],
    unit: 'Piece',
    sku: 'BRK-RED-01',
    stock: 20000,
    reorderPoint: 5000,
    lowStockThreshold: 2000,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['bricks', 'clay', 'construction'],
    specifications: { Type: 'Kiln Burnt Class 1', Size: '9x4.25x2.75 inch', Strength: '10.5 N/mm2' },
    isActive: true,
    brand: null,
    category: { name: 'Bricks & Blocks', slug: 'bricks-blocks' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p5-b',
    name: 'Autoclaved Aerated Concrete (AAC) Blocks',
    slug: 'aac-lightweight-blocks-600x200x150',
    description: 'Precision cut lightweight thermal insulating blocks that save mortar and speed up masonry construction.',
    categoryId: 'c4',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'],
    mrp: 75,
    sellingPrice: 64,
    bulkPrices: [{ minQty: 200, price: 61 }, { minQty: 500, price: 58 }],
    unit: 'Piece',
    sku: 'BRK-AAC-150',
    stock: 3500,
    reorderPoint: 400,
    lowStockThreshold: 100,
    isFeatured: false,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['aac', 'blocks', 'lightweight', 'masonry'],
    specifications: { Dimensions: '600x200x150 mm', Density: '550-650 kg/m3', 'Kaam / Purpose': 'Lightweight modern bricks (alternative - तेज़ चिनाई)' },
    isActive: true,
    brand: null,
    category: { name: 'Bricks & Blocks', slug: 'bricks-blocks' },
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'p-sand',
    name: 'Washed River Sand / Ret (चंबल/नदी की रेत - प्लास्टर & कंक्रीट)',
    slug: 'washed-river-sand-ret-trolley',
    description: 'Triple-screened river sand free from mud and organic silt. Essential for high-adhesion cement mortar, smooth wall plastering, and RCC structural concrete.',
    categoryId: 'c9',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'],
    mrp: 4100,
    sellingPrice: 3800,
    bulkPrices: [{ minQty: 2, price: 3600 }, { minQty: 5, price: 3450 }],
    unit: 'Trolley (100 Cu.Ft)',
    sku: 'SND-RVR-100',
    stock: 50,
    reorderPoint: 10,
    lowStockThreshold: 4,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['sand', 'ret', 'bajri', 'cement mix', 'plaster', 'chambal ret'],
    specifications: { 'Kaam / Purpose': 'Cement mix mein, plaster mein', Type: 'Coarse Screened River Sand', SiltContent: '< 3% Washed' },
    isActive: true,
    brand: null,
    category: { name: 'Sand & Aggregates (रेत और गिट्टी)', slug: 'sand-aggregates' },
    createdAt: '2026-03-04T00:00:00Z',
  },
  {
    id: 'p-gitti',
    name: 'Blue Granite Aggregate / Gitti (20mm & 10mm कंक्रीट रोड़ी)',
    slug: 'blue-granite-aggregate-gitti-20mm',
    description: 'Machine-crushed angular blue granite aggregate stones (10mm - 20mm graded mix). Provides compressive structural strength for RCC pillars, beams, footings, and slab casting.',
    categoryId: 'c9',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80'],
    mrp: 4600,
    sellingPrice: 4200,
    bulkPrices: [{ minQty: 2, price: 4050 }, { minQty: 5, price: 3900 }],
    unit: 'Trolley (100 Cu.Ft)',
    sku: 'AGG-BLU-20MM',
    stock: 40,
    reorderPoint: 8,
    lowStockThreshold: 3,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['aggregate', 'gitti', 'concrete mix', 'slab', 'pillar', 'foundation'],
    specifications: { 'Kaam / Purpose': 'Concrete mix mein (foundation, slab, pillar)', StoneType: 'Hard Blue Granite', Size: '10mm - 20mm Angular' },
    isActive: true,
    brand: null,
    category: { name: 'Sand & Aggregates (रेत और गिट्टी)', slug: 'sand-aggregates' },
    createdAt: '2026-03-04T00:00:00Z',
  },
  {
    id: 'p6',
    name: 'Finolex PVC Rigid Plumbing Pipes (3 inch)',
    slug: 'finolex-pvc-pipe-3-inch',
    description: 'High durability pressure pipes for domestic water supply and drainage systems in Gwalior buildings.',
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
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['pipes', 'plumbing', 'finolex'],
    specifications: { Size: '3 inch', Length: '3 meters', Pressure: 'Schedule 40' },
    isActive: true,
    brand: { name: 'Finolex Pipes', slug: 'finolex' },
    category: { name: 'Plumbing & Pipes', slug: 'plumbing-pipes' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p6-b',
    name: 'Astral CPVC FlowGuard Plus Pipe (25mm)',
    slug: 'astral-cpvc-flowguard-pipe-25mm',
    description: 'Lead-free CPVC piping designed for hot and cold potable water distribution with corrosion-free longevity.',
    categoryId: 'c7',
    brandId: 'bnd8',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80'],
    mrp: 320,
    sellingPrice: 285,
    bulkPrices: [{ minQty: 10, price: 270 }, { minQty: 30, price: 255 }],
    unit: 'Piece (3m)',
    sku: 'PLM-AST-25',
    stock: 350,
    reorderPoint: 40,
    lowStockThreshold: 15,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['astral', 'cpvc', 'pipe', 'plumbing'],
    specifications: { Size: '25mm (1 inch)', Length: '3 meters', SDR: 'SDR 11', MaxTemp: '93°C' },
    isActive: true,
    brand: { name: 'Astral', slug: 'astral' },
    category: { name: 'Plumbing & Pipes', slug: 'plumbing-pipes' },
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'p7',
    name: 'Polycab FRLS Copper House Wire 1.5 sq mm (90m)',
    slug: 'polycab-frls-copper-wire-1-5sqmm',
    description: 'Fire Retardant Low Smoke pure electrolytic copper wire for safe home and office electrical wiring.',
    categoryId: 'c6',
    brandId: 'bnd7',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'],
    mrp: 1850,
    sellingPrice: 1620,
    bulkPrices: [{ minQty: 5, price: 1560 }],
    unit: 'Roll (90m)',
    sku: 'ELE-PLY-1.5',
    stock: 140,
    reorderPoint: 20,
    lowStockThreshold: 8,
    isFeatured: true,
    isNewLaunch: false,
    cashbackPercent: 1.0,
    tags: ['electrical', 'wire', 'polycab', 'copper', 'frls'],
    specifications: { Size: '1.5 sq mm', Length: '90 meters', Voltage: '1100V', Conductor: 'Copper' },
    isActive: true,
    brand: { name: 'Polycab', slug: 'polycab' },
    category: { name: 'Electrical & Wires', slug: 'electrical-wires' },
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'p7-b',
    name: 'Legrand Arteor Modular Switch 6A White',
    slug: 'legrand-arteor-modular-switch-6a',
    description: 'Elegantly styled 1-way modular switch tested for 100,000 operations with silver contact tips.',
    categoryId: 'c6',
    brandId: 'bnd7',
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'],
    mrp: 180,
    sellingPrice: 145,
    bulkPrices: [{ minQty: 20, price: 135 }, { minQty: 50, price: 125 }],
    unit: 'Piece',
    sku: 'ELE-LEG-6A',
    stock: 450,
    reorderPoint: 50,
    lowStockThreshold: 20,
    isFeatured: false,
    isNewLaunch: true,
    cashbackPercent: 1.0,
    tags: ['switch', 'modular', 'legrand', 'electrical'],
    specifications: { Rating: '6A 240V', Module: '1M', Finish: 'Glossy White' },
    isActive: true,
    brand: { name: 'Legrand', slug: 'legrand' },
    category: { name: 'Electrical & Wires', slug: 'electrical-wires' },
    createdAt: '2026-03-03T00:00:00Z',
  },
  {
    id: 'p8',
    name: 'Hindware Wall Hung Western Toilet Seat & Cistern',
    slug: 'hindware-wall-hung-toilet-seat',
    description: 'Vitreous china ceramic wall mounted commode with rimless flushing and soft-close seat cover.',
    categoryId: 'c8',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'],
    mrp: 5800,
    sellingPrice: 4850,
    bulkPrices: [{ minQty: 4, price: 4600 }],
    unit: 'Set',
    sku: 'SAN-HND-WH',
    stock: 45,
    reorderPoint: 8,
    lowStockThreshold: 3,
    isFeatured: true,
    isNewLaunch: true,
    cashbackPercent: 2.0,
    tags: ['sanitaryware', 'toilet', 'commode', 'hindware'],
    specifications: { Type: 'Wall Hung', Flush: 'Dual Flush 3/6L', Material: 'Vitreous China' },
    isActive: true,
    brand: { name: 'Hindware', slug: 'hindware' },
    category: { name: 'Sanitaryware & Bath', slug: 'sanitaryware' },
    createdAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'p8-b',
    name: 'Jaquar Florentine Chrome Basin Mixer Tap',
    slug: 'jaquar-florentine-basin-mixer',
    description: 'Solid brass body single lever basin tap with high-shine chrome plating and ceramic cartridge.',
    categoryId: 'c8',
    brandId: null,
    vendorId: null,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'],
    mrp: 3200,
    sellingPrice: 2690,
    bulkPrices: [{ minQty: 5, price: 2550 }],
    unit: 'Piece',
    sku: 'SAN-JAQ-BM',
    stock: 60,
    reorderPoint: 10,
    lowStockThreshold: 4,
    isFeatured: false,
    isNewLaunch: false,
    cashbackPercent: 1.5,
    tags: ['tap', 'mixer', 'jaquar', 'bathroom'],
    specifications: { Material: 'Solid Brass', Finish: 'Chrome', Warranty: '10 Years' },
    isActive: true,
    brand: { name: 'Jaquar', slug: 'jaquar' },
    category: { name: 'Sanitaryware & Bath', slug: 'sanitaryware' },
    createdAt: '2026-03-01T00:00:00Z',
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

export const prisma = new Proxy({} as PrismaClient, {
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

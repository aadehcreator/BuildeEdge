// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ── Brands ──────────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'asian-paints' },
      update: {},
      create: { name: 'Asian Paints', slug: 'asian-paints', logo: 'https://res.cloudinary.com/demo/image/upload/v1/brands/asian-paints.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'fevicol' },
      update: {},
      create: { name: 'Fevicol', slug: 'fevicol', logo: 'https://res.cloudinary.com/demo/image/upload/v1/brands/fevicol.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'bosch' },
      update: {},
      create: { name: 'Bosch', slug: 'bosch', logo: 'https://res.cloudinary.com/demo/image/upload/v1/brands/bosch.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'hettich' },
      update: {},
      create: { name: 'Hettich', slug: 'hettich', logo: 'https://res.cloudinary.com/demo/image/upload/v1/brands/hettich.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'legrand' },
      update: {},
      create: { name: 'Legrand', slug: 'legrand', logo: 'https://res.cloudinary.com/demo/image/upload/v1/brands/legrand.png' },
    }),
  ]);
  console.log(`✅ Created ${brands.length} brands`);

  // ── Categories ───────────────────────────────────────────────────────────────
  const catCivil = await prisma.category.upsert({
    where: { slug: 'civil-interiors' },
    update: {},
    create: { name: 'Civil & Interiors', slug: 'civil-interiors', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', sortOrder: 1 },
  });
  const catFurniture = await prisma.category.upsert({
    where: { slug: 'furniture-hardware' },
    update: {},
    create: { name: 'Furniture Hardware', slug: 'furniture-hardware', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', sortOrder: 2 },
  });
  const catElectrical = await prisma.category.upsert({
    where: { slug: 'electrical' },
    update: {},
    create: { name: 'Electrical', slug: 'electrical', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', sortOrder: 3 },
  });
  const catPlumbing = await prisma.category.upsert({
    where: { slug: 'plumbing' },
    update: {},
    create: { name: 'Plumbing', slug: 'plumbing', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400', sortOrder: 4 },
  });
  const catNewLaunches = await prisma.category.upsert({
    where: { slug: 'new-launches' },
    update: {},
    create: { name: 'New Launches', slug: 'new-launches', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400', sortOrder: 5 },
  });
  const catTools = await prisma.category.upsert({
    where: { slug: 'tools' },
    update: {},
    create: { name: 'Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', sortOrder: 6 },
  });

  // Sub-categories
  const subCategories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'cement' }, update: {}, create: { name: 'Cement', slug: 'cement', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', parentId: catCivil.id, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'paint' }, update: {}, create: { name: 'Paint', slug: 'paint', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400', parentId: catCivil.id, sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'tiles' }, update: {}, create: { name: 'Tiles', slug: 'tiles', image: 'https://images.unsplash.com/photo-1584622781867-1ef71be9b55e?w=400', parentId: catCivil.id, sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'adhesives' }, update: {}, create: { name: 'Adhesives', slug: 'adhesives', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400', parentId: catCivil.id, sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'hinges' }, update: {}, create: { name: 'Hinges', slug: 'hinges', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', parentId: catFurniture.id, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'drawer-systems' }, update: {}, create: { name: 'Drawer Systems', slug: 'drawer-systems', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', parentId: catFurniture.id, sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'switches-sockets' }, update: {}, create: { name: 'Switches & Sockets', slug: 'switches-sockets', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', parentId: catElectrical.id, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'wires-cables' }, update: {}, create: { name: 'Wires & Cables', slug: 'wires-cables', image: 'https://images.unsplash.com/photo-1545259742-f3c6f4d0c9c2?w=400', parentId: catElectrical.id, sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'pipes-fittings' }, update: {}, create: { name: 'Pipes & Fittings', slug: 'pipes-fittings', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400', parentId: catPlumbing.id, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'sanitary-ware' }, update: {}, create: { name: 'Sanitary Ware', slug: 'sanitary-ware', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400', parentId: catPlumbing.id, sortOrder: 2 } }),
  ]);
  console.log(`✅ Created ${6 + subCategories.length} categories`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const [cement, paint, tiles, adhesives, hinges, electrical, plumbing] = [
    subCategories[0], subCategories[1], subCategories[2], subCategories[3], subCategories[4], subCategories[6], subCategories[8]
  ];

  const products = [
    {
      name: 'UltraTech Cement OPC 53 Grade',
      slug: 'ultratech-cement-opc-53-grade',
      description: 'UltraTech Cement OPC 53 Grade is ideal for construction projects requiring high strength and durability. Suitable for RCC, bridges, and pre-stressed concrete.',
      categoryId: cement.id,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
      mrp: 395, sellingPrice: 365, unit: '50 Kg Bag', sku: 'CEM-001', stock: 500, isFeatured: true,
      bulkPrices: [{ minQty: 10, price: 355 }, { minQty: 50, price: 345 }],
      tags: ['cement', 'opc', 'construction', 'ultratech'],
      specifications: { 'Grade': 'OPC 53', 'Bag Weight': '50 Kg', 'Initial Setting Time': '30 min', 'Final Setting Time': '600 min', 'Compressive Strength (28 days)': '53 MPa' },
      cashbackPercent: 1.0,
    },
    {
      name: 'ACC Gold Water Shield Cement',
      slug: 'acc-gold-water-shield-cement',
      description: 'ACC Gold Water Shield Cement provides enhanced waterproofing protection. Perfect for basements, bathrooms, and water retaining structures.',
      categoryId: cement.id,
      images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'],
      mrp: 420, sellingPrice: 390, unit: '50 Kg Bag', sku: 'CEM-002', stock: 300, isFeatured: false,
      bulkPrices: [{ minQty: 10, price: 380 }, { minQty: 50, price: 370 }],
      tags: ['cement', 'waterproof', 'acc'],
      specifications: { 'Grade': 'PPC', 'Bag Weight': '50 Kg', 'Waterproofing': 'Enhanced' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Asian Paints Apex Exterior Emulsion - White',
      slug: 'asian-paints-apex-exterior-white',
      description: 'Asia Paints Apex is a premium exterior emulsion paint with excellent weather resistance and UV protection. Keeps walls looking fresh for years.',
      categoryId: paint.id, brandId: brands[0].id,
      images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600'],
      mrp: 1200, sellingPrice: 980, unit: '10 Litre', sku: 'PAI-001', stock: 150, isFeatured: true, isNewLaunch: false,
      bulkPrices: [{ minQty: 5, price: 950 }, { minQty: 10, price: 920 }],
      tags: ['paint', 'exterior', 'asian paints', 'emulsion'],
      specifications: { 'Finish': 'Matt', 'Coverage': '110-130 sq ft/L', 'Dilution': '20-30% water', 'Dry Time': '2 hours', 'Recoat Time': '4 hours' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Berger WeatherCoat All Guard - Base',
      slug: 'berger-weathercoat-all-guard-base',
      description: 'Berger WeatherCoat All Guard provides superior protection against rain, sun, and fungal growth. 15-year performance warranty.',
      categoryId: paint.id,
      images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600'],
      mrp: 1450, sellingPrice: 1250, unit: '10 Litre', sku: 'PAI-002', stock: 80, isFeatured: false, isNewLaunch: true,
      bulkPrices: [{ minQty: 5, price: 1200 }],
      tags: ['paint', 'exterior', 'berger', 'weathercoat'],
      specifications: { 'Finish': 'Semi-Gloss', 'Coverage': '120-140 sq ft/L', 'Warranty': '15 years' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Kajaria Floor Tiles - Matt Grey 600x600',
      slug: 'kajaria-floor-tiles-matt-grey-600x600',
      description: 'Premium Kajaria ceramic floor tiles with anti-slip surface. Suitable for living rooms, kitchens, and commercial spaces.',
      categoryId: tiles.id,
      images: ['https://images.unsplash.com/photo-1584622781867-1ef71be9b55e?w=600'],
      mrp: 65, sellingPrice: 54, unit: 'Per Sq Ft', sku: 'TIL-001', stock: 2000, isFeatured: true,
      bulkPrices: [{ minQty: 100, price: 50 }, { minQty: 500, price: 47 }],
      tags: ['tiles', 'kajaria', 'floor', 'grey'],
      specifications: { 'Size': '600x600mm', 'Thickness': '8.5mm', 'Finish': 'Matt', 'Water Absorption': '<3%', 'PEI Rating': 'PEI 4' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Somany Vitrified Tiles - Ivory 800x800',
      slug: 'somany-vitrified-tiles-ivory-800x800',
      description: 'Large format vitrified tiles from Somany with glossy finish. Perfect for modern living spaces and commercial interiors.',
      categoryId: tiles.id,
      images: ['https://images.unsplash.com/photo-1595514535215-9e3e23a1a6e5?w=600'],
      mrp: 95, sellingPrice: 78, unit: 'Per Sq Ft', sku: 'TIL-002', stock: 1500, isFeatured: false, isNewLaunch: true,
      bulkPrices: [{ minQty: 100, price: 72 }, { minQty: 500, price: 68 }],
      tags: ['tiles', 'somany', 'vitrified', 'ivory'],
      specifications: { 'Size': '800x800mm', 'Thickness': '10mm', 'Finish': 'Glossy', 'Water Absorption': '<0.5%' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Fevicol SH - Construction Adhesive',
      slug: 'fevicol-sh-construction-adhesive',
      description: 'Fevicol SH is the trusted PVA adhesive for woodworking and construction. Strong bond, water resistant, and easy to apply.',
      categoryId: adhesives.id, brandId: brands[1].id,
      images: ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600'],
      mrp: 180, sellingPrice: 155, unit: '1 Kg', sku: 'ADH-001', stock: 400, isFeatured: true,
      bulkPrices: [{ minQty: 10, price: 145 }, { minQty: 25, price: 138 }],
      tags: ['adhesive', 'fevicol', 'woodworking', 'pva'],
      specifications: { 'Type': 'PVA', 'Bond Strength': 'High', 'Water Resistance': 'Yes', 'Setting Time': '30-60 min' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Dr. Fixit Pidicrete URP - Waterproof Compound',
      slug: 'dr-fixit-pidicrete-urp-waterproof',
      description: 'Dr. Fixit Pidicrete URP is a universal repair polymer for waterproofing concrete surfaces. Prevents water ingress in roofs, terraces, and basements.',
      categoryId: adhesives.id,
      images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'],
      mrp: 350, sellingPrice: 310, unit: '5 Litre', sku: 'ADH-002', stock: 200, isFeatured: false,
      bulkPrices: [{ minQty: 5, price: 295 }],
      tags: ['waterproofing', 'dr fixit', 'repair', 'concrete'],
      specifications: { 'Type': 'Polymer', 'Coverage': '10-15 sq ft/L', 'Application': 'Brush/Roller' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Hettich Concealed Hinge 35mm - Pack of 10',
      slug: 'hettich-concealed-hinge-35mm-pack-10',
      description: 'Hettich Intermat concealed hinges provide smooth cabinet door operation with soft-close mechanism. Premium quality with adjustable mounting.',
      categoryId: hinges.id, brandId: brands[3].id,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
      mrp: 650, sellingPrice: 520, unit: 'Pack of 10', sku: 'HIN-001', stock: 300, isFeatured: true,
      bulkPrices: [{ minQty: 5, price: 490 }, { minQty: 10, price: 460 }],
      tags: ['hinge', 'hettich', 'concealed', 'cabinet'],
      specifications: { 'Opening Angle': '110°', 'Bore Diameter': '35mm', 'Material': 'Steel', 'Finish': 'Nickel Plated', 'Soft Close': 'Yes' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Legrand Arteor Modular Switch - 6A',
      slug: 'legrand-arteor-modular-switch-6a',
      description: 'Legrand Arteor premium modular switch with elegant design. Durable mechanism rated for 100,000 operations. White finish.',
      categoryId: electrical.id, brandId: brands[4].id,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
      mrp: 180, sellingPrice: 145, unit: 'Piece', sku: 'ELE-001', stock: 500, isFeatured: false, isNewLaunch: true,
      bulkPrices: [{ minQty: 20, price: 135 }, { minQty: 50, price: 125 }],
      tags: ['switch', 'legrand', 'modular', 'electrical'],
      specifications: { 'Rating': '6A/250V', 'Pole': '1 Way', 'Colour': 'White', 'Operations': '100,000', 'Material': 'Polycarbonate' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Polycab FRLS Wire 1.5 sqmm - 90m',
      slug: 'polycab-frls-wire-1-5sqmm-90m',
      description: 'Polycab FRLS house wiring with fire retardant low smoke insulation. Perfect for domestic and commercial electrical installations.',
      categoryId: electrical.id,
      images: ['https://images.unsplash.com/photo-1545259742-f3c6f4d0c9c2?w=600'],
      mrp: 1850, sellingPrice: 1620, unit: '90 Meter', sku: 'ELE-002', stock: 100, isFeatured: true,
      bulkPrices: [{ minQty: 5, price: 1580 }],
      tags: ['wire', 'polycab', 'frls', 'electrical'],
      specifications: { 'Cross Section': '1.5 sq mm', 'Conductor': 'Copper', 'Insulation': 'FRLS PVC', 'Voltage Rating': '1100V' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Astral CPVC Pipe 25mm - 3m',
      slug: 'astral-cpvc-pipe-25mm-3m',
      description: 'Astral CPVC FlowGuard Plus pipe for hot and cold water supply. Lead-free, corrosion resistant, and easy to install.',
      categoryId: plumbing.id,
      images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600'],
      mrp: 320, sellingPrice: 285, unit: '3 Meter', sku: 'PLM-001', stock: 400, isFeatured: false,
      bulkPrices: [{ minQty: 10, price: 270 }, { minQty: 50, price: 258 }],
      tags: ['pipe', 'cpvc', 'astral', 'plumbing'],
      specifications: { 'Diameter': '25mm', 'Length': '3m', 'Material': 'CPVC', 'Max Temp': '93°C', 'Pressure Rating': 'SDR 11' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Supreme UPVC SWR Pipe 110mm - 3m',
      slug: 'supreme-upvc-swr-pipe-110mm-3m',
      description: 'Supreme UPVC soil, waste and rainwater pipe. Lightweight, durable, and resistant to chemicals. For drainage and sewerage systems.',
      categoryId: plumbing.id,
      images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600'],
      mrp: 580, sellingPrice: 510, unit: '3 Meter', sku: 'PLM-002', stock: 250, isFeatured: false,
      bulkPrices: [{ minQty: 10, price: 490 }],
      tags: ['pipe', 'upvc', 'supreme', 'drainage', 'swr'],
      specifications: { 'Diameter': '110mm', 'Length': '3m', 'Material': 'UPVC', 'Wall Thickness': '3.2mm' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Bosch GBM 13 RE Drill Machine',
      slug: 'bosch-gbm-13-re-drill-machine',
      description: 'Bosch GBM 13 RE professional drill machine with 550W motor. Variable speed control for drilling into wood, metal, and masonry.',
      categoryId: catTools.id, brandId: brands[2].id,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
      mrp: 3200, sellingPrice: 2750, unit: 'Piece', sku: 'TOL-001', stock: 50, isFeatured: true, isNewLaunch: false,
      bulkPrices: [],
      tags: ['drill', 'bosch', 'power tool', 'electric'],
      specifications: { 'Power': '550W', 'No-load Speed': '0-2800 rpm', 'Chuck Capacity': '13mm', 'Weight': '1.7 kg', 'Voltage': '230V' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Stanley FatMax Claw Hammer 16oz',
      slug: 'stanley-fatmax-claw-hammer-16oz',
      description: 'Stanley FatMax anti-vibe claw hammer with bi-material handle. Reduces fatigue during extended use. 16oz perfectly balanced head.',
      categoryId: catTools.id,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
      mrp: 750, sellingPrice: 620, unit: 'Piece', sku: 'TOL-002', stock: 120,
      bulkPrices: [{ minQty: 10, price: 590 }],
      tags: ['hammer', 'stanley', 'hand tool'],
      specifications: { 'Weight': '16oz (454g)', 'Handle': 'Bi-Material', 'Anti-Vibe': 'Yes', 'Face': 'Milled' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Asian Paints Royale Interior Emulsion - 4L',
      slug: 'asian-paints-royale-interior-4l',
      description: 'Asian Paints Royale interior luxury emulsion with stain guard technology. Washable, smooth finish, over 1000 shades available.',
      categoryId: paint.id, brandId: brands[0].id,
      images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600'],
      mrp: 980, sellingPrice: 840, unit: '4 Litre', sku: 'PAI-003', stock: 200, isFeatured: false, isNewLaunch: true,
      bulkPrices: [{ minQty: 5, price: 810 }],
      tags: ['paint', 'interior', 'asian paints', 'royale'],
      specifications: { 'Finish': 'Smooth', 'Coverage': '100-110 sq ft/L', 'Washable': 'Yes' },
      cashbackPercent: 1.0,
    },
    {
      name: 'JK Super Cement OPC 43 Grade',
      slug: 'jk-super-cement-opc-43-grade',
      description: 'JK Super Cement OPC 43 Grade is ideal for general construction works, plastering, and block masonry.',
      categoryId: cement.id,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'],
      mrp: 380, sellingPrice: 350, unit: '50 Kg Bag', sku: 'CEM-003', stock: 600, isFeatured: false,
      bulkPrices: [{ minQty: 10, price: 340 }, { minQty: 50, price: 330 }],
      tags: ['cement', 'opc', 'jk cement', 'construction'],
      specifications: { 'Grade': 'OPC 43', 'Bag Weight': '50 Kg' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Hettich Soft-Close Drawer Slide 500mm',
      slug: 'hettich-soft-close-drawer-slide-500mm',
      description: 'Hettich full extension drawer slide with integrated soft-close mechanism. 40 kg load capacity. Simple installation.',
      categoryId: catFurniture.id, brandId: brands[3].id,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
      mrp: 480, sellingPrice: 390, unit: 'Pair', sku: 'FUR-001', stock: 300, isFeatured: false, isNewLaunch: true,
      bulkPrices: [{ minQty: 10, price: 365 }, { minQty: 25, price: 345 }],
      tags: ['drawer', 'hettich', 'slide', 'soft-close'],
      specifications: { 'Length': '500mm', 'Load Capacity': '40 Kg', 'Extension': 'Full', 'Soft Close': 'Yes', 'Material': 'Steel' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Bosch GWS 7-100 Angle Grinder',
      slug: 'bosch-gws-7-100-angle-grinder',
      description: 'Bosch GWS 7-100 angle grinder with 710W motor and 100mm disc diameter. Ideal for grinding, cutting, and surface finishing.',
      categoryId: catTools.id, brandId: brands[2].id,
      images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
      mrp: 2800, sellingPrice: 2350, unit: 'Piece', sku: 'TOL-003', stock: 40, isFeatured: false, isNewLaunch: true,
      bulkPrices: [],
      tags: ['grinder', 'bosch', 'power tool', 'angle grinder'],
      specifications: { 'Power': '710W', 'Disc Diameter': '100mm', 'No-load Speed': '11000 rpm', 'Weight': '1.9 kg' },
      cashbackPercent: 1.0,
    },
    {
      name: 'Prince UPVC Ball Valve 25mm',
      slug: 'prince-upvc-ball-valve-25mm',
      description: 'Prince UPVC ball valve for water supply systems. Corrosion resistant, UV stabilized, and maintenance free. 25mm BSP thread.',
      categoryId: plumbing.id,
      images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600'],
      mrp: 120, sellingPrice: 98, unit: 'Piece', sku: 'PLM-003', stock: 600,
      bulkPrices: [{ minQty: 20, price: 88 }, { minQty: 50, price: 82 }],
      tags: ['valve', 'upvc', 'prince', 'plumbing'],
      specifications: { 'Diameter': '25mm', 'Material': 'UPVC', 'Thread': 'BSP', 'Pressure': '10 bar' },
      cashbackPercent: 1.0,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: { ...product, bulkPrices: product.bulkPrices ?? undefined, specifications: product.specifications ?? undefined },
    });
  }
  console.log(`✅ Created ${products.length} products`);

  // ── Banners ───────────────────────────────────────────────────────────────────
  await prisma.banner.createMany({
    data: [
      { image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200', link: '/collections/civil-interiors', sortOrder: 1, isActive: true, title: 'Build Smart, Build Fast', subtitle: 'Premium construction materials delivered in 60 mins' },
      { image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200', link: '/collections/paint', sortOrder: 2, isActive: true, title: 'Asian Paints Mega Sale', subtitle: 'Up to 20% off on all paints this month' },
      { image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200', link: '/collections/tools', sortOrder: 3, isActive: true, title: 'Power Tools, Power Deals', subtitle: 'Bosch & Stanley tools at contractor prices' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Created 3 banners');

  // ── Admin user ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      email: 'admin@buildedge.in',
      name: 'Admin',
      passwordHash,
      isVerified: true,
      role: Role.ADMIN,
      wallet: { create: { balance: 0 } },
    },
  });
  console.log('✅ Created admin user (phone: 9999999999, password: Admin@123)');

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

// ── Vendor Profile (demo) ────────────────────────────────────────────────────
async function seedVendor() {
  const vendorUser = await prisma.user.upsert({
    where: { phone: '9111111111' },
    update: {},
    create: {
      phone: '9111111111',
      name: 'Sharma Building Materials',
      isVerified: true,
      role: Role.VENDOR,
      wallet: { create: { balance: 0 } },
    },
  });

  await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'Sharma Building Materials',
      businessType: 'Distributor',
      gstin: '23ABCDE1234F1Z5',
      address: 'Shop No 12, Padav Market',
      city: 'Gwalior',
      pincode: '474001',
      phone: '9111111111',
      email: 'sharma@buildedge.in',
      status: 'APPROVED',
      isActive: true,
      commissionPct: 8,
      description: 'Leading distributor of cement and construction materials in Gwalior since 1995.',
    },
  });
  console.log('✅ Created demo vendor (phone: 9111111111)');
}

seedVendor().catch(console.error);

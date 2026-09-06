import bcrypt from 'bcryptjs';

const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const categories = [
    { name: 'Cement', slug: 'cement', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', sortOrder: 1 },
    { name: 'Paint', slug: 'paint', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400', sortOrder: 2 },
    { name: 'Tiles', slug: 'tiles', image: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=400', sortOrder: 3 },
    { name: 'Hardware', slug: 'hardware', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', sortOrder: 4 },
    { name: 'Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', sortOrder: 5 },
  ];

  const categoryBySlug = new Map<string, { id: string }>();
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, image: category.image, sortOrder: category.sortOrder, is_active: true },
      create: { ...category, is_active: true },
    });
    categoryBySlug.set(category.slug, saved);
  }

  const products = [
    { name: 'UltraTech Cement OPC 53 Grade', slug: 'ultratech-cement-opc-53-grade', sku: 'CEM-001', category: 'cement', price: 365, unit: 'BAG' as const, stock: 500, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600' },
    { name: 'Asian Paints Exterior Emulsion', slug: 'asian-paints-exterior-emulsion', sku: 'PAI-001', category: 'paint', price: 980, unit: 'PIECE' as const, stock: 150, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600' },
    { name: 'Kajaria Floor Tiles', slug: 'kajaria-floor-tiles', sku: 'TIL-001', category: 'tiles', price: 540, unit: 'PIECE' as const, stock: 200, image: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=600' },
    { name: 'Hettich Concealed Hinge', slug: 'hettich-concealed-hinge', sku: 'HAR-001', category: 'hardware', price: 520, unit: 'PIECE' as const, stock: 300, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
    { name: 'Bosch Drill Machine', slug: 'bosch-drill-machine', sku: 'TOL-001', category: 'tools', price: 2750, unit: 'PIECE' as const, stock: 50, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600' },
  ];

  for (const product of products) {
    const category = categoryBySlug.get(product.category);
    if (!category) throw new Error(`Missing category: ${product.category}`);
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: { name: product.name, base_price: product.price, stock: product.stock, images: [product.image], isActive: true },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        categoryId: category.id,
        base_price: product.price,
        unit_type: product.unit,
        stock: product.stock,
        images: [product.image],
        description: `${product.name} for construction and renovation projects.`,
        isActive: true,
      },
    });
  }

  await prisma.banner.createMany({
    data: [
      { image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200', link: '/collections/cement', sortOrder: 1, isActive: true, title: 'Build Smart, Build Fast', subtitle: 'Premium construction materials delivered quickly' },
      { image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200', link: '/collections/paint', sortOrder: 2, isActive: true, title: 'Upgrade Your Space', subtitle: 'Quality paints and finishes for every project' },
    ],
    skipDuplicates: true,
  });

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: { isVerified: true, role: 'ADMIN' },
    create: {
      phone: '9999999999',
      email: 'admin@buildedge.in',
      name: 'Admin',
      passwordHash,
      isVerified: true,
      role: 'ADMIN',
      wallet: { create: { balance: 0 } },
    },
  });

  console.log('Seed complete. Admin: 9999999999 / Admin@123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

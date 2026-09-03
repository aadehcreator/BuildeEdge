export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const newLaunch = searchParams.get('new');
    const brand = searchParams.get('brand');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(50, Number(searchParams.get('limit') ?? 20));
    const sortBy = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where = {
      isActive: true,
      ...(category && {
        OR: [
          { category: { slug: category } },
          { category: { parent: { slug: category } } },
        ],
      }),
      ...(brand && { brand: { slug: brand } }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(newLaunch === 'true' && { isNewLaunch: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { tags: { has: search } },
        ],
      }),
      ...((minPrice || maxPrice) && {
        sellingPrice: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
      }),
    };

    const orderBy =
      sortBy === 'price_asc'
        ? { sellingPrice: 'asc' as const }
        : sortBy === 'price_desc'
        ? { sellingPrice: 'desc' as const }
        : sortBy === 'name'
        ? { name: 'asc' as const }
        : { createdAt: order === 'asc' ? ('asc' as const) : ('desc' as const) };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true, slug: true } }, brand: { select: { name: true, slug: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

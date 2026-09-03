export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Fuse from 'fuse.js';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')?.trim();
    if (!q || q.length < 1) return NextResponse.json({ results: [], query: q });

    // Fetch all active products for Fuse.js search
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true, name: true, slug: true, images: true,
        mrp: true, sellingPrice: true, unit: true, tags: true,
        cashbackPercent: true, stock: true, bulkPrices: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
      take: 500,
    });

    const fuse = new Fuse(products, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'tags', weight: 0.2 },
        { name: 'category.name', weight: 0.1 },
        { name: 'brand.name', weight: 0.1 },
      ],
      threshold: 0.35,
      includeScore: true,
      includeMatches: true,
    });

    const results = fuse
      .search(q, { limit: 20 })
      .map(({ item, score, matches }) => ({ ...(item as any), score, matches }));

    return NextResponse.json({ results, query: q, total: results.length });
  } catch (error) {
    console.error('search GET error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

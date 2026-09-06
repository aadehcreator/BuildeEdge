import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true, parentId: true, parent: { select: { name: true, slug: true } } } },
        brand: { select: { id: true, name: true, slug: true, logo: true } },
      },
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Related products (same category, exclude current)
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 8,
      include: { brand: { select: { name: true } } },
    });

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error('product slug GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

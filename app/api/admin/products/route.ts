import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(50, Number(searchParams.get('limit') ?? 20));

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as unknown;
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { name } = parsed.data;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const product = await prisma.product.create({
      data: { ...parsed.data, slug },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    console.error('admin product POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

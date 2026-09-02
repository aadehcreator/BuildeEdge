import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CategorySchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const categories = await prisma.category.findMany({
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as unknown;
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const category = await prisma.category.create({ data: parsed.data });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

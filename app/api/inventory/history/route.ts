import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = 30;

    let vendorId: string | undefined;
    if (user.role === 'VENDOR') {
      const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
      if (vendor) vendorId = vendor.id;
    }

    const where = {
      ...(productId ? { productId } : {}),
      ...(vendorId ? { product: { vendorId } } : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.stockLog.findMany({
        where,
        include: {
          product: { select: { name: true, sku: true, unit: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stockLog.count({ where }),
    ]);

    return NextResponse.json({ logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

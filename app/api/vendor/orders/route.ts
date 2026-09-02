import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = 20;

    const where = {
      vendorId: vendor.id,
      ...(status && status !== 'ALL' ? { status: status as 'PENDING' | 'ACCEPTED' | 'PACKED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED' } : {}),
    };

    const [vendorOrders, total] = await Promise.all([
      prisma.vendorOrder.findMany({
        where,
        include: {
          order: {
            select: {
              id: true, createdAt: true, paymentMethod: true,
              addressSnapshot: true, user: { select: { name: true, phone: true } },
            },
          },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vendorOrder.count({ where }),
    ]);

    return NextResponse.json({ vendorOrders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const body = await req.json() as { vendorOrderId?: string; status?: string };
    const { vendorOrderId, status } = body;
    if (!vendorOrderId || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const vendorOrder = await prisma.vendorOrder.findFirst({
      where: { id: vendorOrderId, vendorId: vendor.id },
    });
    if (!vendorOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const updated = await prisma.vendorOrder.update({
      where: { id: vendorOrderId },
      data: { status: status as 'PENDING' | 'ACCEPTED' | 'PACKED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED' },
    });

    return NextResponse.json({ vendorOrder: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateOrderStatusSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(50, Number(searchParams.get('limit') ?? 20));

    const where: any = {
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, phone: true } },
          items: { select: { productName: true, quantity: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as { orderId?: string; status?: string };
    const { orderId, status } = body;
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const parsed = UpdateOrderStatusSchema.safeParse({ status });
    if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const updateData: Record<string, unknown> = { status: parsed.data.status };
    if (parsed.data.status === 'DELIVERED') updateData.deliveredAt = new Date();

    const order = await prisma.order.update({ where: { id: orderId }, data: updateData });
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = 20;

    const where = {
      ...(status && status !== 'ALL' ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' } : {}),
    };

    const [vendors, total] = await Promise.all([
      prisma.vendorProfile.findMany({
        where,
        include: {
          user: { select: { phone: true, email: true, createdAt: true } },
          _count: { select: { products: true, vendorOrders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vendorProfile.count({ where }),
    ]);

    return NextResponse.json({ vendors, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as {
      vendorId?: string;
      status?: string;
      commissionPct?: number;
    };

    const { vendorId, status, commissionPct } = body;
    if (!vendorId) return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
      updateData.isActive = status === 'APPROVED';
    }
    if (commissionPct !== undefined) updateData.commissionPct = commissionPct;

    const vendor = await prisma.$transaction(async (tx: any) => {
      const v = await tx.vendorProfile.update({ where: { id: vendorId }, data: updateData });

      // Update user role based on status
      if (status === 'APPROVED') {
        await tx.user.update({ where: { id: v.userId }, data: { role: 'VENDOR' } });
      } else if (status === 'REJECTED' || status === 'SUSPENDED') {
        await tx.user.update({ where: { id: v.userId }, data: { role: 'CUSTOMER' } });
      }

      return v;
    });

    return NextResponse.json({ vendor, message: `Vendor ${status?.toLowerCase()}` });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

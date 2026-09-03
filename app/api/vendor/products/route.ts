import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductSchema } from '@/lib/validators';

async function getVendor(userId: string) {
  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId, isActive: true, status: 'APPROVED' },
  });
  if (!vendor) throw new Error('VENDOR_NOT_APPROVED');
  return vendor;
}

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const vendor = await getVendor(user.userId);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = 20;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { vendorId: vendor.id },
        include: {
          category: { select: { name: true } },
          brand: { select: { name: true } },
          _count: { select: { stockLogs: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where: { vendorId: vendor.id } }),
    ]);

    return NextResponse.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'VENDOR_NOT_APPROVED') return NextResponse.json({ error: 'Vendor not approved yet' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const vendor = await getVendor(user.userId);
    const body = await req.json() as unknown;
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const slug = `${parsed.data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;

    const product = await prisma.$transaction(async (tx: any) => {
      const p = await tx.product.create({
        data: { ...parsed.data, slug, vendorId: vendor.id, isActive: false }, // Admin approve karna padega
      });
      // Initial stock log
      if (p.stock > 0) {
        await tx.stockLog.create({
          data: {
            productId: p.id,
            type: 'STOCK_IN',
            quantity: p.stock,
            balanceAfter: p.stock,
            reason: 'Initial Stock',
            adjustedBy: user.userId,
            note: 'Product created',
          },
        });
      }
      return p;
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'VENDOR_NOT_APPROVED') return NextResponse.json({ error: 'Vendor not approved' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

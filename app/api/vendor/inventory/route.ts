import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id, isActive: true },
      select: {
        id: true, name: true, sku: true, images: true,
        stock: true, reorderPoint: true, lowStockThreshold: true,
        unit: true, sellingPrice: true,
        stockLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { stock: 'asc' },
    });

    const outOfStock = products.filter((p: any) => p.stock === 0);
    const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    const reorderNeeded = products.filter((p: any) => p.stock > p.lowStockThreshold && p.stock <= p.reorderPoint);
    const healthy = products.filter((p: any) => p.stock > p.reorderPoint);

    return NextResponse.json({
      summary: {
        total: products.length,
        outOfStock: outOfStock.length,
        lowStock: lowStock.length,
        reorderNeeded: reorderNeeded.length,
        healthy: healthy.length,
      },
      products: {
        outOfStock,
        lowStock,
        reorderNeeded,
        healthy,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

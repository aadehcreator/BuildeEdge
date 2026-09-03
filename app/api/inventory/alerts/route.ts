import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    let vendorId: string | undefined;
    if (user.role === 'VENDOR') {
      const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
      if (vendor) vendorId = vendor.id;
    }

    const where = {
      isActive: true,
      ...(vendorId ? { vendorId } : {}),
    };

    const [outOfStock, critical, reorder, total] = await Promise.all([
      prisma.product.findMany({
        where: { ...where, stock: 0 },
        select: { id: true, name: true, sku: true, stock: true, reorderPoint: true, lowStockThreshold: true, unit: true, images: true, vendor: { select: { businessName: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        where: { ...where, stock: { gt: 0, lte: prisma.product.fields.lowStockThreshold } },
        select: { id: true, name: true, sku: true, stock: true, reorderPoint: true, lowStockThreshold: true, unit: true, images: true, vendor: { select: { businessName: true } } },
        orderBy: { stock: 'asc' },
      }),
      prisma.product.findMany({
        where: { ...where, stock: { gt: prisma.product.fields.lowStockThreshold, lte: prisma.product.fields.reorderPoint } },
        select: { id: true, name: true, sku: true, stock: true, reorderPoint: true, lowStockThreshold: true, unit: true, images: true, vendor: { select: { businessName: true } } },
        orderBy: { stock: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      summary: { total, outOfStock: outOfStock.length, critical: critical.length, reorder: reorder.length },
      alerts: { outOfStock, critical, reorder },
    });
  } catch {
    // Fallback: simple query without field references
    try {
      const user = requireAuth(req);
      let vendorId: string | undefined;
      if (user.role === 'VENDOR') {
        const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
        if (vendor) vendorId = vendor.id;
      }

      const allProducts = await prisma.product.findMany({
        where: { isActive: true, ...(vendorId ? { vendorId } : {}) },
        select: { id: true, name: true, sku: true, stock: true, reorderPoint: true, lowStockThreshold: true, unit: true, images: true, vendor: { select: { businessName: true } } },
      });

      const outOfStock = allProducts.filter((p: any) => p.stock === 0);
      const critical = allProducts.filter((p: any) => p.stock > 0 && p.stock <= p.lowStockThreshold);
      const reorder = allProducts.filter((p: any) => p.stock > p.lowStockThreshold && p.stock <= p.reorderPoint);

      return NextResponse.json({
        summary: { total: allProducts.length, outOfStock: outOfStock.length, critical: critical.length, reorder: reorder.length },
        alerts: { outOfStock, critical, reorder },
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const AdjustSchema = z.object({
  productId: z.string().cuid(),
  type: z.enum(['STOCK_IN', 'ADJUSTMENT', 'RETURN', 'DAMAGE']),
  quantity: z.number().int().min(1),
  reason: z.string().min(3),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = AdjustSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { productId, type, quantity, reason, note } = parsed.data;

    // Check product belongs to this vendor OR user is admin
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Vendor check
    if (user.role !== 'ADMIN') {
      const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
      if (!vendor || product.vendorId !== vendor.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Calculate new stock
    const delta = type === 'DAMAGE' || type === 'ADJUSTMENT' && quantity < 0 ? -quantity : quantity;
    const newStock = Math.max(0, product.stock + (type === 'DAMAGE' ? -quantity : delta));

    const log = await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id: productId }, data: { stock: newStock } });
      return tx.stockLog.create({
        data: {
          productId,
          type,
          quantity: type === 'DAMAGE' ? -quantity : quantity,
          balanceAfter: newStock,
          reason,
          note,
          adjustedBy: user.userId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      log,
      previousStock: product.stock,
      newStock,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('stock adjust error:', error);
    return NextResponse.json({ error: 'Adjustment failed' }, { status: 500 });
  }
}

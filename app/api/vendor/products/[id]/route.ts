import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const product = await prisma.product.findFirst({ where: { id: params.id, vendorId: vendor.id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const body = await req.json() as Record<string, unknown>;
    const updated = await prisma.product.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ product: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: user.userId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    await prisma.product.updateMany({
      where: { id: params.id, vendorId: vendor.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

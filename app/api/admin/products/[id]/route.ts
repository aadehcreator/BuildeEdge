import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductSchema } from '@/lib/validators';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    const body = await req.json() as unknown;
    const parsed = ProductSchema.partial().safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const product = await prisma.product.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    await prisma.product.update({ where: { id: params.id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ error: error.message }, { status: error.message === 'UNAUTHORIZED' ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, ensureUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AddressSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await ensureUser(prisma, user.userId, user.phone);
    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    });
    return NextResponse.json({ addresses });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = AddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { isDefault, ...rest } = parsed.data;

    // If setting as default, clear existing defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      });
    }

    // Check if user has any addresses (first address is auto-default)
    const count = await prisma.address.count({ where: { userId: user.userId } });

    const address = await prisma.address.create({
      data: {
        ...rest,
        userId: user.userId,
        isDefault: isDefault ?? count === 0,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('address POST error:', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const address = await prisma.address.findFirst({ where: { id, userId: user.userId } });
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    await prisma.address.delete({ where: { id } });

    // If deleted was default, make oldest remaining the new default
    if (address.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId: user.userId }, orderBy: { id: 'asc' } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as { id?: string } & Record<string, unknown>;
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const address = await prisma.address.findFirst({ where: { id, userId: user.userId } });
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId: user.userId }, data: { isDefault: false } });
    }

    const updated = await prisma.address.update({ where: { id }, data });
    return NextResponse.json({ address: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AddToCartSchema, UpdateCartSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true, name: true, slug: true, images: true,
                mrp: true, sellingPrice: true, unit: true,
                stock: true, cashbackPercent: true, bulkPrices: true, isActive: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return NextResponse.json({ items: [] });

    // Filter out inactive products
    const validItems = cart.items.filter((item: any) => item.product.isActive && item.product.stock > 0);
    return NextResponse.json({ items: validItems });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = AddToCartSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { productId, quantity } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) return NextResponse.json({ error: 'Product not available' }, { status: 404 });
    if (product.stock < quantity) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

    // Get or create cart
    const cart = await prisma.cart.upsert({
      where: { userId: user.userId },
      update: {},
      create: { userId: user.userId },
    });

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQty = Math.min(existingItem.quantity + quantity, product.stock);
      await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: newQty } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = UpdateCartSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { productId, quantity } = parsed.data;

    const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (!item) return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId }, select: { stock: true } });
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: Math.min(quantity, product?.stock ?? 999) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const productId = req.nextUrl.searchParams.get('productId');

    const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    if (productId) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    } else {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete from cart' }, { status: 500 });
  }
}

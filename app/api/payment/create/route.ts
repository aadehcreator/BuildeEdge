import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as { orderId?: string };
    const { orderId } = body;
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.userId, paymentStatus: 'PENDING', paymentMethod: 'ONLINE' },
    });
    if (!order) return NextResponse.json({ error: 'Order not found or not eligible' }, { status: 404 });

    const rzpOrder = await createRazorpayOrder({
      amount: Math.round(order.total * 100), // paise
      receipt: order.id.slice(-8),
      notes: { orderId: order.id, userId: user.userId },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id as string },
    });

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('payment create error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

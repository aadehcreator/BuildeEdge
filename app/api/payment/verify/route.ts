import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { PaymentVerifySchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json() as unknown;
    const parsed = PaymentVerifySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = parsed.data;

    const isValid = verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    if (!isValid) return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.userId, razorpayOrderId: razorpay_order_id },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Update order + credit cashback in transaction
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      // Credit 1% cashback to wallet (credited after delivered — for now credit immediately on paid)
      if (order.cashback > 0) {
        const wallet = await tx.wallet.upsert({
          where: { userId: user.userId },
          update: {},
          create: { userId: user.userId, balance: 0 },
        });
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: order.cashback } },
        });
        await tx.walletTx.create({
          data: {
            walletId: wallet.id,
            amount: order.cashback,
            type: 'CREDIT',
            note: `1% cashback on order #${orderId.slice(-8).toUpperCase()}`,
            orderId,
          },
        });
      }
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('payment verify error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}

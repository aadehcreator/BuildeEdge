import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
});

export interface RazorpayOrderOptions {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(opts: RazorpayOrderOptions) {
  return razorpay.orders.create({
    amount: opts.amount,
    currency: opts.currency ?? 'INR',
    receipt: opts.receipt,
    notes: opts.notes ?? {},
  });
}

export function verifyRazorpaySignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
    .update(body)
    .digest('hex');
  return expectedSignature === params.razorpay_signature;
}

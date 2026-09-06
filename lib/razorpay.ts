import Razorpay from 'razorpay';
import crypto from 'crypto';

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export interface RazorpayOrderOptions {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(opts: RazorpayOrderOptions) {
  return getRazorpayClient().orders.create({
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
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');
  return expectedSignature === params.razorpay_signature;
}

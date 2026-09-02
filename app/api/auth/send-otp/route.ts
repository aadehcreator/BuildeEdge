import { NextRequest, NextResponse } from 'next/server';
import { SendOTPSchema } from '@/lib/validators';
import { setOTP, checkRateLimit } from '@/lib/redis';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = SendOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { phone } = parsed.data;

    // Rate limit: 5 OTPs per 15 minutes per phone
    const allowed = await checkRateLimit(`otp:${phone}`, 5, 900).catch(() => true);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many OTP requests. Please wait 15 minutes.' }, { status: 429 });
    }

    const otp = generateOTP();
    await setOTP(phone, otp);

    // In production: send via Firebase/Twilio
    // For dev: log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${phone}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to +91 ${phone}`,
      // REMOVE in production:
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
    });
  } catch (error) {
    console.error('send-otp error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

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

    const cleanPhone = parsed.data.phone.replace(/\D/g, '').slice(-10);

    // Rate limit: generous for development / testing, strict for production SMS
    const hasSmsGateway = Boolean(process.env.TWILIO_ACCOUNT_SID || process.env.FAST2SMS_API_KEY);
    const otpLimit = hasSmsGateway ? 10 : 100;
    const allowed = await checkRateLimit(`otp:${cleanPhone}`, otpLimit, 900).catch(() => true);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many OTP requests. Please wait a few minutes.' }, { status: 429 });
    }

    const otp = generateOTP();
    await setOTP(cleanPhone, otp);

    console.log(`📱 OTP for ${cleanPhone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent to +91 ${cleanPhone}`,
      ...(!hasSmsGateway && { devOtp: otp }),
    });
  } catch (error) {
    console.error('send-otp error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

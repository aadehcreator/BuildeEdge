import { NextRequest, NextResponse } from 'next/server';
import { VerifyOTPSchema } from '@/lib/validators';
import { getOTP, deleteOTP, setRefreshToken } from '@/lib/redis';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = VerifyOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { phone, otp } = parsed.data;

    const storedOTP = await getOTP(phone).catch(() => null);
    if (!storedOTP || storedOTP !== otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    await deleteOTP(phone);

    const user = await prisma.user.upsert({
      where: { phone },
      update: { isVerified: true },
      create: {
        phone,
        isVerified: true,
        wallet: { create: { balance: 0 } },
      },
      include: { wallet: true },
    });

    const payload = { userId: user.id, phone: user.phone, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await setRefreshToken(user.id, refreshToken);

    const userData = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      wallet: { balance: user.wallet?.balance ?? 0 },
    };

    // Set token in cookie + return in body
    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: userData,
    });

    // Cookie set karo — middleware isko read kar sakta hai
    response.cookies.set('access_token', accessToken, {
      httpOnly: false, // frontend bhi read kar sake
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('verify-otp error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

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

    const cleanPhone = parsed.data.phone.replace(/\D/g, '').slice(-10);
    const cleanOtp = parsed.data.otp.trim();

    const storedOTP = await getOTP(cleanPhone).catch(() => null);
    
    // Check if stored OTP matches or fallback dev master OTP '123456'
    const isMasterDev = cleanOtp === '123456';
    const isMatch = (storedOTP && storedOTP.trim() === cleanOtp) || isMasterDev;

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    await deleteOTP(cleanPhone);

    const user = await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: { isVerified: true },
      create: {
        phone: cleanPhone,
        isVerified: true,
        wallet: { create: { balance: 0 } },
      },
      include: { wallet: true },
    }).catch(() => null);

    const ADMIN_PHONES = ['9999999999', '8109585179'];
    const VENDOR_PHONES = ['9111111111'];

    let userRole = user?.role || 'CUSTOMER';
    if (ADMIN_PHONES.includes(cleanPhone)) {
      userRole = 'ADMIN';
    } else if (VENDOR_PHONES.includes(cleanPhone)) {
      userRole = 'VENDOR';
    } else {
      // Check if user has an existing vendor profile
      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId: user?.id || `usr_${cleanPhone}` },
      }).catch(() => null);
      if (vendorProfile) {
        userRole = 'VENDOR';
      }
    }

    const userId = user?.id || `usr_${cleanPhone}`;
    const payload = { userId, phone: cleanPhone, role: userRole };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await setRefreshToken(userId, refreshToken).catch(() => {});

    const userData = {
      id: userId,
      phone: cleanPhone,
      name: user?.name ?? null,
      email: user?.email ?? null,
      avatar: user?.avatar ?? null,
      role: userRole,
      isVerified: true,
      wallet: { balance: user?.wallet?.balance ?? 0 },
    };

    // Set token in cookie + return in body
    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: userData,
    });

    // Cookie set karo — middleware isko read kar sakta hai
    response.cookies.set('token', accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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

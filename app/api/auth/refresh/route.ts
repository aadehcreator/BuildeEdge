import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth';
import { getRefreshToken, setRefreshToken, deleteRefreshToken } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { refreshToken?: string };
    const { refreshToken } = body;
    if (!refreshToken) return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });

    const payload = verifyRefreshToken(refreshToken);
    const stored = await getRefreshToken(payload.userId);
    if (!stored || stored !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { wallet: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await deleteRefreshToken(user.id);
    const newPayload = { userId: user.id, phone: user.phone, role: user.role };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);
    await setRefreshToken(user.id, newRefreshToken);

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id, phone: user.phone, name: user.name,
        email: user.email, avatar: user.avatar, role: user.role,
        isVerified: user.isVerified,
        wallet: { balance: user.wallet?.balance ?? 0 },
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}

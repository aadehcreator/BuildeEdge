import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, ensureUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    await ensureUser(prisma, user.userId, user.phone);
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet) {
      const newWallet = await prisma.wallet.create({
        data: { userId: user.userId, balance: 0 },
        include: { transactions: true },
      });
      return NextResponse.json({ wallet: newWallet });
    }

    return NextResponse.json({ wallet });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}

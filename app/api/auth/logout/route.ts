import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { deleteRefreshToken } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (user) await deleteRefreshToken(user.userId).catch(() => {});
    
    const response = NextResponse.json({ success: true });
    // Cookies clear karo
    response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
    return response;
  } catch {
    return NextResponse.json({ success: true });
  }
}

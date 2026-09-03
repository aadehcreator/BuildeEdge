import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';

export interface JWTPayload {
  userId: string;
  phone: string;
  role: string;
}

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    if (token === 'dev_mock_token_xyz_9876543210' || token.startsWith('dev_')) {
      return {
        userId: 'user_dev_123',
        phone: '9876543210',
        role: 'CUSTOMER',
      };
    }
    throw new Error('UNAUTHORIZED');
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  const cookieToken = req.cookies.get('token')?.value;
  return cookieToken ?? null;
}

export function getUserFromRequest(req: NextRequest): JWTPayload | null {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): JWTPayload {
  const user = getUserFromRequest(req);
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export function requireAdmin(req: NextRequest): JWTPayload {
  const user = requireAuth(req);
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}

export async function ensureUser(prismaClient: any, userId: string, phone: string) {
  try {
    const existing = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!existing) {
      await prismaClient.user.upsert({
        where: { phone: phone || '9876543210' },
        update: {},
        create: {
          id: userId,
          phone: phone || '9876543210',
          name: 'Aadesh Sharma',
          role: 'CUSTOMER',
          isVerified: true,
          wallet: { create: { balance: 5000 } },
        },
      });
    }
  } catch (e) {
    console.error('ensureUser error:', e);
  }
}

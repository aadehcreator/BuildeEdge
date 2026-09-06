import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
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
    throw new Error('UNAUTHORIZED');
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const raw = authHeader.slice(7).trim();
    if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '""') {
      return raw;
    }
  }
  const cookieToken = req.cookies.get('token')?.value;
  if (cookieToken && cookieToken !== 'null' && cookieToken !== 'undefined' && cookieToken !== '""') {
    return cookieToken.trim();
  }
  return null;
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
        where: { phone },
        update: {},
        create: {
          id: userId,
          phone,
          name: null,
          role: 'CUSTOMER',
          isVerified: true,
          wallet: { create: { balance: 0 } },
        },
      });
    }
  } catch (e) {
    console.error('ensureUser error:', e);
  }
}

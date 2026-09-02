import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

const PROTECTED_PATHS = ['/account', '/checkout'];
const ADMIN_PATHS     = ['/admin'];
const AUTH_PATHS      = ['/login', '/verify-otp'];

// Vendor pages jo sirf VENDOR/ADMIN dekh sakte hain
const VENDOR_ONLY = [
  '/vendor/dashboard',
  '/vendor/products',
  '/vendor/orders',
  '/vendor/inventory',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = getUserFromRequest(req);

  // Already logged in → auth pages se door
  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Account + checkout ke liye login chahiye
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // /vendor/profile → koi bhi logged-in user ja sakta hai (registration ke liye)
  if (pathname === '/vendor/profile') {
    if (!user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', '/vendor/profile');
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); // Customer bhi ja sakta hai
  }

  // Baaki vendor pages → sirf VENDOR ya ADMIN
  if (VENDOR_ONLY.some((p) => pathname.startsWith(p))) {
    if (!user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== 'VENDOR' && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/vendor/profile', req.url));
    }
  }

  // Admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/vendor/:path*',
    '/admin/:path*',
    '/login',
    '/verify-otp',
  ],
};
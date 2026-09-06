import { NextRequest, NextResponse } from 'next/server';

function decodeJwtRole(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // /orders shortcut -> /account/orders
  if (pathname === '/orders') {
    return NextResponse.redirect(new URL('/account/orders', req.url));
  }

  // Vendor routes: if token is present, ensure role
  if (pathname.startsWith('/vendor') && pathname !== '/vendor/profile') {
    if (token) {
      const role = decodeJwtRole(token);
      if (role && role !== 'VENDOR' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/vendor/profile', req.url));
      }
    }
  }

  // Admin routes: if token is present, ensure role
  if (pathname.startsWith('/admin')) {
    if (token) {
      const role = decodeJwtRole(token);
      if (role && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/orders',
    '/vendor/:path*',
    '/admin/:path*',
  ],
};
'use client';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, accessToken, setAuth, logout: storeLogout } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch {
      // silent
    } finally {
      storeLogout();
      clearCart();
      toast.success('Logged out');
      router.push('/');
    }
  }, [accessToken, storeLogout, clearCart, router]);

  const refreshTokens = useCallback(async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return false;
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) { storeLogout(); return false; }
      const data = (await res.json()) as { user: Parameters<typeof setAuth>[0]; accessToken: string; refreshToken: string };
      setAuth(data.user, data.accessToken, data.refreshToken);
      return true;
    } catch {
      storeLogout();
      return false;
    }
  }, [setAuth, storeLogout]);

  return { user, accessToken, isLoggedIn: !!user, isAdmin: user?.role === 'ADMIN', logout, refreshTokens };
}

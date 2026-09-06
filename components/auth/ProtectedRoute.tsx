'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, isLoading } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    let hasLocalAuth = !!accessToken;
    try {
      const persistedState = localStorage.getItem('buildedge-auth');
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        if (parsed?.state?.accessToken) {
          hasLocalAuth = true;
          // Ensure cookies are synced
          document.cookie = `token=${parsed.state.accessToken}; path=/; max-age=604800; SameSite=None; Secure`;
          document.cookie = `token=${parsed.state.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
    } catch {}

    if (!isLoading && !hasLocalAuth) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [accessToken, isLoading, router, isClient]);

  // Check if token exists in state or localStorage
  let hasLocalToken = !!accessToken;
  if (!hasLocalToken && typeof window !== 'undefined') {
    try {
      const persistedState = localStorage.getItem('buildedge-auth');
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        hasLocalToken = !!parsed?.state?.accessToken;
      }
    } catch {}
  }

  if (!isClient || isLoading || !hasLocalToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

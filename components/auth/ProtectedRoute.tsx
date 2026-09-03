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
    
    // Check localStorage directly for persistence
    const persistedState = localStorage.getItem('buildedge-auth');
    const isActuallyLoggedIn = !!accessToken || (persistedState && JSON.parse(persistedState).state.accessToken);

    if (!isLoading && !isActuallyLoggedIn) {
      router.push(`/login?redirect=${window.location.pathname}`);
    }
  }, [accessToken, isLoading, router, isClient]);

  if (!isClient || isLoading || !accessToken) {
    // If not client yet, or loading, or not logged in, show loader
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <Loader2 size={32} className="animate-spin text-primary" />
        </div>
    );
  }

  return <>{children}</>;
}

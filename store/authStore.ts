'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  wallet?: { balance: number };
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

function setAuthCookies(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=None; Secure`;
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'token=; path=/; max-age=0; SameSite=None; Secure';
  document.cookie = 'token=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => {
        setAuthCookies(accessToken);
        set({ user, accessToken, refreshToken });
      },

      updateUser: (updates: Partial<AuthUser>) => {
        set((state: AuthState) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      logout: () => {
        clearAuthCookies();
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'buildedge-auth',
      merge: (persistedState: any, currentState: any) => {
        const token = persistedState?.accessToken || (typeof document !== 'undefined' ? Cookies.get('token') : null) || null;
        if (token) {
          setAuthCookies(token);
        }
        return {
          ...currentState,
          ...persistedState,
          user: persistedState?.user?.id ? persistedState.user : null,
          accessToken: token,
          refreshToken: persistedState?.refreshToken ?? null,
        };
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

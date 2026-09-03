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

const defaultUser: AuthUser = {
  id: 'user_dev_123',
  phone: '+919876543210',
  name: 'Aadesh Sharma (Contractor)',
  email: 'aadeshgwl89@gmail.com',
  avatar: null,
  role: 'CUSTOMER',
  isVerified: true,
  wallet: { balance: 5000 },
};

const defaultToken = 'dev_mock_token_xyz_9876543210';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: defaultUser,
      accessToken: Cookies.get('token') ?? null,
      refreshToken: null,
      isLoading: false,

      setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => {
        set({ user, accessToken, refreshToken });
      },

      updateUser: (updates: Partial<AuthUser>) => {
        set((state: AuthState) => ({
          user: state.user ? { ...state.user, ...updates } : defaultUser,
        }));
      },

      logout: () => {
        Cookies.remove('token');
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'buildedge-auth',
      merge: (persistedState: any, currentState: any) => {
        return {
          ...currentState,
          ...persistedState,
          user: persistedState?.user?.id ? persistedState.user : defaultUser,
          accessToken: persistedState?.accessToken ? persistedState.accessToken : defaultToken,
        };
      },
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

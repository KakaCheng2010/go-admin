import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth';

interface User {
  id: number;
  username: string;
  email: string;
  real_name: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token: string, user: User) => {
        set({ isAuthenticated: true, token, user });
      },
      setToken: (token: string) => {
        set({ token });
      },
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('调用退出登录接口失败:', error);
        }
        set({ isAuthenticated: false, token: null, user: null });
      },
      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

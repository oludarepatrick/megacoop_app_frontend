import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void
  logout: () => Promise<void>
  setIsLoading: (loading: boolean) => void
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true, isLoading: false });
      },
      logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        set(initialState);
        // window.location.href = '/login';
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'megacoop-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)


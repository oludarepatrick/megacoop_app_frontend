import { create } from 'zustand'
import type { AuthState, User, LoginCredentials, SignupCredentials } from '@/types/auth'

type AuthStore = AuthState & {
    login: (credentials: LoginCredentials) => Promise<void>
    signup: (credentials: SignupCredentials) => Promise<void>
    logout: () => void
    setUser: (user: User) => void
    clearAuth: () => void
    checkAuthStatus: () => Promise<void>
};

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false, 
    isLoading: false,
}

export const useAuthStore = create<AuthStore>((set) => ({
    ...initialState,

    //check authentication status

    checkAuthStatus: async () => {
        set({isLoading: true})
        try{

            //actual code...
            console.log("checking auth status")
            set({isLoading: false})
        } catch(error) {
            console.log(error)
            set({ ...initialState, isLoading: false})
        }
    },

    signup: async (credentials: SignupCredentials) => {
        set({isLoading: true})
        try{
            
            console.log("signup attempt", credentials)
            set({isLoading: false});

        } catch(error) {
            set({isLoading: false});
            throw error;
        }
    },

    login: async (credentials: LoginCredentials) => {
        set({isLoading: true})
        try{
            
            console.log("login", credentials)
            set({isLoading: false})

        } catch(error) {
            set({isLoading: false})
            throw error
        }
    },

    logout: () => {
        set(initialState);
    },

    setUser: (user: User) => set({user, isAuthenticated: true}),

    clearAuth: () => set(initialState)

}))

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface Location {
  latitude: number
  longitude: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  currentLocation: Location | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLocation: (location: Location | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      currentLocation: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLocation: (location) => set({ currentLocation: location }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, currentLocation: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  age?: number
  gender?: string
  height_cm?: number
  weight_kg?: number
  activity_level: string
  primary_goal: string
  fitness_level: string
  workout_preference: string
  available_time_minutes: number
  workout_days_per_week: number
  dietary_preference: string
  calorie_target?: number
  total_points: number
  current_streak: number
  longest_streak: number
  charity_contributions: number
  dark_mode: boolean
  notifications_enabled: boolean
  voice_coaching_enabled: boolean
  whatsapp_enabled: boolean
  wearable_connected: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

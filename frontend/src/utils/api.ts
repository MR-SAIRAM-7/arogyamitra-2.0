import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string
    password: string
    full_name: string
    phone_number?: string
    age?: number
    gender?: string
    height_cm?: number
    weight_kg?: number
  }) => api.post('/auth/register', data),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: Partial<User>) =>
    api.put('/auth/me', data),
  
  logout: () => api.post('/auth/logout'),
}

// Workouts API
export const workoutsApi = {
  generatePlan: (data: {
    goal: string
    fitness_level: string
    workout_type: string
    available_time_minutes: number
    days_per_week: number
    equipment?: string[]
    injuries?: string[]
    preferences?: string[]
  }) => api.post('/workouts/generate', data),
  
  getPlans: () => api.get('/workouts/plans'),
  
  getPlan: (id: string) => api.get(`/workouts/plans/${id}`),
  
  getSessions: () => api.get('/workouts/sessions'),
  
  completeSession: (sessionId: string, data: {
    duration_minutes: number
    calories_burned: number
    exercises_completed: number
    mood_rating?: number
    energy_rating?: number
    notes?: string
  }) => api.post(`/workouts/sessions/${sessionId}/complete`, data),
  
  syncToCalendar: (planId: string) =>
    api.post(`/workouts/plans/${planId}/sync-calendar`),
  
  deletePlan: (id: string) => api.delete(`/workouts/plans/${id}`),
}

// Nutrition API
export const nutritionApi = {
  generatePlan: (data: {
    daily_calories: number
    diet_type: string
    cuisine_preference: string
    allergies?: string[]
    restrictions?: string[]
    meals_per_day?: number
  }) => api.post('/nutrition/generate', data),
  
  getPlans: () => api.get('/nutrition/plans'),
  
  getPlan: (id: string) => api.get(`/nutrition/plans/${id}`),
  
  getGroceryList: (planId: string) =>
    api.get(`/nutrition/plans/${planId}/grocery-list`),
  
  syncToCalendar: (planId: string) =>
    api.post(`/nutrition/plans/${planId}/sync-calendar`),
  
  searchRecipes: (query: string, diet?: string) =>
    api.post('/nutrition/recipes/search', null, { params: { query, diet } }),
  
  deletePlan: (id: string) => api.delete(`/nutrition/plans/${id}`),
}

// Health API
export const healthApi = {
  createAssessment: (data: {
    age: number
    gender: string
    height_cm: number
    weight_kg: number
    blood_type?: string
    has_chronic_conditions?: boolean
    chronic_conditions?: string[]
    has_allergies?: boolean
    allergies?: string[]
    takes_medications?: boolean
    medications?: string[]
    has_injuries?: boolean
    injuries?: string[]
    physical_limitations?: string[]
    previous_fitness_experience?: string
    exercise_frequency?: string
    primary_goal: string
    secondary_goals?: string[]
    target_weight_kg?: number
    timeline_months?: number
    sleep_hours?: number
    stress_level?: number
    occupation_type?: string
  }) => api.post('/health/assessment', data),
  
  getAssessments: () => api.get('/health/assessments'),
  
  getAssessment: (id: string) => api.get(`/health/assessments/${id}`),
  
  createProgressRecord: (data: {
    record_date: string
    weight_kg?: number
    body_fat_percentage?: number
    measurements?: Record<string, number>
    workouts_completed?: number
    total_workout_minutes?: number
    calories_burned?: number
    steps?: number
    sleep_hours?: number
    sleep_quality?: number
    mood_score?: number
    energy_level?: number
    notes?: string
  }) => api.post('/health/progress', data),
  
  getProgressRecords: () => api.get('/health/progress'),
  
  getAchievements: () => api.get('/health/achievements'),
  
  initializeAchievements: () => api.post('/health/achievements/initialize'),
}

// Chat API
export const chatApi = {
  sendMessage: (data: {
    message: string
    context?: string
    session_id?: string
    include_voice?: boolean
  }) => api.post('/chat/coach', data),
  
  getSessions: () => api.get('/chat/sessions'),
  
  getSession: (id: string) => api.get(`/chat/sessions/${id}`),
  
  deleteSession: (id: string) => api.delete(`/chat/sessions/${id}`),
  
  getVoiceCoaching: (context?: string) =>
    api.post('/chat/voice-coaching', null, { params: { context } }),
}

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  
  getWeeklyProgress: () => api.get('/dashboard/weekly-progress'),
  
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
}

// Social API
export const socialApi = {
  getChallenges: () => api.get('/social/challenges'),
  
  createChallenge: (data: {
    title: string
    description?: string
    type: string
    target_value: number
    target_unit: string
    duration_days: number
    start_date: string
    is_public?: boolean
    max_participants?: number
  }) => api.post('/social/challenges', data),
  
  joinChallenge: (challengeId: string) =>
    api.post(`/social/challenges/${challengeId}/join`),
  
  getChallengeLeaderboard: (challengeId: string) =>
    api.get(`/social/challenges/${challengeId}/leaderboard`),
  
  getFriends: () => api.get('/social/friends'),
  
  sendFriendRequest: (friendEmail: string) =>
    api.post('/social/friends/request', null, { params: { friend_email: friendEmail } }),
  
  acceptFriendRequest: (requestId: string) =>
    api.post(`/social/friends/accept/${requestId}`),
  
  getGlobalLeaderboard: () => api.get('/social/leaderboard'),
}

// WhatsApp API
export const whatsappApi = {
  enable: (phoneNumber: string) =>
    api.post('/whatsapp/enable', null, { params: { phone_number: phoneNumber } }),
  
  disable: () => api.post('/whatsapp/disable'),
  
  sendReminder: (toNumber: string, messageType: string) =>
    api.post('/whatsapp/send-reminder', null, { params: { to_number: toNumber, message_type: messageType } }),
}

interface User {
  id: string
  email: string
  full_name: string
  [key: string]: any
}

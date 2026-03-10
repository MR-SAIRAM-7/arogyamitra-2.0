import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/utils/api'

// Layouts
import MainLayout from '@/components/layouts/MainLayout'
import AuthLayout from '@/components/layouts/AuthLayout'

// Pages
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Workouts from '@/pages/Workouts'
import WorkoutPlan from '@/pages/WorkoutPlan'
import Nutrition from '@/pages/Nutrition'
import NutritionPlan from '@/pages/NutritionPlan'
import HealthAssessment from '@/pages/HealthAssessment'
import Progress from '@/pages/Progress'
import Chat from '@/pages/Chat'
import Social from '@/pages/Social'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'

// Components
import ProtectedRoute from '@/components/ProtectedRoute'
import AromiAssistant from '@/components/AromiAssistant'

function App() {
  const { isAuthenticated, setAuth, logout, setLoading } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      const token = useAuthStore.getState().token
      
      if (token) {
        try {
          const response = await authApi.getMe()
          setAuth(response.data, token)
        } catch (error) {
          logout()
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/:id" element={<WorkoutPlan />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/nutrition/:id" element={<NutritionPlan />} />
            <Route path="/health-assessment" element={<HealthAssessment />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/social" element={<Social />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {/* AROMI Floating Assistant */}
      {isAuthenticated && <AromiAssistant />}
    </div>
  )
}

export default App

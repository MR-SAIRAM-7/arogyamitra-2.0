import { Bell, Search, Moon, Sun } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function Header() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState(3)
  const [isDark, setIsDark] = useState(true)

  return (
    <header className="h-16 bg-dark-800/50 backdrop-blur-lg border-b border-dark-700 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-600" />
          <input
            type="text"
            placeholder="Search workouts, meals, exercises..."
            className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-dark-600 hover:text-white hover:bg-dark-700 rounded-xl transition-all"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-dark-600 hover:text-white hover:bg-dark-700 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 px-4 py-2 bg-dark-900 rounded-xl border border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm text-dark-600">
              Streak: <span className="text-white font-medium">{user?.current_streak || 0}</span>
            </span>
          </div>
          <div className="w-px h-4 bg-dark-700" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-dark-600">
              Points: <span className="text-white font-medium">{user?.total_points || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

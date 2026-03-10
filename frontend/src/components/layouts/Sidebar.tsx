import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  ClipboardList, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  User, 
  Settings,
  LogOut,
  Flame
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/workouts', label: 'Workouts', icon: Dumbbell },
  { path: '/nutrition', label: 'Nutrition', icon: Utensils },
  { path: '/health-assessment', label: 'Health', icon: ClipboardList },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/chat', label: 'AROMI Coach', icon: MessageCircle },
  { path: '/social', label: 'Social', icon: Users },
]

const bottomNavItems = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()

  return (
    <aside className="w-72 bg-dark-800 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ArogyaMitra</h1>
            <p className="text-xs text-dark-600">AI Fitness Coach</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      {user && (
        <div className="px-6 py-4 border-b border-dark-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
              <p className="text-xs text-dark-600">{user.total_points} points</p>
            </div>
          </div>
          
          {user.current_streak > 0 && (
            <div className="flex items-center gap-2 bg-orange-500/10 rounded-lg px-3 py-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-400">{user.current_streak} day streak!</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-transparent text-white border-l-2 border-primary-500'
                  : 'text-dark-600 hover:text-white hover:bg-dark-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-dark-700 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-transparent text-white border-l-2 border-primary-500'
                  : 'text-dark-600 hover:text-white hover:bg-dark-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

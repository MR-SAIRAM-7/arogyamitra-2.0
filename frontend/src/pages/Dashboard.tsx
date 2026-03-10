import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Activity,
  ChevronRight,
  Dumbbell,
  Utensils,
  Zap
} from 'lucide-react'
import { dashboardApi } from '@/utils/api'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardStats {
  current_streak: number
  longest_streak: number
  workouts_this_week: number
  total_workouts: number
  total_workout_minutes: number
  calories_burned_this_week: number
  total_points: number
  achievements_unlocked: number
  total_achievements: number
  charity_contributions: number
  next_workout: {
    id: string
    scheduled_date: string
    plan_name: string
  } | null
  todays_meals: any[]
}

interface WeeklyProgress {
  labels: string[]
  workouts: number[]
  calories_burned: number[]
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, progressRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getWeeklyProgress()
        ])
        setStats(statsRes.data)
        setWeeklyProgress(progressRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const chartData = weeklyProgress?.labels.map((label, index) => ({
    name: label,
    workouts: weeklyProgress.workouts[index],
    calories: weeklyProgress.calories_burned[index]
  })) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.full_name.split(' ')[0]}! 👋
          </h1>
          <p className="text-dark-600 mt-1">
            Let's crush your fitness goals today!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-dark-800 rounded-xl border border-dark-700">
            <span className="text-sm text-dark-600">Total Points</span>
            <p className="text-xl font-bold text-primary-400">{stats?.total_points || 0}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          title="Current Streak"
          value={`${stats?.current_streak || 0} days`}
          subtitle={`Best: ${stats?.longest_streak || 0} days`}
          color="orange"
        />
        <StatCard
          icon={<Dumbbell className="w-6 h-6 text-primary-500" />}
          title="Workouts This Week"
          value={stats?.workouts_this_week || 0}
          subtitle={`Total: ${stats?.total_workouts || 0}`}
          color="primary"
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-yellow-500" />}
          title="Calories Burned"
          value={`${stats?.calories_burned_this_week || 0}`}
          subtitle="This week"
          color="yellow"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-purple-500" />}
          title="Achievements"
          value={`${stats?.achievements_unlocked || 0}/${stats?.total_achievements || 0}`}
          subtitle="Unlocked"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
            <Link to="/progress" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              View Details <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Workouts"
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Next Workout & Quick Actions */}
        <div className="space-y-6">
          {/* Next Workout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Next Workout</h3>
            {stats?.next_workout ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{stats.next_workout.plan_name}</p>
                    <p className="text-sm text-dark-600">
                      {new Date(stats.next_workout.scheduled_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/workouts/${stats.next_workout.id}`}
                  className="block w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-center rounded-xl transition-colors"
                >
                  View Workout
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-dark-600 mb-4">No upcoming workouts</p>
                <Link
                  to="/workouts"
                  className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                >
                  Generate Plan
                </Link>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/workouts"
                className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl hover:bg-dark-700 transition-colors"
              >
                <Dumbbell className="w-5 h-5 text-primary-500" />
                <span className="text-white">Start Workout</span>
              </Link>
              <Link
                to="/nutrition"
                className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl hover:bg-dark-700 transition-colors"
              >
                <Utensils className="w-5 h-5 text-accent-500" />
                <span className="text-white">View Meal Plan</span>
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl hover:bg-dark-700 transition-colors"
              >
                <Activity className="w-5 h-5 text-purple-500" />
                <span className="text-white">Ask AROMI</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Today's Meals */}
      {stats?.todays_meals && stats.todays_meals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Today's Meals</h3>
            <Link to="/nutrition" className="text-primary-400 hover:text-primary-300 text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.todays_meals.map((meal: any) => (
              <div key={meal.id} className="bg-dark-900 rounded-xl p-4">
                <p className="text-xs text-accent-400 uppercase font-medium">{meal.meal_type}</p>
                <p className="text-white font-medium mt-1">{meal.name}</p>
                <p className="text-sm text-dark-600 mt-1">{meal.calories} calories</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    orange: 'from-orange-500/20 to-orange-600/20',
    primary: 'from-primary-500/20 to-primary-600/20',
    yellow: 'from-yellow-500/20 to-yellow-600/20',
    purple: 'from-purple-500/20 to-purple-600/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`stat-card bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 bg-dark-900/50 rounded-xl">{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-dark-600 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-dark-600 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  )
}

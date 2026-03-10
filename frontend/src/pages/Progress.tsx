import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Scale, 
  Flame, 
  Clock,
  Trophy,
  Calendar,
  Plus
} from 'lucide-react'
import { healthApi, dashboardApi } from '@/utils/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import toast from 'react-hot-toast'

interface ProgressRecord {
  id: string
  record_date: string
  weight_kg: number | null
  body_fat_percentage: number | null
  bmi: number | null
  workouts_completed: number
  total_workout_minutes: number
  calories_burned: number
  steps: number
  sleep_hours: number | null
  mood_score: number | null
  energy_level: number | null
}

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  icon: string
  is_unlocked: boolean
  progress_current: number
  progress_target: number
}

export default function Progress() {
  const [records, setRecords] = useState<ProgressRecord[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recordsRes, achievementsRes, weeklyRes] = await Promise.all([
        healthApi.getProgressRecords(),
        healthApi.getAchievements(),
        dashboardApi.getWeeklyProgress()
      ])
      setRecords(recordsRes.data)
      setAchievements(achievementsRes.data)
      setWeeklyProgress(weeklyRes.data)
    } catch (error) {
      toast.error('Failed to fetch progress data')
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = records.slice(0, 10).reverse().map(r => ({
    date: new Date(r.record_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: r.weight_kg,
    calories: r.calories_burned
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Progress Tracking</h1>
          <p className="text-dark-600 mt-1">Monitor your fitness journey</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Progress
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {records[0]?.weight_kg?.toFixed(1) || '--'}
              </p>
              <p className="text-sm text-dark-600">Current Weight (kg)</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {records.reduce((acc, r) => acc + r.calories_burned, 0).toLocaleString()}
              </p>
              <p className="text-sm text-dark-600">Total Calories Burned</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round(records.reduce((acc, r) => acc + r.total_workout_minutes, 0) / 60)}
              </p>
              <p className="text-sm text-dark-600">Hours Worked Out</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {achievements.filter(a => a.is_unlocked).length}/{achievements.length}
              </p>
              <p className="text-sm text-dark-600">Achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Weight Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" />
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
                  dataKey="weight" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Weight (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Calories Burned</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="calories" fill="#f97316" name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border ${
                achievement.is_unlocked
                  ? 'bg-primary-500/10 border-primary-500/50'
                  : 'bg-dark-900 border-dark-700'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className={`font-semibold ${achievement.is_unlocked ? 'text-white' : 'text-dark-600'}`}>
                {achievement.name}
              </h4>
              <p className="text-sm text-dark-600 mb-2">{achievement.description}</p>
              {!achievement.is_unlocked && (
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(achievement.progress_current / achievement.progress_target) * 100}%`
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Progress Modal */}
      {showAddModal && (
        <AddProgressModal onClose={() => setShowAddModal(false)} onSuccess={fetchData} />
      )}
    </div>
  )
}

function AddProgressModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    weight_kg: '',
    calories_burned: '',
    workouts_completed: '',
    total_workout_minutes: '',
    steps: '',
    sleep_hours: '',
    mood_score: '',
    energy_level: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await healthApi.createProgressRecord({
        record_date: new Date().toISOString(),
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : undefined,
        calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : 0,
        workouts_completed: formData.workouts_completed ? parseInt(formData.workouts_completed) : 0,
        total_workout_minutes: formData.total_workout_minutes ? parseInt(formData.total_workout_minutes) : 0,
        steps: formData.steps ? parseInt(formData.steps) : 0,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : undefined,
        mood_score: formData.mood_score ? parseInt(formData.mood_score) : undefined,
        energy_level: formData.energy_level ? parseInt(formData.energy_level) : undefined
      })
      toast.success('Progress logged!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to log progress')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Log Progress</h2>
          <button onClick={onClose} className="text-dark-600 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Calories Burned</label>
              <input
                type="number"
                value={formData.calories_burned}
                onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white mb-1">Workouts</label>
              <input
                type="number"
                value={formData.workouts_completed}
                onChange={(e) => setFormData({ ...formData, workouts_completed: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Minutes</label>
              <input
                type="number"
                value={formData.total_workout_minutes}
                onChange={(e) => setFormData({ ...formData, total_workout_minutes: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Steps</label>
            <input
              type="number"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white mb-1">Sleep (hrs)</label>
              <input
                type="number"
                step="0.5"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Mood (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.mood_score}
                onChange={(e) => setFormData({ ...formData, mood_score: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Energy (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.energy_level}
                onChange={(e) => setFormData({ ...formData, energy_level: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Log Progress'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

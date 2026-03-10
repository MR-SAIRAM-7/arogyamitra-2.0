import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flame, 
  ChevronRight, 
  Dumbbell,
  Target,
  TrendingUp,
  Trash2,
  CheckCircle
} from 'lucide-react'
import { workoutsApi } from '@/utils/api'
import toast from 'react-hot-toast'

interface WorkoutPlan {
  id: string
  name: string
  description: string
  goal: string
  difficulty: string
  total_workouts: number
  estimated_calories_per_session: number
  is_active: boolean
  created_at: string
  exercises: any[]
}

interface WorkoutSession {
  id: string
  scheduled_date: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped'
  duration_minutes: number | null
  calories_burned: number | null
  workout_plan: WorkoutPlan
}

export default function Workouts() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [plansRes, sessionsRes] = await Promise.all([
        workoutsApi.getPlans(),
        workoutsApi.getSessions()
      ])
      setPlans(plansRes.data)
      setSessions(sessionsRes.data)
    } catch (error) {
      toast.error('Failed to fetch workout data')
    } finally {
      setIsLoading(false)
    }
  }

  const deletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    
    try {
      await workoutsApi.deletePlan(id)
      setPlans(plans.filter(p => p.id !== id))
      toast.success('Plan deleted')
    } catch (error) {
      toast.error('Failed to delete plan')
    }
  }

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled').slice(0, 5)
  const completedSessions = sessions.filter(s => s.status === 'completed').length

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
          <h1 className="text-3xl font-bold text-white">Workouts</h1>
          <p className="text-dark-600 mt-1">Manage your fitness routines</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{plans.length}</p>
              <p className="text-sm text-dark-600">Active Plans</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedSessions}</p>
              <p className="text-sm text-dark-600">Completed</p>
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
                {plans.reduce((acc, p) => acc + p.estimated_calories_per_session, 0)}
              </p>
              <p className="text-sm text-dark-600">Est. Calories/Session</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{upcomingSessions.length}</p>
              <p className="text-sm text-dark-600">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-dark-900 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{session.workout_plan?.name || 'Workout'}</p>
                    <p className="text-sm text-dark-600">
                      {new Date(session.scheduled_date).toLocaleDateString('en-US', {
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
                  to={`/workouts/${session.workout_plan?.id}`}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Start
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Workout Plans */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Your Workout Plans</h3>
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 hover:border-primary-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="p-2 text-dark-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h4 className="text-lg font-semibold text-white mb-1">{plan.name}</h4>
                <p className="text-sm text-dark-600 mb-4 line-clamp-2">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600 capitalize">{plan.goal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600 capitalize">{plan.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600">{plan.total_workouts} workouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600">{plan.estimated_calories_per_session} cal</span>
                  </div>
                </div>

                <Link
                  to={`/workouts/${plan.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-dark-900 hover:bg-primary-500 hover:text-white text-primary-400 rounded-xl transition-all"
                >
                  View Plan <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Workout Plans Yet</h3>
            <p className="text-dark-600 mb-6">Generate your first personalized workout plan with AI</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="btn-primary"
            >
              Generate Plan
            </button>
          </div>
        )}
      </div>

      {/* Generate Plan Modal */}
      {showGenerateModal && (
        <GeneratePlanModal onClose={() => setShowGenerateModal(false)} onSuccess={fetchData} />
      )}
    </div>
  )
}

function GeneratePlanModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    goal: 'weight_loss',
    fitness_level: 'beginner',
    workout_type: 'home',
    available_time_minutes: 30,
    days_per_week: 4,
    equipment: [] as string[],
    injuries: [] as string[],
    preferences: [] as string[]
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      await workoutsApi.generatePlan(formData)
      toast.success('Workout plan generated successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to generate workout plan')
    } finally {
      setIsGenerating(false)
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
          <h2 className="text-xl font-bold text-white">Generate Workout Plan</h2>
          <button onClick={onClose} className="text-dark-600 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Goal</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="endurance">Endurance</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Fitness Level</label>
            <select
              value={formData.fitness_level}
              onChange={(e) => setFormData({ ...formData, fitness_level: e.target.value })}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Workout Type</label>
            <select
              value={formData.workout_type}
              onChange={(e) => setFormData({ ...formData, workout_type: e.target.value })}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
            >
              <option value="home">Home Workout</option>
              <option value="gym">Gym</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Available Time: {formData.available_time_minutes} minutes
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={formData.available_time_minutes}
              onChange={(e) => setFormData({ ...formData, available_time_minutes: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Days per Week: {formData.days_per_week}
            </label>
            <input
              type="range"
              min="2"
              max="7"
              value={formData.days_per_week}
              onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate Plan'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

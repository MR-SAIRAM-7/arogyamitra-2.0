import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Flame, 
  Calendar,
  CheckCircle,
  Youtube,
  Info,
  ChevronRight
} from 'lucide-react'
import { workoutsApi } from '@/utils/api'
import toast from 'react-hot-toast'

interface Exercise {
  id: string
  name: string
  description: string
  type: string
  muscle_group: string
  sets: number
  reps: string | null
  duration_seconds: number | null
  rest_seconds: number
  video_url: string | null
  video_id: string | null
  thumbnail_url: string | null
  instructions: string[]
  tips: string[]
  difficulty: string
}

interface WorkoutPlan {
  id: string
  name: string
  description: string
  goal: string
  difficulty: string
  total_workouts: number
  estimated_calories_per_session: number
  equipment_needed: string[]
  exercises: Exercise[]
}

export default function WorkoutPlanPage() {
  const { id } = useParams<{ id: string }>()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(1)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    if (id) {
      fetchPlan()
    }
  }, [id])

  const fetchPlan = async () => {
    try {
      const response = await workoutsApi.getPlan(id!)
      setPlan(response.data)
    } catch (error) {
      toast.error('Failed to fetch workout plan')
    } finally {
      setIsLoading(false)
    }
  }

  const getExercisesForDay = (day: number) => {
    return plan?.exercises.filter(e => e.day_of_week === day) || []
  }

  const syncToCalendar = async () => {
    try {
      await workoutsApi.syncToCalendar(id!)
      toast.success('Synced to Google Calendar!')
    } catch (error) {
      toast.error('Failed to sync to calendar')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-600">Workout plan not found</p>
        <Link to="/workouts" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
          Back to Workouts
        </Link>
      </div>
    )
  }

  const dayExercises = getExercisesForDay(selectedDay)
  const uniqueDays = [...new Set(plan.exercises.map(e => e.day_of_week))].sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/workouts" className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{plan.name}</h1>
          <p className="text-dark-600">{plan.description}</p>
        </div>
        <button
          onClick={syncToCalendar}
          className="btn-secondary flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Sync to Calendar
        </button>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Goal</p>
          <p className="text-lg font-semibold text-white capitalize">{plan.goal}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Difficulty</p>
          <p className="text-lg font-semibold text-white capitalize">{plan.difficulty}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Workouts</p>
          <p className="text-lg font-semibold text-white">{plan.total_workouts}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Est. Calories</p>
          <p className="text-lg font-semibold text-white">{plan.estimated_calories_per_session}</p>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {uniqueDays.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-primary-500 text-white'
                : 'bg-dark-800 text-dark-600 hover:text-white hover:bg-dark-700'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {/* Exercises for Selected Day */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Day {selectedDay} Exercises</h3>
        {dayExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-6">
              {/* Exercise Number */}
              <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-400 font-bold">{index + 1}</span>
              </div>

              {/* Exercise Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{exercise.name}</h4>
                    <p className="text-sm text-dark-600">{exercise.muscle_group}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    exercise.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    exercise.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Exercise Details */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-dark-900 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{exercise.sets}</p>
                    <p className="text-xs text-dark-600">Sets</p>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">
                      {exercise.reps || `${exercise.duration_seconds}s`}
                    </p>
                    <p className="text-xs text-dark-600">{exercise.reps ? 'Reps' : 'Duration'}</p>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{exercise.rest_seconds}s</p>
                    <p className="text-xs text-dark-600">Rest</p>
                  </div>
                </div>

                {/* Instructions */}
                {exercise.instructions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-white mb-2">Instructions:</p>
                    <ul className="space-y-1">
                      {exercise.instructions.map((instruction, i) => (
                        <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Video Button */}
                {exercise.video_url && (
                  <a
                    href={exercise.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                    Watch Tutorial
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

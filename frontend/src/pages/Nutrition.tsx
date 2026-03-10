import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Utensils, 
  Flame, 
  ChevronRight, 
  Trash2,
  ShoppingCart,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react'
import { nutritionApi } from '@/utils/api'
import toast from 'react-hot-toast'

interface NutritionPlan {
  id: string
  name: string
  description: string
  duration_days: number
  daily_calories: number
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  diet_type: string
  cuisine_preference: string
  is_active: boolean
  meals: any[]
}

export default function Nutrition() {
  const [plans, setPlans] = useState<NutritionPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await nutritionApi.getPlans()
      setPlans(response.data)
    } catch (error) {
      toast.error('Failed to fetch nutrition plans')
    } finally {
      setIsLoading(false)
    }
  }

  const deletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    
    try {
      await nutritionApi.deletePlan(id)
      setPlans(plans.filter(p => p.id !== id))
      toast.success('Plan deleted')
    } catch (error) {
      toast.error('Failed to delete plan')
    }
  }

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
          <h1 className="text-3xl font-bold text-white">Nutrition</h1>
          <p className="text-dark-600 mt-1">Manage your meal plans and diet</p>
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
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{plans.length}</p>
              <p className="text-sm text-dark-600">Active Plans</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {plans[0]?.daily_calories || 0}
              </p>
              <p className="text-sm text-dark-600">Daily Calories</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {plans.reduce((acc, p) => acc + (p.meals?.length || 0), 0)}
              </p>
              <p className="text-sm text-dark-600">Total Meals</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white capitalize">
                {plans[0]?.diet_type || 'Balanced'}
              </p>
              <p className="text-sm text-dark-600">Diet Type</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Plans */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Your Meal Plans</h3>
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 hover:border-accent-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
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
                    <Flame className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600">{plan.daily_calories} cal/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600">{plan.duration_days} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600 capitalize">{plan.diet_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-dark-600" />
                    <span className="text-sm text-dark-600 capitalize">{plan.cuisine_preference}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/nutrition/${plan.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-dark-900 hover:bg-accent-500 hover:text-white text-accent-400 rounded-xl transition-all"
                  >
                    View Plan <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/nutrition/${plan.id}?tab=grocery`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-dark-900 hover:bg-primary-500 hover:text-white text-primary-400 rounded-xl transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Grocery List
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-10 h-10 text-accent-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Meal Plans Yet</h3>
            <p className="text-dark-600 mb-6">Generate your first personalized meal plan with AI</p>
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
        <GeneratePlanModal onClose={() => setShowGenerateModal(false)} onSuccess={fetchPlans} />
      )}
    </div>
  )
}

function GeneratePlanModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    daily_calories: 2000,
    diet_type: 'balanced',
    cuisine_preference: 'indian',
    allergies: [] as string[],
    restrictions: [] as string[],
    meals_per_day: 3
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      await nutritionApi.generatePlan(formData)
      toast.success('Nutrition plan generated successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to generate nutrition plan')
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
          <h2 className="text-xl font-bold text-white">Generate Meal Plan</h2>
          <button onClick={onClose} className="text-dark-600 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Daily Calories: {formData.daily_calories}
            </label>
            <input
              type="range"
              min="1200"
              max="3500"
              step="100"
              value={formData.daily_calories}
              onChange={(e) => setFormData({ ...formData, daily_calories: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Diet Type</label>
            <select
              value={formData.diet_type}
              onChange={(e) => setFormData({ ...formData, diet_type: e.target.value })}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
            >
              <option value="balanced">Balanced</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Cuisine Preference</label>
            <select
              value={formData.cuisine_preference}
              onChange={(e) => setFormData({ ...formData, cuisine_preference: e.target.value })}
              className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-xl text-white"
            >
              <option value="indian">Indian</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="asian">Asian</option>
              <option value="american">American</option>
              <option value="mexican">Mexican</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Meals per Day: {formData.meals_per_day}
            </label>
            <input
              type="range"
              min="3"
              max="6"
              value={formData.meals_per_day}
              onChange={(e) => setFormData({ ...formData, meals_per_day: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all disabled:opacity-50"
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

import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Flame, 
  Clock,
  ShoppingCart,
  Calendar,
  ChevronRight,
  Utensils,
  CheckCircle
} from 'lucide-react'
import { nutritionApi } from '@/utils/api'
import toast from 'react-hot-toast'

interface Meal {
  id: string
  day_number: number
  meal_type: string
  name: string
  description: string
  calories: number
  protein_grams: number
  carbs_grams: number
  fat_grams: number
  ingredients: string[]
  instructions: string[]
  prep_time_minutes: number
  cook_time_minutes: number
  image_url: string | null
}

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
  meals: Meal[]
}

export default function NutritionPlanPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [plan, setPlan] = useState<NutritionPlan | null>(null)
  const [groceryList, setGroceryList] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(1)
  const [activeTab, setActiveTab] = useState<'meals' | 'grocery'>(
    searchParams.get('tab') === 'grocery' ? 'grocery' : 'meals'
  )

  useEffect(() => {
    if (id) {
      fetchPlan()
      fetchGroceryList()
    }
  }, [id])

  const fetchPlan = async () => {
    try {
      const response = await nutritionApi.getPlan(id!)
      setPlan(response.data)
    } catch (error) {
      toast.error('Failed to fetch nutrition plan')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGroceryList = async () => {
    try {
      const response = await nutritionApi.getGroceryList(id!)
      setGroceryList(response.data)
    } catch (error) {
      console.error('Failed to fetch grocery list')
    }
  }

  const syncToCalendar = async () => {
    try {
      await nutritionApi.syncToCalendar(id!)
      toast.success('Synced to Google Calendar!')
    } catch (error) {
      toast.error('Failed to sync to calendar')
    }
  }

  const getMealsForDay = (day: number) => {
    return plan?.meals.filter(m => m.day_number === day) || []
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
        <p className="text-dark-600">Nutrition plan not found</p>
        <Link to="/nutrition" className="text-accent-400 hover:text-accent-300 mt-4 inline-block">
          Back to Nutrition
        </Link>
      </div>
    )
  }

  const dayMeals = getMealsForDay(selectedDay)
  const uniqueDays = [...new Set(plan.meals.map(m => m.day_number))].sort()

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack']
  const sortedMeals = [...dayMeals].sort((a, b) => {
    return mealTypeOrder.indexOf(a.meal_type) - mealTypeOrder.indexOf(b.meal_type)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/nutrition" className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
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
          <p className="text-sm text-dark-600">Daily Calories</p>
          <p className="text-lg font-semibold text-white">{plan.daily_calories}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Duration</p>
          <p className="text-lg font-semibold text-white">{plan.duration_days} days</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Diet Type</p>
          <p className="text-lg font-semibold text-white capitalize">{plan.diet_type}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-dark-600">Total Meals</p>
          <p className="text-lg font-semibold text-white">{plan.meals.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('meals')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'meals'
              ? 'text-accent-400 border-b-2 border-accent-400'
              : 'text-dark-600 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Meals
          </span>
        </button>
        <button
          onClick={() => setActiveTab('grocery')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'grocery'
              ? 'text-accent-400 border-b-2 border-accent-400'
              : 'text-dark-600 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Grocery List
          </span>
        </button>
      </div>

      {/* Meals Tab */}
      {activeTab === 'meals' && (
        <>
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {uniqueDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-accent-500 text-white'
                    : 'bg-dark-800 text-dark-600 hover:text-white hover:bg-dark-700'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          {/* Meals for Selected Day */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Day {selectedDay} Meals</h3>
            {sortedMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-6 h-6 text-accent-500" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-accent-400 uppercase font-medium">
                          {meal.meal_type}
                        </span>
                        <h4 className="text-lg font-semibold text-white">{meal.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{meal.calories}</p>
                        <p className="text-xs text-dark-600">calories</p>
                      </div>
                    </div>

                    <p className="text-sm text-dark-600 mb-4">{meal.description}</p>

                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-dark-900 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{meal.protein_grams}g</p>
                        <p className="text-xs text-dark-600">Protein</p>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{meal.carbs_grams}g</p>
                        <p className="text-xs text-dark-600">Carbs</p>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{meal.fat_grams}g</p>
                        <p className="text-xs text-dark-600">Fat</p>
                      </div>
                    </div>

                    {/* Ingredients */}
                    {meal.ingredients.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-white mb-2">Ingredients:</p>
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.map((ingredient, i) => (
                            <span key={i} className="px-3 py-1 bg-dark-900 rounded-full text-sm text-dark-600">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-4 text-sm text-dark-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Prep: {meal.prep_time_minutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        Cook: {meal.cook_time_minutes}m
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Grocery List Tab */}
      {activeTab === 'grocery' && groceryList && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Grocery List</h3>
            <p className="text-dark-600">{groceryList.total_items} items</p>
          </div>

          {groceryList.items.length > 0 ? (
            <div className="space-y-6">
              {['produce', 'protein', 'grains', 'pantry', 'other'].map((category) => {
                const categoryItems = groceryList.items.filter((item: any) => item.category === category)
                if (categoryItems.length === 0) return null

                return (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-accent-400 uppercase mb-3">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {categoryItems.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-dark-900 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-dark-600" />
                          <span className="text-white">{item.name}</span>
                          <span className="text-dark-600 text-sm ml-auto">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-dark-600 py-8">No items in grocery list</p>
          )}
        </motion.div>
      )}
    </div>
  )
}

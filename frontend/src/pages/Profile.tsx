import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Ruler,
  Weight,
  Target,
  Edit2,
  Save,
  Camera
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/utils/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    age: user?.age || '',
    height_cm: user?.height_cm || '',
    weight_kg: user?.weight_kg || '',
    primary_goal: user?.primary_goal || '',
    fitness_level: user?.fitness_level || '',
    dietary_preference: user?.dietary_preference || ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await authApi.updateProfile({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        age: formData.age ? parseInt(formData.age as string) : undefined,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm as string) : undefined,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg as string) : undefined,
        primary_goal: formData.primary_goal,
        fitness_level: formData.fitness_level,
        dietary_preference: formData.dietary_preference
      })
      updateUser(response.data)
      toast.success('Profile updated!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-dark-600 mt-1">Manage your personal information</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user?.full_name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-dark-800 border border-dark-700 rounded-full flex items-center justify-center text-dark-600 hover:text-white transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.full_name}</h2>
            <p className="text-dark-600">{user?.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full">
                {user?.total_points} points
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">
                {user?.current_streak} day streak
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Ruler className="w-4 h-4 inline mr-2" />
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height_cm}
              onChange={(e) => handleChange('height_cm', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Weight className="w-4 h-4 inline mr-2" />
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => handleChange('weight_kg', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              Primary Goal
            </label>
            <select
              value={formData.primary_goal}
              onChange={(e) => handleChange('primary_goal', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            >
              <option value="">Select goal</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="endurance">Endurance</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              Fitness Level
            </label>
            <select
              value={formData.fitness_level}
              onChange={(e) => handleChange('fitness_level', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              Dietary Preference
            </label>
            <select
              value={formData.dietary_preference}
              onChange={(e) => handleChange('dietary_preference', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white disabled:opacity-50"
            >
              <option value="">Select diet</option>
              <option value="balanced">Balanced</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
      >
        <div className="glass-card p-6 text-center">
          <p className="text-3xl font-bold text-white">{user?.total_workouts || 0}</p>
          <p className="text-sm text-dark-600">Total Workouts</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-3xl font-bold text-white">{user?.longest_streak || 0}</p>
          <p className="text-sm text-dark-600">Best Streak</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-3xl font-bold text-white">{user?.charity_contributions || 0}</p>
          <p className="text-sm text-dark-600">Charity ($)</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-3xl font-bold text-white">{user?.calorie_target || 0}</p>
          <p className="text-sm text-dark-600">Daily Calories</p>
        </div>
      </motion.div>
    </div>
  )
}

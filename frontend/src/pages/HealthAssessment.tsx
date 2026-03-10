import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Activity, 
  Target, 
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { healthApi } from '@/utils/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    id: 'basic',
    title: 'Basic Information',
    icon: Activity,
    fields: [
      { name: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
      { name: 'height_cm', label: 'Height (cm)', type: 'number', placeholder: 'Enter height in cm' },
      { name: 'weight_kg', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight in kg' },
    ]
  },
  {
    id: 'health',
    title: 'Health History',
    icon: Heart,
    fields: [
      { name: 'has_chronic_conditions', label: 'Do you have any chronic conditions?', type: 'boolean' },
      { name: 'chronic_conditions', label: 'If yes, please specify', type: 'textarea', condition: 'has_chronic_conditions' },
      { name: 'has_allergies', label: 'Do you have any allergies?', type: 'boolean' },
      { name: 'allergies', label: 'If yes, please specify', type: 'textarea', condition: 'has_allergies' },
      { name: 'has_injuries', label: 'Any current injuries or physical limitations?', type: 'boolean' },
      { name: 'injuries', label: 'If yes, please specify', type: 'textarea', condition: 'has_injuries' },
    ]
  },
  {
    id: 'goals',
    title: 'Fitness Goals',
    icon: Target,
    fields: [
      { name: 'primary_goal', label: 'Primary Goal', type: 'select', options: ['weight_loss', 'muscle_gain', 'endurance', 'general_fitness'] },
      { name: 'exercise_frequency', label: 'Current Exercise Frequency', type: 'select', options: ['none', '1-2 times/week', '3-4 times/week', '5+ times/week'] },
      { name: 'target_weight_kg', label: 'Target Weight (kg)', type: 'number', placeholder: 'Optional' },
      { name: 'timeline_months', label: 'Goal Timeline (months)', type: 'number', placeholder: 'Optional' },
    ]
  }
]

export default function HealthAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({
    has_chronic_conditions: false,
    has_allergies: false,
    has_injuries: false,
    chronic_conditions: [],
    allergies: [],
    injuries: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      submitAssessment()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)
    try {
      await healthApi.createAssessment({
        age: parseInt(formData.age),
        gender: formData.gender,
        height_cm: parseFloat(formData.height_cm),
        weight_kg: parseFloat(formData.weight_kg),
        has_chronic_conditions: formData.has_chronic_conditions,
        chronic_conditions: formData.chronic_conditions ? formData.chronic_conditions.split(',').map((s: string) => s.trim()) : [],
        has_allergies: formData.has_allergies,
        allergies: formData.allergies ? formData.allergies.split(',').map((s: string) => s.trim()) : [],
        has_injuries: formData.has_injuries,
        injuries: formData.injuries ? formData.injuries.split(',').map((s: string) => s.trim()) : [],
        primary_goal: formData.primary_goal,
        exercise_frequency: formData.exercise_frequency,
        target_weight_kg: formData.target_weight_kg ? parseFloat(formData.target_weight_kg) : undefined,
        timeline_months: formData.timeline_months ? parseInt(formData.timeline_months) : undefined
      })
      toast.success('Health assessment completed!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to submit assessment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const step = steps[currentStep]
  const StepIcon = step.icon

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Health Assessment</h1>
        <p className="text-dark-600">Help us personalize your fitness journey</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, index) => (
          <div
            key={s.id}
            className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-600'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? 'bg-primary-500' : 'bg-dark-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <StepIcon className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{step.title}</h2>
            <p className="text-sm text-dark-600">Step {currentStep + 1} of {steps.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {step.fields.map((field) => {
            if (field.condition && !formData[field.condition]) return null

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-white mb-2">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'boolean' ? (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleChange(field.name, true)}
                      className={`flex-1 py-3 rounded-xl border ${
                        formData[field.name]
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-dark-700 text-dark-600'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange(field.name, false)}
                      className={`flex-1 py-3 rounded-xl border ${
                        !formData[field.name]
                          ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                          : 'border-dark-700 text-dark-600'
                      }`}
                    >
                      No
                    </button>
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-600"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-600"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : currentStep === steps.length - 1 ? (
              <>
                Complete <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                Next <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

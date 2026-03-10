import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Moon, 
  Volume2, 
  MessageCircle,
  Smartphone,
  Shield,
  Trash2,
  ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { whatsappApi } from '@/utils/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const [settings, setSettings] = useState({
    notifications_enabled: user?.notifications_enabled ?? true,
    dark_mode: user?.dark_mode ?? true,
    voice_coaching_enabled: user?.voice_coaching_enabled ?? true,
    whatsapp_enabled: user?.whatsapp_enabled ?? false
  })
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '')
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key]
    setSettings(prev => ({ ...prev, [key]: newValue }))
    
    try {
      // Update in backend
      updateUser({ [key]: newValue })
    } catch (error) {
      toast.error('Failed to update setting')
    }
  }

  const enableWhatsApp = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number')
      return
    }
    
    try {
      await whatsappApi.enable(phoneNumber)
      setSettings(prev => ({ ...prev, whatsapp_enabled: true }))
      setShowWhatsAppModal(false)
      toast.success('WhatsApp notifications enabled!')
    } catch (error) {
      toast.error('Failed to enable WhatsApp')
    }
  }

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    enabled, 
    onToggle 
  }: { 
    icon: React.ReactNode
    title: string
    description: string
    enabled: boolean
    onToggle: () => void
  }) => (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-dark-600">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-dark-600">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-14 h-7 rounded-full transition-colors relative ${
          enabled ? 'bg-primary-500' : 'bg-dark-700'
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? 'left-8' : 'left-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-dark-600 mt-1">Customize your experience</p>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>
        <div className="space-y-3">
          <SettingItem
            icon={<Bell className="w-5 h-5" />}
            title="Push Notifications"
            description="Get notified about workouts and meals"
            enabled={settings.notifications_enabled}
            onToggle={() => toggleSetting('notifications_enabled')}
          />
          <SettingItem
            icon={<MessageCircle className="w-5 h-5" />}
            title="WhatsApp Integration"
            description="Receive reminders via WhatsApp"
            enabled={settings.whatsapp_enabled}
            onToggle={() => {
              if (!settings.whatsapp_enabled) {
                setShowWhatsAppModal(true)
              } else {
                toggleSetting('whatsapp_enabled')
              }
            }}
          />
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Preferences
        </h3>
        <div className="space-y-3">
          <SettingItem
            icon={<Moon className="w-5 h-5" />}
            title="Dark Mode"
            description="Use dark theme throughout the app"
            enabled={settings.dark_mode}
            onToggle={() => toggleSetting('dark_mode')}
          />
          <SettingItem
            icon={<Volume2 className="w-5 h-5" />}
            title="Voice Coaching"
            description="Enable voice-guided workouts"
            enabled={settings.voice_coaching_enabled}
            onToggle={() => toggleSetting('voice_coaching_enabled')}
          />
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Account
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-dark-900 rounded-xl hover:bg-dark-800 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-dark-600">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Change Password</p>
                <p className="text-sm text-dark-600">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-600" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-red-400">Delete Account</p>
                <p className="text-sm text-red-400/70">Permanently delete your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center text-dark-600 text-sm"
      >
        <p>ArogyaMitra v1.0.0</p>
        <p className="mt-1">Made with ❤️ for your fitness journey</p>
      </motion.div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Enable WhatsApp</h2>
              <button onClick={() => setShowWhatsAppModal(false)} className="text-dark-600 hover:text-white">
                ✕
              </button>
            </div>
            
            <p className="text-dark-600 mb-4">
              Enter your phone number to receive workout reminders and motivation via WhatsApp.
            </p>
            
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-600 mb-4"
            />
            
            <button
              onClick={enableWhatsApp}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              Enable WhatsApp
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

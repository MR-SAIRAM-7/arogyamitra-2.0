import { Outlet } from 'react-router-dom'
import { Dumbbell, Heart, Zap, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">ArogyaMitra</h1>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Your AI-Powered<br />
              <span className="text-accent-300">Fitness Companion</span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12 max-w-md">
              Personalized workouts, nutrition plans, and real-time coaching powered by advanced AI.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="AI Workouts"
                description="Personalized plans"
              />
              <FeatureCard
                icon={<Heart className="w-6 h-6" />}
                title="Nutrition"
                description="Smart meal plans"
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Progress"
                description="Track your journey"
              />
              <FeatureCard
                icon={<Dumbbell className="w-6 h-6" />}
                title="Coaching"
                description="24/7 AI support"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-dark-900 p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="text-white mb-2">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Flame, 
  Target,
  Plus,
  Medal,
  Crown,
  User
} from 'lucide-react'
import { socialApi } from '@/utils/api'
import toast from 'react-hot-toast'

interface Challenge {
  id: string
  title: string
  description: string
  type: string
  target_value: number
  target_unit: string
  duration_days: number
  participant_count: number
  points_reward: number
}

interface LeaderboardUser {
  rank: number
  user_id: string
  user_name: string
  total_points: number
  current_streak: number
  is_current_user: boolean
}

export default function Social() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [challengesRes, leaderboardRes] = await Promise.all([
        socialApi.getChallenges(),
        socialApi.getGlobalLeaderboard()
      ])
      setChallenges(challengesRes.data)
      setLeaderboard(leaderboardRes.data.leaderboard)
    } catch (error) {
      toast.error('Failed to fetch social data')
    } finally {
      setIsLoading(false)
    }
  }

  const joinChallenge = async (challengeId: string) => {
    try {
      await socialApi.joinChallenge(challengeId)
      toast.success('Joined challenge!')
      fetchData()
    } catch (error) {
      toast.error('Failed to join challenge')
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
      <div>
        <h1 className="text-3xl font-bold text-white">Social</h1>
        <p className="text-dark-600 mt-1">Join challenges and compete with friends</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'challenges'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-dark-600 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Challenges
          </span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'leaderboard'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-dark-600 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Medal className="w-4 h-4" />
            Leaderboard
          </span>
        </button>
      </div>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full">
                  {challenge.points_reward} pts
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
              <p className="text-sm text-dark-600 mb-4">{challenge.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-dark-600" />
                  <span className="text-dark-600">
                    Goal: {challenge.target_value} {challenge.target_unit}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Flame className="w-4 h-4 text-dark-600" />
                  <span className="text-dark-600">
                    Duration: {challenge.duration_days} days
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-dark-600" />
                  <span className="text-dark-600">
                    {challenge.participant_count} participants
                  </span>
                </div>
              </div>

              <button
                onClick={() => joinChallenge(challenge.id)}
                className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
              >
                Join Challenge
              </button>
            </motion.div>
          ))}

          {/* Create Challenge Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-dashed border-2 border-dark-600 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-500/50 transition-colors"
          >
            <div className="w-14 h-14 bg-dark-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-7 h-7 text-dark-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create Challenge</h3>
            <p className="text-sm text-dark-600">Start your own fitness challenge</p>
          </motion.div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Global Leaderboard</h3>
            <div className="flex items-center gap-2 text-dark-600">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span>Top Performers</span>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.user_id}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  user.is_current_user
                    ? 'bg-primary-500/10 border border-primary-500/50'
                    : 'bg-dark-900'
                }`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  user.rank === 1 ? 'bg-yellow-500 text-white' :
                  user.rank === 2 ? 'bg-gray-400 text-white' :
                  user.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-dark-800 text-dark-600'
                }`}>
                  {user.rank}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className={`font-semibold ${user.is_current_user ? 'text-primary-400' : 'text-white'}`}>
                    {user.user_name}
                    {user.is_current_user && <span className="ml-2 text-xs">(You)</span>}
                  </p>
                  <p className="text-sm text-dark-600">
                    {user.current_streak} day streak
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{user.total_points.toLocaleString()}</p>
                  <p className="text-xs text-dark-600">points</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

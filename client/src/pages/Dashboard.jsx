import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EmployeeOfMonth from '../components/dashboard/EmployeeOfMonth'
import QueenOfMonth from '../components/dashboard/QueenOfMonth'
import Leaderboard from '../components/dashboard/Leaderboard'
import UpcomingBirthdays from '../components/dashboard/UpcomingBirthdays'
import ShoutoutsFeed from '../components/dashboard/ShoutoutsFeed'
import { getSpotlights } from '../services/api'

export default function Dashboard() {
  const [spotlights, setSpotlights] = useState({ employee: null, queen: null })

  useEffect(() => {
    getSpotlights().then(r => setSpotlights(r.data)).catch(() => {})
  }, [])

  const emp   = spotlights.employee
  const queen = spotlights.queen

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Recognition divider */}
      <div className="flex items-center gap-4 mb-7">
        <div className="flex-1 divider-glow" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
          <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(0,200,83,0.8)]" />
          <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
            This month's recognition
          </span>
        </div>
        <div className="flex-1 divider-glow" />
      </div>

      {/* Spotlights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <EmployeeOfMonth
          name={emp?.name    || 'Alex Johnson'}
          role={emp?.role    || 'Senior Operations Manager'}
          quote={emp?.quote  || 'Always going above and beyond to support the team and deliver results.'}
          imageUrl={emp?.imageUrl}
        />
        <QueenOfMonth
          name={queen?.name   || 'Sofia Martinez'}
          role={queen?.role   || 'Head of People & Culture'}
          quote={queen?.quote || 'Bringing warmth, creativity, and energy to everything she touches.'}
          imageUrl={queen?.imageUrl}
        />
      </div>

      {/* Birthdays + Shoutouts */}
      <div className="flex items-center gap-4 mb-7">
        <div className="flex-1 divider-glow" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
          <span className="text-base">🎂</span>
          <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
            Birthdays & Shoutouts
          </span>
        </div>
        <div className="flex-1 divider-glow" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <UpcomingBirthdays />
        <ShoutoutsFeed />
      </div>

      {/* Leaderboard divider */}
      <div className="flex items-center gap-4 mb-7">
        <div className="flex-1 divider-glow" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
          <span className="text-amber-400 text-xs">🏆</span>
          <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
            KPI Leaderboard
          </span>
        </div>
        <div className="flex-1 divider-glow" />
      </div>

      <Leaderboard />
    </motion.div>
  )
}

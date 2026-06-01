import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cake, Trophy } from 'lucide-react'
import EmployeeOfMonth from '../components/dashboard/EmployeeOfMonth'
import QueenOfMonth from '../components/dashboard/QueenOfMonth'
import Leaderboard from '../components/dashboard/Leaderboard'
import UpcomingBirthdays from '../components/dashboard/UpcomingBirthdays'
import ShoutoutsFeed from '../components/dashboard/ShoutoutsFeed'
import { getSpotlights } from '../services/api'

function SectionDivider({ icon: Icon, iconCls = 'text-brand', label }) {
  return (
    <div className="flex items-center gap-4 mb-7">
      <div className="flex-1 divider-glow" />
      <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
        <Icon size={12} className={iconCls} />
        <span className="font-data text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex-1 divider-glow" />
    </div>
  )
}

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
      {/* Recognition section */}
      <SectionDivider
        icon={() => <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(0,200,83,0.8)]" />}
        label="This Month's Recognition"
      />

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
      <SectionDivider icon={Cake} iconCls="text-brand" label="Birthdays & Shoutouts" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <UpcomingBirthdays />
        <ShoutoutsFeed />
      </div>

      {/* Leaderboard */}
      <SectionDivider icon={Trophy} iconCls="text-amber-400" label="KPI Leaderboard" />

      <Leaderboard />
    </motion.div>
  )
}

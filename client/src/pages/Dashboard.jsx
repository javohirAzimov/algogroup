import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import CompanyIntro from '../components/dashboard/CompanyIntro'
import ManagementPhoto from '../components/dashboard/ManagementPhoto'
import EmployeeOfMonth from '../components/dashboard/EmployeeOfMonth'
import QueenOfMonth from '../components/dashboard/QueenOfMonth'
import StatStrip from '../components/dashboard/StatStrip'
import QuickActions from '../components/dashboard/QuickActions'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import OnlineMembers from '../components/dashboard/OnlineMembers'
import UpcomingMini from '../components/dashboard/UpcomingMini'
import { useAuth } from '../context/AuthContext'
import { getSpotlights, getSiteMedia } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [spotlights, setSpotlights] = useState({ employee: null, queen: null })
  const [mediaMap, setMediaMap]     = useState({})

  useEffect(() => {
    getSpotlights().then(r => setSpotlights(r.data)).catch(() => {})
    getSiteMedia().then(r => setMediaMap(r.data)).catch(() => {})
  }, [])

  const emp   = spotlights.employee
  const queen = spotlights.queen

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <WelcomeBanner name={user?.name?.split(' ')[0] || 'Team'} />

      {/* KPI strip */}
      <StatStrip />

      {/* Main: 2/3 content + 1/3 sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ManagementPhoto imageUrl={mediaMap.management_photo} />
          <CompanyIntro />
        </div>
        <div className="flex flex-col gap-4">
          <QuickActions />
          <UpcomingMini />
          <OnlineMembers />
        </div>
      </div>

      {/* Section divider */}
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

      {/* Spotlights + activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
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
        <ActivityFeed />
      </div>
    </motion.div>
  )
}

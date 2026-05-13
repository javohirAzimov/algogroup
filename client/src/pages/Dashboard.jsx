import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import CompanyIntro from '../components/dashboard/CompanyIntro'
import ManagementPhoto from '../components/dashboard/ManagementPhoto'
import EmployeeOfMonth from '../components/dashboard/EmployeeOfMonth'
import QueenOfMonth from '../components/dashboard/QueenOfMonth'
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
      transition={{ duration: 0.25 }}
    >
      <WelcomeBanner name={user?.name?.split(' ')[0] || 'Team'} />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ManagementPhoto imageUrl={mediaMap.management_photo} />
        <CompanyIntro />
      </section>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1 h-px bg-edge" />
        <span className="text-ink-subtle text-xs font-medium uppercase tracking-widest whitespace-nowrap">
          This month's recognition
        </span>
        <div className="flex-1 h-px bg-edge" />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      </section>
    </motion.div>
  )
}

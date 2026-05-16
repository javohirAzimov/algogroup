import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import StatStrip from '../components/dashboard/StatStrip'
import ManagementPhoto from '../components/dashboard/ManagementPhoto'
import CompanyIntro from '../components/dashboard/CompanyIntro'
import QuickActions from '../components/dashboard/QuickActions'
import UpcomingMini from '../components/dashboard/UpcomingMini'
import OnlineMembers from '../components/dashboard/OnlineMembers'
import { useAuth } from '../context/AuthContext'
import { getSiteMedia } from '../services/api'

export default function MainPage() {
  const { user } = useAuth()
  const [mediaMap, setMediaMap] = useState({})

  useEffect(() => {
    getSiteMedia().then(r => setMediaMap(r.data)).catch(() => {})
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <WelcomeBanner name={user?.name?.split(' ')[0] || 'Team'} />

      <StatStrip />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <ManagementPhoto imageUrl={mediaMap.management_photo} />
          <CompanyIntro />
        </div>
        <div className="flex flex-col gap-4">
          <QuickActions />
          <UpcomingMini />
          <OnlineMembers />
        </div>
      </div>
    </motion.div>
  )
}

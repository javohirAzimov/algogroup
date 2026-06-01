import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Users, CalendarDays, MessageSquare, BookOpen } from 'lucide-react'
import { getUsers, getAnnouncements, getSuggestionStats, getKnowledgeCategories } from '../../services/api'

const STAT_CONFIG = [
  {
    icon: Users,
    label: 'Team Members',
    key: 'teamMembers',
    suffix: '+',
    color: 'text-brand',
    iconBg: 'bg-brand/10',
    iconBorder: 'border-brand/20',
    glow: 'rgba(0,200,83,0.18)',
    sparkPoints: '0,20 12,17 24,14 36,11 48,7 60,4',
    sparkStroke: 'rgba(0,200,83,0.9)',
  },
  {
    icon: CalendarDays,
    label: 'Active Events',
    key: 'activeEvents',
    suffix: '',
    color: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    iconBorder: 'border-amber-400/20',
    glow: 'rgba(251,191,36,0.18)',
    sparkPoints: '0,22 12,18 24,16 36,12 48,10 60,6',
    sparkStroke: 'rgba(251,191,36,0.9)',
  },
  {
    icon: MessageSquare,
    label: 'Team Feedback',
    key: 'teamFeedback',
    suffix: '',
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-400/10',
    iconBorder: 'border-indigo-400/20',
    glow: 'rgba(99,102,241,0.18)',
    sparkPoints: '0,21 12,17 24,19 36,13 48,9 60,6',
    sparkStroke: 'rgba(99,102,241,0.9)',
  },
  {
    icon: BookOpen,
    label: 'KB Resources',
    key: 'kbResources',
    suffix: '',
    color: 'text-rose-400',
    iconBg: 'bg-rose-400/10',
    iconBorder: 'border-rose-400/20',
    glow: 'rgba(251,113,133,0.18)',
    sparkPoints: '0,22 12,19 24,17 36,14 48,10 60,5',
    sparkStroke: 'rgba(251,113,133,0.9)',
  },
]

function usePortalStats() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.allSettled([
      getUsers(),
      getAnnouncements(),
      getSuggestionStats(),
      getKnowledgeCategories(),
    ]).then(([users, announcements, suggestions, knowledge]) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      setData({
        teamMembers:  users.status === 'fulfilled'
          ? users.value.data.length
          : 0,
        activeEvents: announcements.status === 'fulfilled'
          ? announcements.value.data.filter(a => new Date(a.date) >= today).length
          : 0,
        teamFeedback: suggestions.status === 'fulfilled'
          ? suggestions.value.data.total
          : 0,
        kbResources:  knowledge.status === 'fulfilled'
          ? knowledge.value.data.length
          : 0,
      })
    })
  }, [])

  return data
}

function useCountUp(target, startDelay = 0) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const timeout = setTimeout(() => {
      const start = performance.now()
      const duration = 1300

      function step(now) {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.floor(eased * target))
        if (t < 1) rafRef.current = requestAnimationFrame(step)
        else setValue(target)
      }
      rafRef.current = requestAnimationFrame(step)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, startDelay])

  return value
}

function StatCard({ icon: Icon, label, raw, suffix, color, iconBg, iconBorder, glow, sparkPoints, sparkStroke, index }) {
  const count = useCountUp(raw, index * 110)

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-xl p-5 overflow-hidden cursor-default stat-glass card-float"
    >
      {/* Corner glow revealed on hover */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
      />

      {/* Sparkline — absolute bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-9 pointer-events-none opacity-[0.18] group-hover:opacity-[0.32] transition-opacity duration-300">
        <svg viewBox="0 0 60 24" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={`sg-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopOpacity="0" stopColor={sparkStroke} />
              <stop offset="100%" stopOpacity="1" stopColor={sparkStroke} />
            </linearGradient>
          </defs>
          <polyline
            points={sparkPoints}
            fill="none"
            stroke={`url(#sg-${index})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className={`w-8 h-8 rounded-lg ${iconBg} border ${iconBorder} flex items-center justify-center mb-3.5`}>
          <Icon size={14} className={color} />
        </div>

        <p className={`font-display font-black text-[2.6rem] leading-none tracking-tight ${color}`}>
          {count}{suffix}
        </p>

        <p className="font-data text-ink-subtle text-[10px] tracking-widest uppercase mt-2">
          {label}
        </p>
      </div>
    </motion.div>
  )
}

export default function StatStrip() {
  const stats = usePortalStats()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STAT_CONFIG.map((cfg, i) => (
        <StatCard
          key={cfg.label}
          {...cfg}
          raw={stats?.[cfg.key] ?? 0}
          index={i}
        />
      ))}
    </div>
  )
}

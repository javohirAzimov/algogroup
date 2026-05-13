import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getGreeting, getTodayFormatted } from '../../utils/formatDate'

export default function WelcomeBanner({ name = 'Team' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 relative"
    >
      {/* Subtle glow behind heading */}
      <div className="absolute -top-4 -left-4 w-48 h-16 bg-brand/10 blur-2xl rounded-full pointer-events-none" />

      <div className="flex items-start justify-between relative">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-brand opacity-80" />
            <span className="text-ink-subtle text-xs font-medium tracking-widest uppercase">
              {getTodayFormatted()}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-ink tracking-tight leading-tight">
            {getGreeting()},{' '}
            <span className="text-gradient-brand">{name}</span>
          </h2>
          <p className="text-ink-muted text-sm mt-1.5 font-light">
            Welcome back to ALGO Group Internal Portal
          </p>
        </div>
      </div>
    </motion.div>
  )
}

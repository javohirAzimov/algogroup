import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getGreeting, getTodayFormatted } from '../../utils/formatDate'

export default function WelcomeBanner({ name = 'Team' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 relative"
    >
      {/* Ambient glow behind heading */}
      <div className="absolute -top-6 -left-6 w-72 h-20 blur-3xl rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(0,200,83,0.09) 0%, transparent 70%)' }} />

      <div className="relative">
        {/* Date row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <Sparkles size={11} className="text-brand opacity-70" />
          <span className="font-data text-ink-subtle text-[11px] tracking-widest uppercase">
            {getTodayFormatted()}
          </span>

          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full glass border border-brand/20 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0 live-dot" />
            <span className="font-data text-brand text-[10px] font-medium tracking-widest uppercase">
              Live
            </span>
          </div>
        </div>

        {/* Greeting headline */}
        <h1 className="font-display font-bold text-[2.3rem] leading-[1.08] text-ink tracking-tight">
          {getGreeting()},{' '}
          <span className="text-gradient-brand">{name}</span>
        </h1>

        {/* Subtitle */}
        <p className="font-data text-ink-subtle text-[11px] mt-2 tracking-wide">
          Welcome back to ALGO Group Internal Portal
        </p>
      </div>
    </motion.div>
  )
}

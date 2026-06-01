import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Megaphone, MessageSquare, BookOpen, Bot } from 'lucide-react'

const ACTIONS = [
  {
    icon: Megaphone,
    label: 'Announcements',
    to: '/announcements',
    iconCls: 'text-amber-400',
    glowColor: 'rgba(251,191,36,0.14)',
    borderHover: 'rgba(251,191,36,0.36)',
  },
  {
    icon: MessageSquare,
    label: 'Suggestion',
    to: '/suggestions',
    iconCls: 'text-indigo-400',
    glowColor: 'rgba(99,102,241,0.14)',
    borderHover: 'rgba(99,102,241,0.36)',
  },
  {
    icon: BookOpen,
    label: 'Knowledge',
    to: '/knowledge',
    iconCls: 'text-rose-400',
    glowColor: 'rgba(251,113,133,0.14)',
    borderHover: 'rgba(251,113,133,0.36)',
  },
  {
    icon: Bot,
    label: 'AI Assistant',
    to: '/ai',
    iconCls: 'text-brand',
    glowColor: 'rgba(0,200,83,0.14)',
    borderHover: 'rgba(0,200,83,0.36)',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass rounded-xl p-4"
    >
      <p className="font-data text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em] mb-3">
        Quick Access
      </p>

      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(({ icon: Icon, label, to, iconCls, glowColor, borderHover }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="group/tile relative flex flex-col items-center gap-2 p-3.5 rounded-lg
                       border border-white/5 bg-white/[0.025] overflow-hidden
                       hover:-translate-y-0.5 active:scale-[0.97]
                       transition-all duration-200 cursor-pointer"
          >
            {/* Radial glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor} 0%, transparent 80%)` }}
            />
            {/* Inner border highlight on hover */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px ${borderHover}` }}
            />

            <Icon size={17} className={`${iconCls} relative z-10 transition-transform duration-200 group-hover/tile:scale-110`} />
            <span className="text-ink-muted text-[11px] font-medium relative z-10 transition-colors duration-200 group-hover/tile:text-ink">
              {label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Megaphone, MessageSquare, BookOpen, Bot } from 'lucide-react'

const actions = [
  { icon: Megaphone,     label: 'Announcements', to: '/announcements', color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20' },
  { icon: MessageSquare, label: 'Suggestion',    to: '/suggestions',   color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { icon: BookOpen,      label: 'Knowledge',     to: '/knowledge',     color: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/20' },
  { icon: Bot,           label: 'AI Assistant',  to: '/ai',            color: 'text-brand',      bg: 'bg-brand/10',      border: 'border-brand/20' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.1 }}
      className="glass rounded-xl p-4"
    >
      <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Quick Access</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ icon: Icon, label, to, color, bg, border }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg ${bg} border ${border}
                        hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150 cursor-pointer`}
          >
            <Icon size={16} className={color} />
            <span className="text-ink-muted text-[11px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

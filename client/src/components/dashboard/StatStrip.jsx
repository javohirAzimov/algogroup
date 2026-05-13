import { motion } from 'framer-motion'
import { Users, CalendarDays, MessageSquare, BookOpen } from 'lucide-react'

const stats = [
  { icon: Users,         label: 'Team Members',  value: '120+', color: 'text-brand',      bg: 'bg-brand/10',      border: 'border-brand/20' },
  { icon: CalendarDays,  label: 'Active Events',  value: '8',   color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20' },
  { icon: MessageSquare, label: 'Team Feedback',  value: '24',  color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { icon: BookOpen,      label: 'KB Resources',   value: '64',  color: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/20' },
]

export default function StatStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map(({ icon: Icon, label, value, color, bg, border }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-xl p-4 card-float flex items-center gap-3"
        >
          <div className={`w-9 h-9 rounded-lg ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className="text-ink font-bold text-lg leading-none">{value}</p>
            <p className="text-ink-subtle text-[11px] mt-0.5">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

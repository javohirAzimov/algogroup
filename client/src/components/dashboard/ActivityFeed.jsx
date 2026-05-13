import { motion } from 'framer-motion'
import { User, Megaphone, MessageSquare, BookOpen, Award } from 'lucide-react'

const FEED = [
  { icon: Megaphone,     color: 'text-amber-400',  bg: 'bg-amber-400/10',  text: 'New event announced: Q2 All-Hands',         time: '2m ago' },
  { icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-400/10', text: 'New suggestion submitted by the team',       time: '14m ago' },
  { icon: Award,         color: 'text-brand',      bg: 'bg-brand/10',      text: 'Employee of the Month updated',              time: '1h ago' },
  { icon: BookOpen,      color: 'text-rose-400',   bg: 'bg-rose-400/10',   text: 'New article added to Knowledge Base',        time: '3h ago' },
  { icon: User,          color: 'text-sky-400',    bg: 'bg-sky-400/10',    text: 'New team member joined ALGO Group',          time: '5h ago' },
]

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.26 }}
      className="glass rounded-xl p-4 h-full"
    >
      <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Recent Activity</p>
      <div className="flex flex-col gap-3">
        {FEED.map(({ icon: Icon, color, bg, text, time }, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className={`w-6 h-6 rounded-md ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Icon size={11} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-ink-muted text-xs leading-snug">{text}</p>
              <p className="text-ink-subtle text-[10px] mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

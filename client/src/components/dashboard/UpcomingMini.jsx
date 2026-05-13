import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'

const events = [
  { title: 'Q2 All-Hands Meeting',  date: 'May 15', type: 'Meeting' },
  { title: 'Team Building Day',     date: 'May 20', type: 'Event' },
  { title: 'Training: Leadership',  date: 'May 25', type: 'Training' },
]

export default function UpcomingMini() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.14 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Upcoming</p>
        <CalendarDays size={12} className="text-ink-subtle" />
      </div>
      <div className="flex flex-col gap-3">
        {events.map(({ title, date, type }) => (
          <div key={title} className="flex items-start gap-2.5">
            <div className="w-8 text-center flex-shrink-0 pt-0.5">
              <p className="text-brand text-[10px] font-bold leading-none">{date.split(' ')[0]}</p>
              <p className="text-ink-subtle text-[9px]">{date.split(' ')[1]}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-ink text-xs font-medium leading-snug truncate">{title}</p>
              <p className="text-ink-subtle text-[10px]">{type}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

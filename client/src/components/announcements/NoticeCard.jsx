// Compact horizontal notice card for internal reminders
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { formatShortDate } from '../../utils/formatDate'

export default function NoticeCard({ notice, index = 0 }) {
  const { title, description, date } = notice

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06, ease: 'easeOut' }}
      className="bg-card border border-edge rounded-lg px-4 py-3.5
                 flex items-start gap-3 shadow-sm"
    >
      <div className="w-7 h-7 rounded-md bg-[rgba(245,158,11,0.12)] flex items-center
                      justify-center flex-shrink-0 mt-0.5">
        <Info size={14} className="text-warning" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-ink font-medium text-sm">{title}</p>
        <p className="text-ink-muted text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>

      <span className="text-ink-subtle text-xs flex-shrink-0 mt-0.5">
        {formatShortDate(date)}
      </span>
    </motion.div>
  )
}

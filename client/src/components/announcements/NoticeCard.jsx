import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { formatShortDate } from '../../utils/formatDate'

export default function NoticeCard({ notice, index = 0 }) {
  const { title, description, date } = notice

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 3 }}
      className="glass rounded-xl px-4 py-3.5 flex items-start gap-3 card-float"
    >
      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center
                      justify-center flex-shrink-0 mt-0.5">
        <Info size={13} className="text-warning" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-ink font-medium text-sm">{title}</p>
        <p className="text-ink-muted text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>

      <span className="text-ink-subtle text-[10px] flex-shrink-0 mt-0.5 font-medium">
        {formatShortDate(date)}
      </span>
    </motion.div>
  )
}

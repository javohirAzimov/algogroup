import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatShortDate } from '../../utils/formatDate'

const accentGradients = [
  'bg-gradient-to-br from-[#006000]/50 to-[#003300]/30',
  'bg-gradient-to-br from-emerald-700/50 to-emerald-900/30',
  'bg-gradient-to-br from-amber-700/50 to-amber-900/30',
  'bg-gradient-to-br from-rose-700/50 to-rose-900/30',
  'bg-gradient-to-br from-violet-700/50 to-violet-900/30',
  'bg-gradient-to-br from-cyan-700/50 to-cyan-900/30',
]

export default function FeaturedEventCard({ event, index = 0 }) {
  const { title, description, date, type, imageUrl } = event

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden card-float glass"
    >
      {/* Banner */}
      <div className={`h-36 relative overflow-hidden
                       ${imageUrl ? '' : accentGradients[index % accentGradients.length]}`}>
        {imageUrl && (
          <img
            src={imageUrl} alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 z-10">
          <Badge variant="muted">{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-ink font-semibold text-sm leading-snug">{title}</h3>
        <div className="flex items-center gap-1.5 text-ink-subtle text-xs">
          <Calendar size={11} className="text-brand" />
          <span>{formatShortDate(date)}</span>
        </div>
        <p className="text-ink-muted text-xs leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

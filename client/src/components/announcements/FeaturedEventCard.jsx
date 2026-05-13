import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatShortDate } from '../../utils/formatDate'

const banners = [
  'bg-[#006000]', 'bg-emerald-700', 'bg-amber-600',
  'bg-rose-700',  'bg-violet-700',  'bg-cyan-700',
]

export default function FeaturedEventCard({ event, index = 0 }) {
  const { title, description, date, type, imageUrl } = event

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-edge rounded-lg overflow-hidden shadow-sm"
    >
      {/* Banner — photo if available, otherwise solid colour */}
      <div className={`h-36 flex items-end p-4 relative overflow-hidden
                       ${imageUrl ? '' : banners[index % banners.length]}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* dark scrim so badge is always readable */}
        {imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        )}
        <div className="relative z-10">
          <Badge variant="muted">{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-ink font-semibold text-sm leading-snug">{title}</h3>
        <div className="flex items-center gap-1.5 text-ink-subtle text-xs">
          <Calendar size={12} />
          <span>{formatShortDate(date)}</span>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

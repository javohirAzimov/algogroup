// Queen of the Month recognition card — illustration + name, role, quote
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'

export default function QueenOfMonth({
  name = 'Sofia Martinez',
  role = 'Head of People & Culture',
  quote = 'Bringing warmth, creativity, and energy to everything she touches.',
  imageUrl,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.2, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-edge border-l-4 border-l-[#f43f5e]
                 rounded-lg overflow-hidden shadow-sm"
    >
      {/* Illustration / photo panel */}
      <div className="bg-[rgba(244,63,94,0.08)] flex items-center justify-center h-44 px-6 overflow-hidden">
        <img
          src={imageUrl || '/Employee%20of%20the%20month-pana.svg'}
          alt="Queen of the month"
          className={imageUrl ? 'h-full w-full object-cover' : 'h-full object-contain'}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Crown size={13} className="text-[#f43f5e]" />
          <span className="text-[#f43f5e] text-xs font-semibold uppercase tracking-wider">
            Queen of the month
          </span>
        </div>
        <p className="text-ink font-semibold">{name}</p>
        <p className="text-ink-muted text-sm">{role}</p>
        <p className="text-ink-muted text-sm italic leading-relaxed border-t border-edge mt-3 pt-3">
          "{quote}"
        </p>
      </div>
    </motion.div>
  )
}

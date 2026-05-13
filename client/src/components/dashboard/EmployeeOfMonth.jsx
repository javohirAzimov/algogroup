// Employee of the Month recognition card — illustration + name, role, quote
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export default function EmployeeOfMonth({
  name = 'Alex Johnson',
  role = 'Senior Operations Manager',
  quote = 'Always going above and beyond to support the team and deliver results.',
  imageUrl,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.15, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-edge border-l-4 border-l-brand
                 rounded-lg overflow-hidden shadow-sm"
    >
      {/* Illustration / photo panel */}
      <div className="bg-brand-soft flex items-center justify-center h-44 px-6 overflow-hidden">
        <img
          src={imageUrl || '/Employee%20of%20the%20month-bro.svg'}
          alt="Employee of the month"
          className={imageUrl ? 'h-full w-full object-cover' : 'h-full object-contain'}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Award size={13} className="text-brand" />
          <span className="text-brand text-xs font-semibold uppercase tracking-wider">
            Employee of the month
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

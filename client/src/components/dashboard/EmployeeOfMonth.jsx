import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export default function EmployeeOfMonth({ name, role, quote, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative group rounded-xl overflow-hidden card-float glass"
    >
      {/* Ambient green glow top-left */}
      <div className="absolute -top-8 -left-8 w-36 h-36 bg-brand/15 blur-2xl rounded-full pointer-events-none
                      transition-opacity duration-500 opacity-60 group-hover:opacity-100" />

      {/* Photo / illustration panel */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand/10 via-transparent to-transparent">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <img
          src={imageUrl || '/Employee%20of%20the%20month-bro.svg'}
          alt={name}
          className={`w-full h-full transition-transform duration-500 group-hover:scale-105
                     ${imageUrl ? 'object-cover' : 'object-contain p-4'}`}
        />
        {/* Badge overlaid on photo */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5
                        px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md
                        border border-brand/30 shadow-[0_0_12px_rgba(0,200,83,0.2)]">
          <Award size={11} className="text-brand" />
          <span className="text-brand text-[10px] font-semibold uppercase tracking-wider">
            Employee of the Month
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 relative">
        <p className="text-ink font-semibold text-sm">{name}</p>
        <p className="text-ink-muted text-xs mt-0.5">{role}</p>
        <div className="mt-3 pt-3 border-t border-edge">
          <p className="text-ink-muted text-xs italic leading-relaxed">"{quote}"</p>
        </div>
      </div>
    </motion.div>
  )
}

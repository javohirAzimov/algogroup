import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'

export default function QueenOfMonth({ name, role, quote, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative group rounded-xl overflow-hidden card-float glass"
    >
      {/* Ambient rose glow top-right */}
      <div className="absolute -top-8 -right-8 w-36 h-36 bg-rose-500/10 blur-2xl rounded-full pointer-events-none
                      transition-opacity duration-500 opacity-60 group-hover:opacity-100" />

      {/* Photo / illustration panel — 16:9 cinematic */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-rose-500/10 via-transparent to-transparent">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <img
          src={imageUrl || '/Employee%20of%20the%20month-pana.svg'}
          alt={name}
          className={`w-full h-full transition-transform duration-500 group-hover:scale-105
                     ${imageUrl ? 'object-cover' : 'object-contain p-4'}`}
        />
        {/* Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5
                        px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md
                        border border-rose-400/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
          <Crown size={11} className="text-rose-400" />
          <span className="text-rose-400 text-[10px] font-semibold uppercase tracking-wider">
            Queen of the Month
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 relative">
        <p className="text-ink font-semibold text-base">{name}</p>
        <p className="text-ink-muted text-sm mt-0.5">{role}</p>
        <div className="mt-3 pt-3 border-t border-edge">
          <p className="text-ink-muted text-sm italic leading-relaxed">"{quote}"</p>
        </div>
      </div>
    </motion.div>
  )
}

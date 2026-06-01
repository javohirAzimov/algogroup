import { motion } from 'framer-motion'
import { Crown, Star } from 'lucide-react'

const PARTICLES = Array.from({ length: 13 }, (_, i) => ({
  id: i,
  left: `${(i * 7.2) % 86 + 7}%`,
  delay: `${(i * 0.42) % 4.0}s`,
  duration: `${3.1 + (i % 3) * 0.55}s`,
  size: [3, 2, 2, 1.5][i % 4],
  color: i % 3 === 0
    ? 'rgba(251,191,36,0.85)'
    : i % 3 === 1
    ? 'rgba(251,113,133,0.75)'
    : 'rgba(253,224,71,0.55)',
}))

export default function QueenOfMonth({ name, role, quote, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-xl overflow-hidden recognition-aura-gold"
      style={{ background: 'rgba(10, 7, 3, 0.96)' }}
    >
      {/* Cinematic spotlight — warm gold + rose blush */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(251,191,36,0.18) 0%, rgba(251,113,133,0.09) 42%, transparent 70%)',
        }}
      />

      {/* Ambient corner orbs */}
      <div
        className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
          animation: 'aura-breathe 5.0s ease-in-out infinite 1s',
        }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.10) 0%, transparent 70%)' }}
      />

      {/* Floating particles — gold + rose */}
      {PARTICLES.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-particle z-20"
          style={{
            left: p.left,
            bottom: '18%',
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Photo panel — 16:9 cinematic */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* Bottom-up scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0703]/92 via-[#0a0703]/25 to-transparent z-10" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0703]/45 via-transparent to-[#0a0703]/45 z-10" />
        {/* Top-right gold haze */}
        <div className="absolute top-0 right-0 w-2/3 h-1/2 pointer-events-none z-10"
             style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(251,191,36,0.09) 0%, transparent 70%)' }} />

        <img
          src={imageUrl || '/Employee%20of%20the%20month-pana.svg'}
          alt={name}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.06]
                     ${imageUrl ? 'object-cover' : 'object-contain p-6'}`}
        />

        {/* Crown badge */}
        <div
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-[rgba(251,191,36,0.40)]"
          style={{ background: 'rgba(8,5,1,0.78)', boxShadow: '0 0 20px rgba(251,191,36,0.20)' }}
        >
          <Crown size={10} className="text-amber-400" />
          <span className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest font-data">
            Queen of the Month
          </span>
        </div>

        {/* Star accent */}
        <div className="absolute top-3 right-3 z-20 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <Star size={13} className="text-amber-400" style={{ fill: 'rgba(251,191,36,0.30)' }} />
        </div>
      </div>

      {/* Info section */}
      <div className="relative z-20 px-6 pb-6 pt-4">
        {/* Name — shimmer gold display type */}
        <h3 className="font-display font-bold text-[1.35rem] leading-tight tracking-tight mb-0.5 text-shimmer-gold">
          {name}
        </h3>
        <p className="text-[11px] font-data tracking-widest uppercase mb-4"
           style={{ color: 'rgba(251,191,36,0.52)' }}>
          {role}
        </p>

        {/* Quote */}
        <div className="relative pl-4 border-l border-[rgba(251,191,36,0.28)]">
          <span
            className="absolute -top-2 -left-1 text-[2.2rem] leading-none font-serif select-none"
            style={{ color: 'rgba(251,191,36,0.35)' }}
          >
            "
          </span>
          <p className="text-white/55 text-sm leading-relaxed italic pt-1.5">
            {quote}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

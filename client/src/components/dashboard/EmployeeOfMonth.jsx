import { motion } from 'framer-motion'
import { Award, Sparkles } from 'lucide-react'

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 6.8) % 88 + 6}%`,
  delay: `${(i * 0.38) % 3.8}s`,
  duration: `${2.8 + (i % 4) * 0.55}s`,
  size: [3, 2, 2, 1.5][i % 4],
}))

export default function EmployeeOfMonth({ name, role, quote, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-xl overflow-hidden recognition-aura-green"
      style={{ background: 'rgba(4, 10, 6, 0.96)' }}
    >
      {/* Cinematic radial spotlight from top — green */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(0,200,83,0.24) 0%, rgba(0,200,83,0.07) 45%, transparent 72%)',
        }}
      />

      {/* Ambient corner orbs */}
      <div
        className="absolute -top-14 -left-14 w-52 h-52 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)',
          animation: 'aura-breathe 4.2s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,200,83,0.10) 0%, transparent 70%)' }}
      />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-particle z-20"
          style={{
            left: p.left,
            bottom: '18%',
            width: p.size,
            height: p.size,
            background: 'rgba(0, 200, 83, 0.75)',
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Photo panel — 16:9 cinematic */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* Bottom-up dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040a06]/92 via-[#040a06]/25 to-transparent z-10" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040a06]/45 via-transparent to-[#040a06]/45 z-10" />
        {/* Top-left ambient haze */}
        <div className="absolute top-0 left-0 w-2/3 h-1/2 pointer-events-none z-10"
             style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(0,200,83,0.10) 0%, transparent 70%)' }} />

        <img
          src={imageUrl || '/Employee%20of%20the%20month-bro.svg'}
          alt={name}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.06]
                     ${imageUrl ? 'object-cover' : 'object-contain p-6'}`}
        />

        {/* Award badge */}
        <div
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-[rgba(0,200,83,0.4)]"
          style={{ background: 'rgba(2,8,4,0.75)', boxShadow: '0 0 20px rgba(0,200,83,0.22)' }}
        >
          <Award size={10} className="text-brand" />
          <span className="text-brand text-[10px] font-semibold uppercase tracking-widest font-data">
            Employee of the Month
          </span>
        </div>

        {/* Sparkle accent */}
        <div className="absolute top-3 right-3 z-20 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles size={13} className="text-brand" />
        </div>
      </div>

      {/* Info section */}
      <div className="relative z-20 px-6 pb-6 pt-4">
        {/* Name — cinematic display type */}
        <h3 className="font-display font-bold text-[1.35rem] leading-tight tracking-tight text-gradient-brand mb-0.5">
          {name}
        </h3>
        <p className="text-[11px] font-data tracking-widest uppercase mb-4"
           style={{ color: 'rgba(0,200,83,0.55)' }}>
          {role}
        </p>

        {/* Quote */}
        <div className="relative pl-4 border-l border-[rgba(0,200,83,0.28)]">
          <span
            className="absolute -top-2 -left-1 text-[2.2rem] leading-none font-serif select-none"
            style={{ color: 'rgba(0,200,83,0.35)' }}
          >
            "
          </span>
          <p className="text-ink-muted text-sm leading-relaxed italic pt-1.5">
            {quote}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

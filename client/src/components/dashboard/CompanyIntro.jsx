import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe } from 'lucide-react'

const stats = [
  { icon: Users,      label: 'Team Members',  value: '120+' },
  { icon: Globe,      label: 'Operations',    value: 'US' },
  { icon: TrendingUp, label: 'Growing Since', value: '2018' },
]

export default function CompanyIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center gap-5"
    >
      {/* Text */}
      <div className="flex-1 min-w-0">
        <span className="text-brand text-[10px] font-semibold uppercase tracking-[0.14em] mb-1.5 block">
          About Us
        </span>
        <h3 className="text-sm font-bold text-ink tracking-tight mb-2">ALGO Group</h3>
        <p className="text-ink-muted text-xs leading-relaxed">
          At ALGO Group, great results come from great people. Our culture is built on trust,
          continuous growth, and a shared commitment to professionalism — where every
          team member's contribution matters.
        </p>
      </div>

      {/* Stat tiles */}
      <div className="flex gap-3 flex-shrink-0">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label}
               className="glass rounded-xl px-4 py-3 text-center card-float cursor-default min-w-[72px]">
            <Icon size={13} className="text-brand mx-auto mb-1.5 opacity-80" />
            <p className="text-ink font-bold text-sm leading-none mb-0.5">{value}</p>
            <p className="text-ink-subtle text-[10px] leading-tight whitespace-nowrap">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

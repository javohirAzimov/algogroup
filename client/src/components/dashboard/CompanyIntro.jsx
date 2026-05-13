import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe } from 'lucide-react'

const stats = [
  { icon: Users,     label: 'Team Members',   value: '120+' },
  { icon: Globe,     label: 'Operations',     value: 'US' },
  { icon: TrendingUp, label: 'Growing Since', value: '2018' },
]

export default function CompanyIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center gap-5"
    >
      <div>
        <span className="text-brand text-[10px] font-semibold uppercase tracking-[0.14em] mb-2 block">
          About Us
        </span>
        <h3 className="text-xl font-bold text-ink tracking-tight leading-tight mb-3">
          ALGO Group
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed">
          At ALGO Group, great results come from great people working together.
          Our culture is built on trust, continuous growth, and a shared commitment
          to professionalism — where every team member's contribution matters.
        </p>
        <p className="text-ink-muted text-sm leading-relaxed mt-2.5">
          From logistics innovation to day-to-day collaboration, we strive to create a
          workplace where ambition and belonging go hand in hand.
        </p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label}
               className="glass rounded-xl p-3 text-center card-float cursor-default">
            <Icon size={14} className="text-brand mx-auto mb-1.5 opacity-80" />
            <p className="text-ink font-bold text-base leading-none mb-1">{value}</p>
            <p className="text-ink-subtle text-[10px] leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

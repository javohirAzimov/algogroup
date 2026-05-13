import { motion } from 'framer-motion'
import { Wifi } from 'lucide-react'

const members = [
  { name: 'Alex J.',   initials: 'AJ', dept: 'Operations' },
  { name: 'Sofia M.',  initials: 'SM', dept: 'HR' },
  { name: 'James K.',  initials: 'JK', dept: 'Finance' },
  { name: 'Nina P.',   initials: 'NP', dept: 'Marketing' },
  { name: 'Carlos R.', initials: 'CR', dept: 'IT' },
]

export default function OnlineMembers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.18 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Online Now</p>
        <div className="flex items-center gap-1">
          <Wifi size={9} className="text-brand" />
          <span className="text-brand text-[10px] font-medium">{members.length} active</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {members.map(({ name, initials, dept }) => (
          <div key={name} className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
                <span className="text-brand text-[9px] font-semibold">{initials}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand border border-[var(--bg)]" />
            </div>
            <div>
              <p className="text-ink text-xs font-medium leading-none">{name}</p>
              <p className="text-ink-subtle text-[10px]">{dept}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

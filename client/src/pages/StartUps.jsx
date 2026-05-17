import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, ExternalLink, User, Loader2 } from 'lucide-react'
import { getStartups } from '../services/api'

const STAGE_STYLE = {
  'Idea':   'bg-indigo-400/10 text-indigo-300 border-indigo-400/20',
  'MVP':    'bg-amber-400/10  text-amber-300  border-amber-400/20',
  'Growth': 'bg-brand/10      text-brand      border-brand/20',
  'Scale':  'bg-purple-400/10 text-purple-300 border-purple-400/20',
}

function StartupCard({ startup, index }) {
  const stageCls = STAGE_STYLE[startup.stage] ?? 'bg-white/5 text-ink-muted border-edge'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      className="glass border border-edge rounded-2xl overflow-hidden flex flex-col hover:border-brand/30 transition-colors"
    >
      {/* Logo / banner */}
      <div className="h-32 bg-gradient-to-br from-brand/5 to-brand/10 flex items-center justify-center border-b border-edge relative">
        {startup.logoUrl ? (
          <img src={startup.logoUrl} alt={startup.name}
               className="h-20 w-20 object-contain rounded-xl" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Rocket size={28} className="text-brand" />
          </div>
        )}
        <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${stageCls}`}>
          {startup.stage}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-ink font-semibold text-base leading-snug mb-1">{startup.name}</h3>
        {startup.tagline && (
          <p className="text-brand text-xs font-medium mb-2">{startup.tagline}</p>
        )}
        <p className="text-ink-muted text-sm leading-relaxed flex-1">{startup.description}</p>

        <div className="mt-4 pt-4 border-t border-edge flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <User size={11} className="text-ink-subtle" />
            <span className="text-ink-subtle text-[11px]">{startup.teamLead}</span>
          </div>
          {startup.website && (
            <a href={startup.website} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-brand text-[11px] font-medium hover:underline">
              Visit <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function StartUps() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getStartups().then(r => setStartups(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Rocket size={20} className="text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">ALGO Start-Ups</h2>
          <p className="text-ink-muted text-sm mt-0.5">Ventures and projects born within ALGO Group</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={24} className="text-brand animate-spin" />
        </div>
      ) : startups.length === 0 ? (
        <div className="glass border border-edge rounded-2xl py-20 flex flex-col items-center gap-3">
          <Rocket size={36} className="text-ink-subtle" />
          <p className="text-ink font-semibold">No start-ups yet</p>
          <p className="text-ink-muted text-sm">Check back soon — something is launching.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {startups.map((s, i) => <StartupCard key={s.id} startup={s} index={i} />)}
        </div>
      )}
    </motion.div>
  )
}

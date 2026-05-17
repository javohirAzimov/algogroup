import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import api from '../../services/api'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

const RANK_STYLE = {
  1: {
    row:   'bg-amber-400/10 border-l-[3px] border-l-amber-400/70',
    badge: 'text-amber-400',
    pts:   'text-amber-400',
  },
  2: {
    row:   'bg-slate-400/8 border-l-[3px] border-l-slate-400/60',
    badge: 'text-slate-400',
    pts:   'text-slate-400',
  },
  3: {
    row:   'bg-orange-500/8 border-l-[3px] border-l-orange-400/60',
    badge: 'text-orange-400',
    pts:   'text-orange-400',
  },
}

const DEFAULT = {
  row:   'border-l-[3px] border-l-transparent',
  badge: 'text-ink-muted',
  pts:   'text-brand',
}

export default function Leaderboard() {
  const [rows, setRows]   = useState([])
  const [error, setError] = useState('')

  function load() {
    api.get('/leaderboard')
      .then(({ data: d }) => {
        if (d.error) { setError(d.error); return }
        setRows(d.leaderboard ?? [])
        setError('')
      })
      .catch(e => setError(e.message))
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

  if (error) return (
    <div className="glass rounded-2xl border border-edge px-5 py-6 text-center">
      <Trophy size={20} className="text-amber-400 mx-auto mb-2" />
      <p className="text-ink text-sm font-semibold mb-1">Leaderboard unavailable</p>
      <p className="text-ink-subtle text-xs font-mono">{error}</p>
    </div>
  )

  if (!rows.length) return null

  return (
    <div className="glass rounded-2xl overflow-hidden border border-edge">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-edge flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Trophy size={14} className="text-amber-400" />
          </div>
          <div>
            <p className="text-ink font-semibold text-sm leading-tight">Leaderboard</p>
            <p className="text-ink-muted text-[11px]">Top 10 this month · KPI Points</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle px-2 py-0.5 rounded-full border border-edge">
          Live
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand ml-1.5 shadow-[0_0_5px_rgba(0,200,83,0.8)] align-middle" />
        </span>
      </div>

      {/* column labels */}
      <div className="grid grid-cols-[2rem_1fr_auto] gap-3 px-4 py-2.5 border-b border-edge bg-white/[0.02]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">#</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Name / Team</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Points</span>
      </div>

      {/* rows */}
      <div className="flex flex-col divide-y divide-edge/20">
        {rows.map((entry, i) => {
          const s      = RANK_STYLE[entry.rank] ?? DEFAULT
          const medal  = MEDALS[entry.rank]

          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: i * 0.035 }}
              className={`grid grid-cols-[2rem_1fr_auto] gap-3 items-center px-4 py-3 transition-colors hover:bg-white/[0.03] ${s.row}`}
            >
              {/* rank / medal */}
              <div className={`text-center text-sm font-bold ${s.badge} leading-none`}>
                {medal ?? <span className="text-xs">{entry.rank}</span>}
              </div>

              {/* name + team */}
              <div className="min-w-0">
                <p className="text-ink text-sm font-semibold truncate leading-snug">
                  {entry.name}
                </p>
                <p className="text-ink-muted text-[11px] truncate mt-0.5">
                  {entry.team}
                </p>
              </div>

              {/* points */}
              <p className={`text-sm font-bold tabular-nums flex-shrink-0 ${s.pts}`}>
                {entry.points.toFixed(2)}
                <span className="text-[10px] font-semibold opacity-80 ml-0.5">PTS</span>
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

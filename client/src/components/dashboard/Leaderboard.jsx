import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

const URL = 'https://kpi-dashboard-production-3259.up.railway.app/api/public/leaderboard?api_key=0dff62dac4c138e0dd251d84991b3e1f8bc6be8b0069d57fa5050fcdc4cab60'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

const RANK_STYLE = {
  1: {
    row:   'bg-amber-400/8 border-l-2 border-l-amber-400/60',
    badge: 'text-amber-300',
    pts:   'text-amber-300',
  },
  2: {
    row:   'bg-slate-300/5 border-l-2 border-l-slate-400/50',
    badge: 'text-slate-300',
    pts:   'text-slate-300',
  },
  3: {
    row:   'bg-orange-600/8 border-l-2 border-l-orange-500/50',
    badge: 'text-orange-400',
    pts:   'text-orange-400',
  },
}

const DEFAULT = {
  row:   'border-l-2 border-l-transparent',
  badge: 'text-ink-subtle',
  pts:   'text-brand',
}

export default function Leaderboard() {
  const [rows, setRows] = useState([])

  function load() {
    fetch(URL)
      .then(r => r.json())
      .then(d => setRows(d.leaderboard ?? []))
      .catch(() => {})
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

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
            <p className="text-ink-subtle text-[11px]">Top 10 this month · KPI Points</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle px-2 py-0.5 rounded-full border border-edge">
          Live
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand ml-1.5 shadow-[0_0_5px_rgba(0,200,83,0.8)] align-middle" />
        </span>
      </div>

      {/* column labels */}
      <div className="grid grid-cols-[2rem_1fr_auto] gap-3 px-4 py-2 border-b border-edge/50">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">#</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">Name / Team</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">Points</span>
      </div>

      {/* rows */}
      <div className="flex flex-col divide-y divide-edge/40">
        {rows.map((entry, i) => {
          const s      = RANK_STYLE[entry.rank] ?? DEFAULT
          const medal  = MEDALS[entry.rank]

          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: i * 0.035 }}
              className={`grid grid-cols-[2rem_1fr_auto] gap-3 items-center px-4 py-3 ${s.row}`}
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
                <p className="text-ink-subtle text-[11px] truncate mt-0.5">
                  {entry.team}
                </p>
              </div>

              {/* points */}
              <p className={`text-sm font-bold tabular-nums flex-shrink-0 ${s.pts}`}>
                {entry.points.toFixed(2)}
                <span className="text-[10px] font-medium opacity-60 ml-0.5">PTS</span>
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

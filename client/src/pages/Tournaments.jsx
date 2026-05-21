import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Loader, Clock, CheckCircle, Play, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTournaments, joinTournament } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Countdown({ targetDate }) {
  const [diff, setDiff] = useState(Math.max(0, new Date(targetDate) - Date.now()))

  useEffect(() => {
    const id = setInterval(() => {
      const d = Math.max(0, new Date(targetDate) - Date.now())
      setDiff(d)
      if (d === 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const totalSec = Math.floor(diff / 1000)
  const d  = Math.floor(totalSec / 86400)
  const h  = Math.floor((totalSec % 86400) / 3600)
  const m  = Math.floor((totalSec % 3600) / 60)
  const s  = totalSec % 60

  if (d > 0) return <span>{d}d {h}h {m}m</span>
  return <span>{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>
}

function StatusBadge({ status }) {
  const cfg = {
    upcoming:  { cls: 'bg-amber-400/10 border-amber-400/30 text-amber-400', label: 'Upcoming' },
    active:    { cls: 'bg-brand/10 border-brand/30 text-brand',             label: 'Active Now' },
    completed: { cls: 'bg-white/5 border-edge text-ink-muted',              label: 'Completed' },
  }[status]
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

function TournamentCard({ tournament: t, onJoin, index }) {
  const { user }    = useAuth()
  const [joining, setJoining] = useState(false)

  const myEntry = t.entries?.find(e => e.userId === user?.id)
  const topEntries = [...(t.entries ?? [])]
    .filter(e => e.bestWpm != null)
    .sort((a, b) => b.bestWpm - a.bestWpm)
    .slice(0, 5)

  async function handleJoin() {
    if (joining || t.joined) return
    setJoining(true)
    try {
      await joinTournament(t.id)
      onJoin(t.id)
    } catch (e) {
      console.error(e)
    } finally {
      setJoining(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass rounded-xl border border-edge overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-edge">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={t.status} />
              {t.status === 'active' && t.joined && myEntry?.bestWpm && (
                <span className="text-[11px] text-brand font-semibold">
                  Your best: {myEntry.bestWpm} WPM
                </span>
              )}
            </div>
            <p className="text-ink font-semibold">{t.title}</p>
            {t.description && <p className="text-ink-muted text-sm mt-0.5">{t.description}</p>}
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {t.status !== 'completed' && !t.joined && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-ink-on text-xs font-semibold hover:bg-brand-h disabled:opacity-50 transition-colors"
              >
                {joining ? <Loader size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                {joining ? 'Joining…' : 'Join'}
              </button>
            )}
            {t.status === 'active' && t.joined && (
              <Link
                to="/agtype"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-ink-on text-xs font-semibold hover:bg-brand-h transition-colors"
              >
                <Play size={12} />
                Play Now
              </Link>
            )}
            {t.joined && t.status !== 'active' && (
              <span className="flex items-center gap-1 text-brand text-xs font-semibold">
                <CheckCircle size={12} />
                Joined
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-ink-muted mt-2">
          <span className="flex items-center gap-1">
            <Users size={11} />
            {t.entries?.length ?? 0} participants
          </span>
          {t.status === 'upcoming' && (
            <span className="flex items-center gap-1 text-amber-400">
              <Clock size={11} />
              Starts in <Countdown targetDate={t.startAt} />
            </span>
          )}
          {t.status === 'active' && (
            <span className="flex items-center gap-1 text-brand">
              <Clock size={11} />
              Ends in <Countdown targetDate={t.endAt} />
            </span>
          )}
          {t.status === 'completed' && (
            <span>
              Ended {new Date(t.endAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Leaderboard (active + completed only) */}
      {t.status !== 'upcoming' && topEntries.length > 0 && (
        <div>
          <div className="px-5 py-2 border-b border-edge">
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">
              {t.status === 'active' ? 'Current Standings' : 'Final Results'}
            </p>
          </div>
          <div className="divide-y divide-edge">
            {topEntries.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-2.5">
                <span className={`text-sm font-bold w-5 text-center
                  ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-ink-muted'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <p className={`flex-1 text-sm truncate ${entry.userId === user?.id ? 'text-brand font-semibold' : 'text-ink'}`}>
                  {entry.user.name}
                  {entry.userId === user?.id && ' (you)'}
                </p>
                <span className="text-ink text-sm font-bold">{entry.bestWpm} WPM</span>
                {entry.bestAccuracy != null && (
                  <span className="text-ink-muted text-xs">{entry.bestAccuracy.toFixed(1)}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {t.status !== 'upcoming' && topEntries.length === 0 && (
        <div className="px-5 py-5 text-center">
          <p className="text-ink-subtle text-sm">No scores submitted yet.</p>
        </div>
      )}
    </motion.div>
  )
}

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading]         = useState(true)

  const load = useCallback(() => {
    getTournaments()
      .then(r => setTournaments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function handleJoin(id) {
    setTournaments(prev => prev.map(t =>
      t.id === id ? { ...t, joined: true, entries: [...(t.entries ?? []), { userId: -1, bestWpm: null }] } : t
    ))
  }

  const grouped = {
    active:    tournaments.filter(t => t.status === 'active'),
    upcoming:  tournaments.filter(t => t.status === 'upcoming'),
    completed: tournaments.filter(t => t.status === 'completed'),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Trophy size={18} className="text-amber-400" />
        </div>
        <div>
          <p className="text-ink font-bold text-lg">AG Type Tournaments</p>
          <p className="text-ink-muted text-sm">Compete with your teammates. Best WPM wins.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={22} className="text-ink-subtle animate-spin" />
        </div>
      ) : tournaments.length === 0 ? (
        <div className="glass rounded-xl border border-edge py-16 text-center">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-ink font-semibold mb-1">No tournaments yet</p>
          <p className="text-ink-muted text-sm">Check back soon — your admin will schedule one.</p>
        </div>
      ) : (
        <>
          {grouped.active.length > 0 && (
            <section className="space-y-3">
              <SectionDivider label="Active Now" emoji="🔴" />
              {grouped.active.map((t, i) => (
                <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} index={i} />
              ))}
            </section>
          )}
          {grouped.upcoming.length > 0 && (
            <section className="space-y-3">
              <SectionDivider label="Coming Up" emoji="📅" />
              {grouped.upcoming.map((t, i) => (
                <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} index={i} />
              ))}
            </section>
          )}
          {grouped.completed.length > 0 && (
            <section className="space-y-3">
              <SectionDivider label="Past Tournaments" emoji="📜" />
              {grouped.completed.map((t, i) => (
                <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} index={i} />
              ))}
            </section>
          )}
        </>
      )}
    </motion.div>
  )
}

function SectionDivider({ label, emoji }) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className="flex-1 divider-glow" />
      <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
        <span className="text-sm">{emoji}</span>
        <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex-1 divider-glow" />
    </div>
  )
}

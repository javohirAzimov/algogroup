import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Medal, Loader, Lock } from 'lucide-react'
import { getMyGamification } from '../services/api'
import { computeLevel, levelBg, LEVELS } from '../utils/levels'
import { useAuth } from '../context/AuthContext'

function XpBar({ xp, levelInfo }) {
  const { xpForCurrent, xpForNext, progress } = levelInfo
  if (!xpForNext) {
    return (
      <div className="w-full h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-brand" style={{ width: '100%' }} />
      </div>
    )
  }
  return (
    <div className="space-y-1">
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(0,200,83,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-ink-subtle">
        <span>{xp - xpForCurrent} XP into this level</span>
        <span>{xpForNext - xp} XP to {levelInfo.nextName}</span>
      </div>
    </div>
  )
}

function BadgeCard({ badge, index }) {
  const earned = badge.earned
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`relative glass rounded-xl border p-4 flex flex-col items-center text-center gap-2
        ${earned ? 'border-brand/30 bg-brand/5' : 'border-edge opacity-50'}`}
    >
      {!earned && (
        <div className="absolute top-2.5 right-2.5">
          <Lock size={11} className="text-ink-subtle" />
        </div>
      )}
      <span className={`text-3xl ${earned ? '' : 'grayscale opacity-40'}`}>{badge.icon}</span>
      <div>
        <p className={`text-xs font-semibold ${earned ? 'text-ink' : 'text-ink-muted'}`}>{badge.name}</p>
        <p className="text-[10px] text-ink-subtle mt-0.5 leading-relaxed">{badge.description}</p>
      </div>
      <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border
        ${earned
          ? 'bg-brand/10 border-brand/30 text-brand'
          : 'bg-white/5 border-edge text-ink-subtle'}`}
      >
        {earned ? `+${badge.xpReward} XP` : `${badge.xpReward} XP reward`}
      </div>
      {earned && badge.earnedAt && (
        <p className="text-[10px] text-ink-subtle">
          Earned {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  )
}

export default function Achievements() {
  const { user } = useAuth()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyGamification()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const xp        = data?.xp ?? user?.xp ?? 0
  const levelInfo = computeLevel(xp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* XP + Level card */}
      <div className="glass rounded-xl border border-edge p-6">
        <div className="flex items-start gap-5 mb-5">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <span className="text-3xl">🏅</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${levelBg(levelInfo.level)}`}>
                Level {levelInfo.level} · {levelInfo.name}
              </span>
              {levelInfo.level === 10 && (
                <span className="text-xs text-purple-400 font-semibold">MAX LEVEL</span>
              )}
            </div>
            <p className="text-ink font-semibold text-lg">{xp.toLocaleString()} XP</p>
            {data?.loginStreak > 0 && (
              <p className="text-ink-muted text-sm mt-0.5">
                🔥 {data.loginStreak}-day login streak
              </p>
            )}
          </div>
        </div>
        <XpBar xp={xp} levelInfo={levelInfo} />
      </div>

      {/* Level roadmap */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 divider-glow" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
            <span className="text-xs">🗺</span>
            <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em]">Level Roadmap</span>
          </div>
          <div className="flex-1 divider-glow" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LEVELS.map(tier => {
            const active  = levelInfo.level === tier.level
            const unlocked = xp >= tier.xp
            return (
              <div
                key={tier.level}
                className={`rounded-lg border px-3 py-2.5 text-center transition-all
                  ${active   ? 'border-brand bg-brand/10' :
                    unlocked ? 'border-edge bg-white/3' :
                               'border-edge opacity-40'}`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-wide
                  ${active ? 'text-brand' : unlocked ? 'text-ink-muted' : 'text-ink-subtle'}`}>
                  Lv.{tier.level}
                </p>
                <p className={`text-xs font-bold mt-0.5 ${active ? 'text-ink' : 'text-ink-muted'}`}>
                  {tier.name}
                </p>
                <p className="text-[10px] text-ink-subtle mt-0.5">{tier.xp.toLocaleString()} XP</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Badges */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 divider-glow" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
            <Medal size={12} className="text-amber-400" />
            <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em]">Achievement Badges</span>
          </div>
          <div className="flex-1 divider-glow" />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader size={20} className="text-ink-subtle animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-ink-muted text-sm">
                <span className="text-ink font-semibold">{data?.badges?.filter(b => b.earned).length ?? 0}</span>
                {' / '}
                <span>{data?.badges?.length ?? 0}</span>
                {' badges earned'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(data?.badges ?? []).map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} index={i} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* How to earn XP */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 divider-glow" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-edge">
            <span className="text-xs">⚡</span>
            <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.14em]">How to Earn XP</span>
          </div>
          <div className="flex-1 divider-glow" />
        </div>
        <div className="glass rounded-xl border border-edge divide-y divide-edge">
          {[
            { icon: '🔑', label: 'Daily login',            xp: '+10 XP' },
            { icon: '⌨',  label: 'Complete a typing test', xp: '+10 XP' },
            { icon: '📣', label: 'Send a shoutout',        xp: '+25 XP' },
            { icon: '🎂', label: 'Leave a birthday wish',  xp: '+25 XP' },
            { icon: '🏅', label: 'Unlock a badge',         xp: '+varies' },
          ].map(({ icon, label, xp: reward }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-base">{icon}</span>
                <span className="text-ink-muted text-sm">{label}</span>
              </div>
              <span className="text-brand text-sm font-semibold">{reward}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

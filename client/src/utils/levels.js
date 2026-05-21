export const LEVELS = [
  { level: 1,  name: 'Rookie',      xp: 0    },
  { level: 2,  name: 'Explorer',    xp: 100  },
  { level: 3,  name: 'Contributor', xp: 250  },
  { level: 4,  name: 'Achiever',    xp: 500  },
  { level: 5,  name: 'Pro',         xp: 1000 },
  { level: 6,  name: 'Expert',      xp: 1750 },
  { level: 7,  name: 'Elite',       xp: 2750 },
  { level: 8,  name: 'Master',      xp: 4000 },
  { level: 9,  name: 'Champion',    xp: 5500 },
  { level: 10, name: 'Legend',      xp: 7500 },
]

export function computeLevel(xp) {
  let current = LEVELS[0]
  for (const tier of LEVELS) {
    if (xp >= tier.xp) current = tier
    else break
  }
  const idx  = LEVELS.indexOf(current)
  const next = LEVELS[idx + 1] || null
  return {
    level:        current.level,
    name:         current.name,
    xpForCurrent: current.xp,
    xpForNext:    next?.xp   ?? null,
    nextName:     next?.name ?? null,
    progress:     next ? Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100) : 100,
  }
}

export function levelColor(level) {
  if (level >= 10) return 'text-purple-400'
  if (level >= 7)  return 'text-amber-400'
  if (level >= 4)  return 'text-brand'
  return 'text-ink-muted'
}

export function levelBg(level) {
  if (level >= 10) return 'bg-purple-400/10 border-purple-400/30 text-purple-400'
  if (level >= 7)  return 'bg-amber-400/10 border-amber-400/30 text-amber-400'
  if (level >= 4)  return 'bg-brand/10 border-brand/30 text-brand'
  return 'bg-white/5 border-edge text-ink-muted'
}

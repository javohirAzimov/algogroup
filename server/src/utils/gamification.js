import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  const idx = LEVELS.indexOf(current)
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

// Award XP to a user. Fire-and-forget safe — does not throw.
export async function awardXP(userId, amount) {
  try {
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: amount } } })
  } catch (e) {
    console.error('awardXP error:', e.message)
  }
}

// Award a badge by key. Returns the Badge if newly earned, null if already owned.
// Also credits badge.xpReward to the user and half that as store points.
export async function awardBadge(userId, badgeKey) {
  try {
    const badge = await prisma.badge.findUnique({ where: { key: badgeKey } })
    if (!badge) return null
    const exists = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    })
    if (exists) return null
    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } })
    const ops = []
    if (badge.xpReward > 0) {
      const pts = Math.floor(badge.xpReward / 2)
      ops.push(
        prisma.user.update({ where: { id: userId }, data: { xp: { increment: badge.xpReward }, points: { increment: pts } } }),
        prisma.pointTransaction.create({
          data: { userId, amount: pts, reason: 'achievement', note: badge.name },
        }),
      )
    }
    if (ops.length) await prisma.$transaction(ops)
    return badge
  } catch (e) {
    console.error('awardBadge error:', e.message)
    return null
  }
}

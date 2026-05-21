import { PrismaClient } from '@prisma/client'
import { computeLevel, LEVELS } from '../utils/gamification.js'

const prisma = new PrismaClient()

export async function getMyGamification(req, res, next) {
  try {
    const userId = req.user.id

    const [user, userBadges, allBadges] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { xp: true, loginStreak: true } }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
      }),
      prisma.badge.findMany({ orderBy: { id: 'asc' } }),
    ])

    const xp          = user?.xp ?? 0
    const levelInfo   = computeLevel(xp)
    const earnedKeys  = new Set(userBadges.map(ub => ub.badge.key))

    const badges = allBadges.map(b => ({
      ...b,
      earned:   earnedKeys.has(b.key),
      earnedAt: userBadges.find(ub => ub.badge.key === b.key)?.earnedAt ?? null,
    }))

    res.json({
      xp,
      loginStreak: user?.loginStreak ?? 0,
      ...levelInfo,
      levels: LEVELS,
      badges,
    })
  } catch (err) { next(err) }
}

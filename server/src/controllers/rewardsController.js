import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VALID_TIERS = new Set(['merch', 'mid', 'high'])

// ── User endpoints ─────────────────────────────────────────────────────

export async function getStore(req, res, next) {
  try {
    const userId = req.user.id
    const [rewards, redeemedRows, user] = await Promise.all([
      prisma.rewardItem.findMany({
        where: { isActive: true },
        orderBy: [{ tier: 'asc' }, { cost: 'asc' }],
      }),
      prisma.userRedemption.groupBy({
        by: ['rewardId'],
        where: { userId, status: { not: 'rejected' } },
        _count: { id: true },
      }),
      prisma.user.findUnique({ where: { id: userId }, select: { points: true } }),
    ])
    const redeemedMap = Object.fromEntries(redeemedRows.map(r => [r.rewardId, r._count.id]))
    res.json({
      rewards: rewards.map(r => ({ ...r, myRedemptionCount: redeemedMap[r.id] ?? 0 })),
      userPoints: user?.points ?? 0,
    })
  } catch (err) { next(err) }
}

export async function getMyRedemptions(req, res, next) {
  try {
    const redemptions = await prisma.userRedemption.findMany({
      where: { userId: req.user.id },
      include: { reward: { select: { name: true, imageUrl: true, tier: true, cost: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(redemptions)
  } catch (err) { next(err) }
}

export async function redeemReward(req, res, next) {
  try {
    const userId   = req.user.id
    const rewardId = Number(req.params.id)

    const [reward, user] = await Promise.all([
      prisma.rewardItem.findUnique({ where: { id: rewardId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { points: true } }),
    ])

    if (!reward || !reward.isActive) return res.status(404).json({ error: 'Reward not found' })
    if (user.points < reward.cost)   return res.status(400).json({ error: 'Insufficient points' })
    if (reward.stock === 0)          return res.status(400).json({ error: 'Out of stock' })

    // Atomically claim one unit of stock (skip for unlimited)
    if (reward.stock > 0) {
      const claimed = await prisma.rewardItem.updateMany({
        where: { id: rewardId, stock: { gt: 0 } },
        data:  { stock: { decrement: 1 } },
      })
      if (claimed.count === 0) return res.status(400).json({ error: 'Out of stock' })
    }

    const [redemption] = await prisma.$transaction([
      prisma.userRedemption.create({ data: { userId, rewardId, status: 'pending' } }),
      prisma.user.update({ where: { id: userId }, data: { points: { decrement: reward.cost } } }),
      prisma.pointTransaction.create({
        data: { userId, amount: -reward.cost, reason: 'redemption', note: reward.name },
      }),
    ])

    res.status(201).json({ ...redemption, reward: { name: reward.name, tier: reward.tier } })
  } catch (err) { next(err) }
}

// ── Admin endpoints ────────────────────────────────────────────────────

export async function adminGetAllRewards(req, res, next) {
  try {
    const rewards = await prisma.rewardItem.findMany({
      orderBy: [{ isActive: 'desc' }, { tier: 'asc' }, { cost: 'asc' }],
      include: { _count: { select: { redemptions: true } } },
    })
    res.json(rewards)
  } catch (err) { next(err) }
}

export async function adminCreateReward(req, res, next) {
  try {
    const { name, description, imageUrl, tier, cost, stock } = req.body
    if (!name || !tier || cost == null) return res.status(400).json({ error: 'name, tier, cost required' })
    if (!VALID_TIERS.has(tier))         return res.status(400).json({ error: 'tier must be merch | mid | high' })
    const reward = await prisma.rewardItem.create({
      data: {
        name,
        description: description ?? '',
        imageUrl:    imageUrl || null,
        tier,
        cost:  Number(cost),
        stock: stock != null ? Number(stock) : -1,
      },
    })
    res.status(201).json(reward)
  } catch (err) { next(err) }
}

export async function adminUpdateReward(req, res, next) {
  try {
    const id = Number(req.params.id)
    const { name, description, imageUrl, tier, cost, stock, isActive } = req.body
    if (tier != null && !VALID_TIERS.has(tier)) return res.status(400).json({ error: 'Invalid tier' })
    const reward = await prisma.rewardItem.update({
      where: { id },
      data: {
        ...(name        != null && { name }),
        ...(description != null && { description }),
        ...(imageUrl    !== undefined && { imageUrl: imageUrl || null }),
        ...(tier        != null && { tier }),
        ...(cost        != null && { cost: Number(cost) }),
        ...(stock       != null && { stock: Number(stock) }),
        ...(isActive    != null && { isActive: Boolean(isActive) }),
      },
    })
    res.json(reward)
  } catch (err) { next(err) }
}

export async function adminDeleteReward(req, res, next) {
  try {
    await prisma.rewardItem.update({ where: { id: Number(req.params.id) }, data: { isActive: false } })
    res.status(204).end()
  } catch (err) { next(err) }
}

export async function adminGetRedemptions(req, res, next) {
  try {
    const { status } = req.query
    const redemptions = await prisma.userRedemption.findMany({
      where: status ? { status } : {},
      include: {
        user:   { select: { name: true, email: true, department: true } },
        reward: { select: { name: true, tier: true, cost: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(redemptions)
  } catch (err) { next(err) }
}

export async function adminUpdateRedemption(req, res, next) {
  try {
    const id     = Number(req.params.id)
    const { status, notes } = req.body
    const VALID = new Set(['pending', 'approved', 'shipped', 'rejected'])
    if (!VALID.has(status)) return res.status(400).json({ error: 'Invalid status' })

    const existing = await prisma.userRedemption.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Redemption not found' })

    // Refund points when rejecting a non-rejected redemption
    if (status === 'rejected' && existing.status !== 'rejected') {
      const reward = await prisma.rewardItem.findUnique({ where: { id: existing.rewardId } })
      await prisma.$transaction([
        prisma.userRedemption.update({ where: { id }, data: { status, notes: notes ?? null } }),
        prisma.user.update({ where: { id: existing.userId }, data: { points: { increment: reward.cost } } }),
        ...(reward.stock >= 0 ? [prisma.rewardItem.update({
          where: { id: reward.id }, data: { stock: { increment: 1 } },
        })] : []),
        prisma.pointTransaction.create({
          data: { userId: existing.userId, amount: reward.cost, reason: 'refund', note: `Rejected #${id}` },
        }),
      ])
    } else {
      await prisma.userRedemption.update({ where: { id }, data: { status, notes: notes ?? null } })
    }

    const updated = await prisma.userRedemption.findUnique({
      where: { id },
      include: {
        user:   { select: { name: true, email: true, department: true } },
        reward: { select: { name: true, tier: true, cost: true } },
      },
    })
    res.json(updated)
  } catch (err) { next(err) }
}

export async function adminGrantPoints(req, res, next) {
  try {
    const { userId, amount, note } = req.body
    if (!userId || amount == null) return res.status(400).json({ error: 'userId and amount required' })
    const pts = Number(amount)
    if (!Number.isFinite(pts) || pts === 0) return res.status(400).json({ error: 'Invalid amount' })

    const target = await prisma.user.findUnique({ where: { id: Number(userId) } })
    if (!target) return res.status(404).json({ error: 'User not found' })

    await prisma.$transaction([
      prisma.user.update({ where: { id: target.id }, data: { points: { increment: pts } } }),
      prisma.pointTransaction.create({
        data: { userId: target.id, amount: pts, reason: 'admin_grant', note: note || 'Admin grant' },
      }),
    ])
    const updated = await prisma.user.findUnique({
      where: { id: target.id }, select: { id: true, name: true, points: true },
    })
    res.json(updated)
  } catch (err) { next(err) }
}

export async function adminAwardTournamentPoints(req, res, next) {
  try {
    const tournamentId = Number(req.params.tournamentId)
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        entries: {
          where: { bestWpm: { not: null } },
          orderBy: { bestWpm: 'desc' },
          take: 10,
        },
      },
    })
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' })
    if (!tournament.entries.length) return res.status(400).json({ error: 'No entries to award' })

    const AWARDS = [500, 250, 100, 50, 50, 50, 50, 50, 50, 50]
    const ops = []
    for (let i = 0; i < tournament.entries.length; i++) {
      const { userId } = tournament.entries[i]
      const pts = AWARDS[i] ?? 25
      ops.push(
        prisma.user.update({ where: { id: userId }, data: { points: { increment: pts } } }),
        prisma.pointTransaction.create({
          data: { userId, amount: pts, reason: 'tournament_win', note: `${tournament.title} — Rank #${i + 1}` },
        }),
      )
    }
    await prisma.$transaction(ops)
    res.json({ awarded: tournament.entries.length, tournament: tournament.title })
  } catch (err) { next(err) }
}

export async function getPointsLeaderboard(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true, points: { gt: 0 } },
      orderBy: { points: 'desc' },
      take: 10,
      select: { id: true, name: true, department: true, points: true },
    })
    res.json(users.map((u, i) => ({ ...u, rank: i + 1 })))
  } catch (err) { next(err) }
}

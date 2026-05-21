import { PrismaClient } from '@prisma/client'
import { awardXP, awardBadge } from '../utils/gamification.js'

const prisma = new PrismaClient()

const VALID_DURATIONS = new Set([15, 30, 60, 120])
const MAX_WPM = 250

export async function submitScore(req, res, next) {
  try {
    const userId = req.user.id
    let { wpm, accuracy, errors, duration, wordsTyped } = req.body

    wpm        = Number(wpm)
    accuracy   = Number(accuracy)
    errors     = Number(errors)
    duration   = Number(duration)
    wordsTyped = Number(wordsTyped)

    if (!VALID_DURATIONS.has(duration))
      return res.status(400).json({ error: 'Invalid duration' })
    if (!Number.isFinite(wpm) || wpm < 0 || wpm > MAX_WPM)
      return res.status(400).json({ error: 'Invalid WPM' })
    if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100)
      return res.status(400).json({ error: 'Invalid accuracy' })
    if (!Number.isFinite(errors) || errors < 0)
      return res.status(400).json({ error: 'Invalid error count' })
    if (!Number.isFinite(wordsTyped) || wordsTyped < 0)
      return res.status(400).json({ error: 'Invalid wordsTyped' })

    const maxWords = Math.ceil((MAX_WPM * duration) / 60)
    if (wordsTyped > maxWords)
      return res.status(400).json({ error: 'Score rejected: impossible stats' })

    const score = await prisma.typingScore.create({
      data: {
        userId,
        wpm:        Math.round(wpm),
        accuracy:   Math.round(accuracy * 10) / 10,
        errors:     Math.round(errors),
        duration:   Math.round(duration),
        wordsTyped: Math.round(wordsTyped),
      },
    })

    // XP + badges (fire-and-forget)
    awardXP(userId, 10).catch(() => {})
    if (wpm >= 150) awardBadge(userId, 'wpm_150').catch(() => {})
    else if (wpm >= 100) awardBadge(userId, 'wpm_100').catch(() => {})

    // typing_10 badge: check total games
    prisma.typingScore.count({ where: { userId } }).then(total => {
      if (total >= 10) awardBadge(userId, 'typing_10').catch(() => {})
    }).catch(() => {})

    // Auto-update active tournament entry if user is enrolled
    updateTournamentEntry(userId, Math.round(wpm), Math.round(accuracy * 10) / 10).catch(() => {})

    res.status(201).json(score)
  } catch (err) { next(err) }
}

async function updateTournamentEntry(userId, wpm, accuracy) {
  const now = new Date()
  const active = await prisma.tournament.findFirst({
    where: { startAt: { lte: now }, endAt: { gte: now } },
  })
  if (!active) return

  const entry = await prisma.tournamentEntry.findUnique({
    where: { tournamentId_userId: { tournamentId: active.id, userId } },
  })
  if (!entry) return

  if (entry.bestWpm === null || wpm > entry.bestWpm) {
    await prisma.tournamentEntry.update({
      where: { tournamentId_userId: { tournamentId: active.id, userId } },
      data:  { bestWpm: wpm, bestAccuracy: accuracy, submittedAt: now },
    })
  }
}

export async function getLeaderboard(_req, res, next) {
  try {
    const rows = await prisma.$queryRaw`
      SELECT DISTINCT ON (ts."userId")
        ts.id,
        ts."userId",
        ts.wpm,
        ts.accuracy,
        ts.errors,
        ts.duration,
        ts."wordsTyped",
        ts."createdAt",
        u.name,
        u.department
      FROM "TypingScore" ts
      JOIN "User" u ON u.id = ts."userId"
      ORDER BY ts."userId", ts.wpm DESC
    `

    const sorted = [...rows]
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10)
      .map((s, i) => ({
        rank:       i + 1,
        userId:     Number(s.userId),
        username:   s.name,
        department: s.department ?? '—',
        wpm:        s.wpm,
        accuracy:   parseFloat(s.accuracy),
        date:       s.createdAt,
      }))

    res.json(sorted)
  } catch (err) { next(err) }
}

export async function getMyStats(req, res, next) {
  try {
    const userId = req.user.id

    const [best, agg] = await Promise.all([
      prisma.typingScore.findFirst({
        where:   { userId },
        orderBy: { wpm: 'desc' },
      }),
      prisma.typingScore.aggregate({
        where: { userId },
        _count: { id: true },
        _avg:   { accuracy: true },
      }),
    ])

    res.json({
      bestWpm:     best?.wpm ?? 0,
      avgAccuracy: agg._avg.accuracy != null
        ? Math.round(agg._avg.accuracy * 10) / 10
        : 0,
      totalGames: agg._count.id,
    })
  } catch (err) { next(err) }
}

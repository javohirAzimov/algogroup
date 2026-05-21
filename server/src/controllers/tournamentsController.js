import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getStatus(t) {
  const now = new Date()
  if (now < new Date(t.startAt)) return 'upcoming'
  if (now > new Date(t.endAt))   return 'completed'
  return 'active'
}

export async function getTournaments(req, res, next) {
  try {
    const userId = req.user.id
    const tournaments = await prisma.tournament.findMany({
      orderBy: { startAt: 'desc' },
      include: {
        entries: {
          include: { user: { select: { id: true, name: true, department: true } } },
          orderBy: { bestWpm: 'desc' },
        },
      },
    })

    const result = tournaments.map(t => ({
      ...t,
      status:  getStatus(t),
      joined:  t.entries.some(e => e.userId === userId),
      myEntry: t.entries.find(e => e.userId === userId) ?? null,
    }))

    res.json(result)
  } catch (err) { next(err) }
}

export async function joinTournament(req, res, next) {
  try {
    const userId       = req.user.id
    const tournamentId = Number(req.params.id)

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } })
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' })

    const status = getStatus(tournament)
    if (status === 'completed') return res.status(400).json({ error: 'Tournament is over' })

    const entry = await prisma.tournamentEntry.upsert({
      where:  { tournamentId_userId: { tournamentId, userId } },
      update: {},
      create: { tournamentId, userId },
    })

    res.status(201).json(entry)
  } catch (err) { next(err) }
}

export async function createTournament(req, res, next) {
  try {
    const { title, description, startAt, endAt } = req.body
    if (!title?.trim() || !startAt || !endAt) {
      return res.status(400).json({ error: 'title, startAt, and endAt are required' })
    }
    const start = new Date(startAt)
    const end   = new Date(endAt)
    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ error: 'Invalid date range' })
    }

    const tournament = await prisma.tournament.create({
      data: { title: title.trim(), description: description?.trim() || null, startAt: start, endAt: end },
    })
    res.status(201).json({ ...tournament, status: getStatus(tournament), entries: [] })
  } catch (err) { next(err) }
}

export async function deleteTournament(req, res, next) {
  try {
    const id = Number(req.params.id)
    await prisma.tournamentEntry.deleteMany({ where: { tournamentId: id } })
    await prisma.tournament.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) { next(err) }
}

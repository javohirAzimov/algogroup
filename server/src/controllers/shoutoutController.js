import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getShoutouts(req, res, next) {
  try {
    const shoutouts = await prisma.shoutout.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        from: { select: { id: true, name: true, avatarUrl: true, department: true } },
        to:   { select: { id: true, name: true, avatarUrl: true, department: true } },
      },
    })
    res.json(shoutouts)
  } catch (err) {
    next(err)
  }
}

export async function postShoutout(req, res, next) {
  try {
    const { toUserId, message, isBirthday } = req.body
    if (!toUserId || !message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'toUserId and message are required' })
    }
    if (message.trim().length > 300) {
      return res.status(400).json({ error: 'Message too long (max 300 chars)' })
    }
    if (Number(toUserId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot shoutout yourself' })
    }
    const to = await prisma.user.findUnique({ where: { id: Number(toUserId) } })
    if (!to) return res.status(404).json({ error: 'User not found' })

    const shoutout = await prisma.shoutout.create({
      data: { fromUserId: req.user.id, toUserId: Number(toUserId), message: message.trim(), isBirthday: !!isBirthday },
      include: {
        from: { select: { id: true, name: true, avatarUrl: true, department: true } },
        to:   { select: { id: true, name: true, avatarUrl: true, department: true } },
      },
    })
    res.status(201).json(shoutout)
  } catch (err) {
    next(err)
  }
}

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getBirthdayMessages(req, res, next) {
  try {
    const toUserId = Number(req.params.userId)
    const messages = await prisma.birthdayMessage.findMany({
      where: { toUserId },
      orderBy: { createdAt: 'desc' },
      include: { from: { select: { id: true, name: true, avatarUrl: true, department: true } } },
    })
    res.json(messages)
  } catch (err) {
    next(err)
  }
}

export async function postBirthdayMessage(req, res, next) {
  try {
    const toUserId = Number(req.params.userId)
    const { message } = req.body
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (message.trim().length > 300) {
      return res.status(400).json({ error: 'Message too long (max 300 chars)' })
    }
    const to = await prisma.user.findUnique({ where: { id: toUserId } })
    if (!to) return res.status(404).json({ error: 'User not found' })

    const msg = await prisma.birthdayMessage.create({
      data: { fromUserId: req.user.id, toUserId, message: message.trim() },
      include: { from: { select: { id: true, name: true, avatarUrl: true, department: true } } },
    })
    res.status(201).json(msg)
  } catch (err) {
    next(err)
  }
}

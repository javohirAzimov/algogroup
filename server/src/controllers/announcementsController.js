import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAll(req, res, next) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: 'desc' },
      include: { author: { select: { id: true, name: true } } },
    })
    res.json(announcements)
  } catch (err) {
    next(err)
  }
}

export async function getById(req, res, next) {
  try {
    const item = await prisma.announcement.findUnique({
      where: { id: Number(req.params.id) },
      include: { author: { select: { id: true, name: true } } },
    })
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const { title, description, date, type, imageUrl } = req.body
    if (!title || !description || !date || !type) {
      return res.status(400).json({ error: 'title, description, date and type are required' })
    }
    const item = await prisma.announcement.create({
      data: { title, description, date: new Date(date), type, imageUrl, authorId: req.user.id },
    })
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    const { title, description, date, type, imageUrl } = req.body
    const item = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title       && { title }),
        ...(description && { description }),
        ...(date        && { date: new Date(date) }),
        ...(type        && { type }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.announcement.delete({ where: { id: Number(req.params.id) } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

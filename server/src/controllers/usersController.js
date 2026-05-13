import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function safeUser(u) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, department: u.department, avatarUrl: u.avatarUrl, isActive: u.isActive, createdAt: u.createdAt }
}

export async function getAll(req, res, next) {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(users.map(safeUser))
  } catch (err) {
    next(err)
  }
}

export async function getById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(safeUser(user))
  } catch (err) {
    next(err)
  }
}

export async function toggleActive(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (id === req.user.id) return res.status(400).json({ error: 'Cannot deactivate yourself' })
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const updated = await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } })
    res.json(safeUser(updated))
  } catch (err) {
    next(err)
  }
}

export async function promoteToAdmin(req, res, next) {
  try {
    const id = Number(req.params.id)
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const updated = await prisma.user.update({ where: { id }, data: { role: 'admin' } })
    res.json(safeUser(updated))
  } catch (err) {
    next(err)
  }
}

export async function demoteToUser(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (id === req.user.id) return res.status(400).json({ error: 'Cannot demote yourself' })
    const updated = await prisma.user.update({ where: { id }, data: { role: 'user' } })
    res.json(safeUser(updated))
  } catch (err) {
    next(err)
  }
}

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function safeUser(u) {
  return {
    id: u.id, email: u.email, name: u.name, role: u.role,
    department: u.department, avatarUrl: u.avatarUrl,
    isActive: u.isActive, createdAt: u.createdAt, birthday: u.birthday,
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, birthday } = req.body
    const data = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name cannot be empty' })
      }
      data.name = name.trim().slice(0, 100)
    }

    if (birthday !== undefined) {
      if (birthday === null || birthday === '') {
        data.birthday = null
      } else if (/^\d{2}-\d{2}$/.test(birthday)) {
        const [mm, dd] = birthday.split('-').map(Number)
        if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
          return res.status(400).json({ error: 'Invalid birthday date' })
        }
        data.birthday = birthday
      } else {
        return res.status(400).json({ error: 'Birthday must be MM-DD format' })
      }
    }

    const updated = await prisma.user.update({ where: { id: req.user.id }, data })
    res.json(safeUser(updated))
  } catch (err) {
    next(err)
  }
}

function daysUntilBirthday(birthdayStr) {
  const [mm, dd] = birthdayStr.split('-').map(Number)
  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let next = new Date(today.getFullYear(), mm - 1, dd)
  if (next < todayMidnight) next = new Date(today.getFullYear() + 1, mm - 1, dd)
  return Math.round((next - todayMidnight) / 86400000)
}

export async function getUpcomingBirthdays(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { birthday: { not: null }, isActive: true },
      select: { id: true, name: true, department: true, avatarUrl: true, birthday: true },
    })

    const enriched = users
      .map(u => ({ ...u, daysUntil: daysUntilBirthday(u.birthday) }))
      .filter(u => u.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5)

    res.json(enriched)
  } catch (err) {
    next(err)
  }
}

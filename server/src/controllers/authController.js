import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { awardXP, awardBadge } from '../utils/gamification.js'

const prisma = new PrismaClient()

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export async function register(req, res, next) {
  try {
    const { email, password, name, department } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password and name are required' })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hash, name, department },
    })

    // First-ever login badge + 10 XP for the day
    awardXP(user.id, 10).catch(() => {})
    awardBadge(user.id, 'first_login').catch(() => {})

    res.status(201).json({ token: signToken(user), user: safeUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    // Daily XP + login streak
    const today     = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (user.lastLoginDate !== today) {
      let newStreak = 1
      if (user.lastLoginDate === yesterday) {
        newStreak = (user.loginStreak || 0) + 1
      }
      await prisma.user.update({
        where: { id: user.id },
        data:  { lastLoginDate: today, loginStreak: newStreak },
      })
      awardXP(user.id, 10).catch(() => {})
      if (newStreak >= 7) awardBadge(user.id, 'login_streak_7').catch(() => {})
    }

    res.json({ token: signToken(user), user: safeUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user || !user.isActive) return res.status(401).json({ error: 'Account not found' })
    res.json(safeUser(user))
  } catch (err) {
    next(err)
  }
}

function safeUser(u) {
  return {
    id: u.id, email: u.email, name: u.name, role: u.role,
    department: u.department, avatarUrl: u.avatarUrl, birthday: u.birthday,
    isActive: u.isActive, createdAt: u.createdAt,
    xp: u.xp ?? 0, loginStreak: u.loginStreak ?? 0,
    points: u.points ?? 0,
  }
}

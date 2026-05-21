import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
  return { id: u.id, email: u.email, name: u.name, role: u.role, department: u.department, avatarUrl: u.avatarUrl, birthday: u.birthday, isActive: u.isActive, createdAt: u.createdAt }
}

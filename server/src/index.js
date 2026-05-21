import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import announcementsRouter from './routes/announcements.js'
import suggestionsRouter   from './routes/suggestions.js'
import knowledgeRouter     from './routes/knowledge.js'
import authRouter          from './routes/auth.js'
import usersRouter         from './routes/users.js'
import spotlightsRouter    from './routes/spotlights.js'
import uploadRouter        from './routes/upload.js'
import aiRouter            from './routes/ai.js'
import newsRouter          from './routes/news.js'
import leaderboardRouter   from './routes/leaderboard.js'
import startupsRouter      from './routes/startups.js'
import typingRouter        from './routes/typing.js'
import profileRouter       from './routes/profile.js'
import birthdaysRouter     from './routes/birthdays.js'
import shoutoutsRouter     from './routes/shoutouts.js'
import errorHandler        from './middleware/errorHandler.js'

dotenv.config()

const prisma = new PrismaClient()

async function ensureAdmin() {
  const exists = await prisma.user.findUnique({ where: { email: 'admin@algogroup.com' } })
  if (!exists) {
    const hash = await bcrypt.hash('Admin@1234', 10)
    await prisma.user.create({
      data: { email: 'admin@algogroup.com', name: 'ALGO Admin', password: hash, role: 'admin', department: 'Management' }
    })
    console.log('Admin user created automatically')
  }
}
ensureAdmin()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app        = express()
const httpServer = createServer(app)
const PORT       = process.env.PORT || 5000

app.set('trust proxy', 1)

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
]

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  if (origin.endsWith('.railway.app')) return true
  if (process.env.NODE_ENV !== 'production' && origin.endsWith('.ngrok-free.app')) return true
  return false
}

app.use(cors({
  origin: (origin, cb) => isAllowedOrigin(origin) ? cb(null, true) : cb(new Error(`CORS: origin ${origin} not allowed`)),
  credentials: true,
}))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth',          authRouter)
app.use('/api/users',         usersRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/suggestions',   suggestionsRouter)
app.use('/api/knowledge',     knowledgeRouter)
app.use('/api/spotlights',    spotlightsRouter)
app.use('/api/upload',        uploadRouter)
app.use('/api/ai',            aiRouter)
app.use('/api/news',          newsRouter)
app.use('/api/leaderboard',   leaderboardRouter)
app.use('/api/startups',      startupsRouter)
app.use('/api/typing',        typingRouter)
app.use('/api/profile',      profileRouter)
app.use('/api/birthdays',    birthdaysRouter)
app.use('/api/shoutouts',    shoutoutsRouter)

app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => isAllowedOrigin(origin) ? cb(null, true) : cb(new Error(`CORS: origin ${origin} not allowed`)),
    credentials: true,
  },
})

// Expose io so REST routes can emit events
app.set('io', io)

// Auth middleware for socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Authentication required'))
  try {
    socket.data.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

// Track online users: userId → { name, department, count }
const onlineUsers = new Map()

function broadcastOnline() {
  const list = [...onlineUsers.entries()].map(([id, { name, department }]) => ({ id, name, department }))
  io.emit('online_count', onlineUsers.size)
  io.emit('online_users', list)
}

io.on('connection', async (socket) => {
  const { id: userId, name, department } = socket.data.user

  const existing = onlineUsers.get(userId)
  if (existing) {
    existing.count++
  } else {
    onlineUsers.set(userId, { name, department, count: 1 })
  }
  broadcastOnline()

  // Send last 100 chat messages to this client
  try {
    const messages = await prisma.chatMessage.findMany({
      take: 100,
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true, department: true } } },
    })
    socket.emit('history', messages)
  } catch (err) {
    console.error('Chat history error:', err.message)
  }

  socket.on('send_message', async ({ content }) => {
    const text = content?.trim()
    if (!text || text.length > 2000) return
    try {
      const msg = await prisma.chatMessage.create({
        data: { content: text, userId },
        include: { user: { select: { id: true, name: true, department: true } } },
      })
      io.emit('new_message', msg)
    } catch (err) {
      console.error('Chat send error:', err.message)
    }
  })

  socket.on('disconnect', () => {
    const entry = onlineUsers.get(userId)
    if (entry) {
      entry.count--
      if (entry.count <= 0) onlineUsers.delete(userId)
    }
    broadcastOnline()
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

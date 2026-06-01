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
import gamificationRouter  from './routes/gamification.js'
import tournamentsRouter   from './routes/tournaments.js'
import chatRouter          from './routes/chat.js'
import rewardsRouter       from './routes/rewards.js'
import errorHandler        from './middleware/errorHandler.js'

dotenv.config()

const prisma = new PrismaClient()

const BADGE_DEFINITIONS = [
  { key: 'first_login',      name: 'First Login',       description: 'Logged into the portal for the first time',    icon: '👋', xpReward: 50  },
  { key: 'wpm_100',          name: 'Speed Demon',        description: 'Reached 100 WPM in AG Type',                   icon: '⚡', xpReward: 200 },
  { key: 'wpm_150',          name: 'Blazing Fast',       description: 'Reached 150 WPM in AG Type',                   icon: '🔥', xpReward: 300 },
  { key: 'login_streak_7',   name: 'Week Warrior',       description: 'Logged in 7 days in a row',                    icon: '🗓', xpReward: 150 },
  { key: 'shoutout_5',       name: 'Team Spirit',        description: 'Sent 5 shoutouts to teammates',                icon: '📣', xpReward: 100 },
  { key: 'birthday_wisher',  name: 'Birthday Buddy',     description: "Left a message on someone's birthday wall",    icon: '🎂', xpReward: 50  },
  { key: 'typing_10',        name: 'Dedicated Typer',    description: 'Completed 10 typing tests',                    icon: '⌨',  xpReward: 75  },
]

async function ensureBadges() {
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where:  { key: badge.key },
      update: { name: badge.name, description: badge.description, icon: badge.icon, xpReward: badge.xpReward },
      create: badge,
    })
  }
}
ensureBadges().catch(err => console.error('Badge seed error:', err.message))

async function seedRewards() {
  const count = await prisma.rewardItem.count()
  if (count > 0) return
  await prisma.rewardItem.createMany({
    data: [
      // Merch tier
      { name: 'ALGO Group Hoodie',       description: 'Premium ALGO Group branded hoodie with embroidered logo',        imageUrl: '/hoodie.jfif',       tier: 'merch', cost: 500,   stock: 20 },
      { name: 'ALGO Group White Hoodie', description: 'Clean white hoodie with embroidered ALGO Group logo',            imageUrl: '/white-hoodie.jfif', tier: 'merch', cost: 500,   stock: 20 },
      { name: 'ALGO Group T-Shirt',      description: 'Classic ALGO Group tee with screen-printed logo',                imageUrl: '/t-shirt.jfif',      tier: 'merch', cost: 250,   stock: 30 },
      { name: 'ALGO Group Cap',          description: 'Snapback cap with embroidered ALGO Group logo',                  imageUrl: '/cap.jfif',          tier: 'merch', cost: 150,   stock: 25 },
      { name: 'Coffee Mug',              description: 'Ceramic mug with ALGO Group logo — perfect for mornings',        imageUrl: null,                 tier: 'merch', cost: 100,   stock: 40 },
      { name: 'Notebook & Pen Set',      description: 'Premium notebook + pen set with ALGO Group branding',            imageUrl: null,                 tier: 'merch', cost: 75,    stock: 35 },
      // Mid tier
      { name: 'Wireless Earbuds',        description: 'High-fidelity wireless earbuds with active noise cancellation',  imageUrl: null,                 tier: 'mid',   cost: 1500,  stock: 5  },
      { name: 'Mechanical Keyboard',     description: 'Premium mechanical keyboard for the ultimate typing experience',  imageUrl: null,                 tier: 'mid',   cost: 2000,  stock: 3  },
      { name: 'Premium Backpack',        description: 'Durable multi-compartment backpack with padded laptop sleeve',   imageUrl: null,                 tier: 'mid',   cost: 1200,  stock: 5  },
      // High tier
      { name: 'Laptop',                  description: 'High-performance laptop — specs by availability at time of redemption', imageUrl: null,          tier: 'high',  cost: 10000, stock: 1  },
      { name: 'iPhone 16 Pro',           description: 'Apple iPhone 16 Pro — color of your choice',                    imageUrl: null,                 tier: 'high',  cost: 8000,  stock: 1  },
      { name: 'Cash Bonus ($100)',       description: '$100 cash bonus equivalent awarded via company payment',         imageUrl: null,                 tier: 'high',  cost: 5000,  stock: -1 },
    ],
  })
  console.log('Reward store seeded')
}
seedRewards().catch(err => console.error('Reward seed error:', err.message))

// Fix any wrong imageUrls from initial bad seed
async function fixRewardImages() {
  const fixes = [
    { name: 'ALGO Group Hoodie',       imageUrl: '/hoodie.jfif'       },
    { name: 'ALGO Group T-Shirt',      imageUrl: '/t-shirt.jfif'      },
    { name: 'ALGO Group Cap',          imageUrl: '/cap.jfif'          },
    { name: 'Wireless Earbuds',        imageUrl: null                  },
    { name: 'Mechanical Keyboard',     imageUrl: null                  },
    { name: 'Premium Backpack',        imageUrl: null                  },
  ]
  for (const { name, imageUrl } of fixes) {
    await prisma.rewardItem.updateMany({ where: { name }, data: { imageUrl } })
  }
  // Add white hoodie if missing
  const whiteExists = await prisma.rewardItem.findFirst({ where: { name: 'ALGO Group White Hoodie' } })
  if (!whiteExists) {
    await prisma.rewardItem.create({
      data: {
        name: 'ALGO Group White Hoodie',
        description: 'Clean white hoodie with embroidered ALGO Group logo',
        imageUrl: '/white-hoodie.jfif',
        tier: 'merch',
        cost: 500,
        stock: 20,
      }
    })
  } else {
    await prisma.rewardItem.updateMany({ where: { name: 'ALGO Group White Hoodie' }, data: { imageUrl: '/white-hoodie.jfif' } })
  }
}
fixRewardImages().catch(err => console.error('Reward image fix error:', err.message))

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

app.set('trust proxy', true)

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

// Loose global limit — internal portal, real IPs resolved via full proxy chain
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 5000, standardHeaders: true, legacyHeaders: false }))

// Tight limit for auth endpoints only (brute-force protection)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false })

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth',          authLimiter, authRouter)
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
app.use('/api/profile',       profileRouter)
app.use('/api/birthdays',     birthdaysRouter)
app.use('/api/shoutouts',     shoutoutsRouter)
app.use('/api/gamification',  gamificationRouter)
app.use('/api/tournaments',   tournamentsRouter)
app.use('/api/chat',          chatRouter)
app.use('/api/rewards',       rewardsRouter)

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
      take: 200,
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

      // Keep at most 200 messages — delete oldest if over limit
      const total = await prisma.chatMessage.count()
      if (total > 200) {
        const oldest = await prisma.chatMessage.findMany({
          orderBy: { createdAt: 'asc' },
          take: total - 200,
          select: { id: true },
        })
        await prisma.chatMessage.deleteMany({
          where: { id: { in: oldest.map(m => m.id) } },
        })
      }
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

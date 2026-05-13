import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import announcementsRouter from './routes/announcements.js'
import suggestionsRouter   from './routes/suggestions.js'
import knowledgeRouter     from './routes/knowledge.js'
import authRouter          from './routes/auth.js'
import usersRouter         from './routes/users.js'
import spotlightsRouter    from './routes/spotlights.js'
import uploadRouter        from './routes/upload.js'
import errorHandler        from './middleware/errorHandler.js'

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

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 5000

// Required when running behind Railway/Vercel/nginx proxy
app.set('trust proxy', 1)

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
]
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    if (origin.endsWith('.railway.app')) return cb(null, true)
    if (process.env.NODE_ENV !== 'production' && origin.endsWith('.ngrok-free.app')) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth',          authRouter)
app.use('/api/users',         usersRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/suggestions',   suggestionsRouter)
app.use('/api/knowledge',     knowledgeRouter)
app.use('/api/spotlights',    spotlightsRouter)
app.use('/api/upload',        uploadRouter)

app.use(errorHandler)

// Serve React app in production (must be after all API routes)
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

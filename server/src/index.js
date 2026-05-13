import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import announcementsRouter from './routes/announcements.js'
import suggestionsRouter   from './routes/suggestions.js'
import knowledgeRouter     from './routes/knowledge.js'
import authRouter          from './routes/auth.js'
import usersRouter         from './routes/users.js'
import spotlightsRouter    from './routes/spotlights.js'
import uploadRouter        from './routes/upload.js'
import errorHandler        from './middleware/errorHandler.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
]
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, same-origin Vite proxy)
    if (!origin) return cb(null, true)
    // Always allow configured origin
    if (allowedOrigins.includes(origin)) return cb(null, true)
    // Allow any Vercel deployment (preview + production)
    if (origin.endsWith('.vercel.app')) return cb(null, true)
    // Allow any ngrok tunnel in development
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

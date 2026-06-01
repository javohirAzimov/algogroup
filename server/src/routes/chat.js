import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.delete('/messages', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    await prisma.chatMessage.deleteMany()
    req.app.get('io').emit('history', [])
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router

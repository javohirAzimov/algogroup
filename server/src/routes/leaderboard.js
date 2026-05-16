import { Router } from 'express'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

const KPI_URL =
  'https://kpi-dashboard-production-3259.up.railway.app/api/public/leaderboard' +
  '?api_key=0dff62dac4c138e0dd251d84991b3e1f8bc6be8b0069d57fa5050fcdc4cab60'

router.get('/', verifyToken, async (_req, res) => {
  try {
    const upstream = await fetch(KPI_URL)
    const data = await upstream.json()
    res.json(data)
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach KPI service' })
  }
})

export default router

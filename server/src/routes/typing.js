import { Router } from 'express'
import { submitScore, getLeaderboard, getMyStats } from '../controllers/typingController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/scores',      verifyToken, submitScore)
router.get('/leaderboard',  verifyToken, getLeaderboard)
router.get('/me',           verifyToken, getMyStats)

export default router

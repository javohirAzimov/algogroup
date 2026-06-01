import { Router } from 'express'
import { submitScore, getLeaderboard, getMyStats, clearScores } from '../controllers/typingController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.post('/scores',      verifyToken, submitScore)
router.get('/leaderboard',  verifyToken, getLeaderboard)
router.get('/me',           verifyToken, getMyStats)
router.delete('/scores',    verifyToken, requireAdmin, clearScores)

export default router

import { Router } from 'express'
import { getMyGamification } from '../controllers/gamificationController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/me', getMyGamification)

export default router

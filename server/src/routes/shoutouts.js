import { Router } from 'express'
import { getShoutouts, postShoutout } from '../controllers/shoutoutController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/',  getShoutouts)
router.post('/', postShoutout)

export default router

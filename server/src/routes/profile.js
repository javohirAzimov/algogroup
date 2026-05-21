import { Router } from 'express'
import { updateProfile, getUpcomingBirthdays } from '../controllers/profileController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)

router.patch('/me',                updateProfile)
router.get('/upcoming-birthdays',  getUpcomingBirthdays)

export default router

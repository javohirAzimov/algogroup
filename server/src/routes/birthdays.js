import { Router } from 'express'
import { getBirthdayMessages, postBirthdayMessage } from '../controllers/birthdayController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/:userId/messages',  getBirthdayMessages)
router.post('/:userId/messages', postBirthdayMessage)

export default router

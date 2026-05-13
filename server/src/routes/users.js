import { Router } from 'express'
import { getAll, getById, toggleActive, promoteToAdmin, demoteToUser } from '../controllers/usersController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.use(verifyToken, requireAdmin)

router.get('/',                      getAll)
router.get('/:id',                   getById)
router.patch('/:id/toggle-active',   toggleActive)
router.patch('/:id/promote',         promoteToAdmin)
router.patch('/:id/demote',          demoteToUser)

export default router

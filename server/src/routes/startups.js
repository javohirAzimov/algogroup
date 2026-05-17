import { Router } from 'express'
import { getAll, create, update, remove } from '../controllers/startupsController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/',      verifyToken, getAll)
router.post('/',     verifyToken, requireAdmin, create)
router.put('/:id',   verifyToken, requireAdmin, update)
router.delete('/:id',verifyToken, requireAdmin, remove)

export default router

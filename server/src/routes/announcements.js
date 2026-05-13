import { Router } from 'express'
import { getAll, getById, create, update, remove } from '../controllers/announcementsController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/',     getAll)
router.get('/:id',  getById)

router.post('/',    verifyToken, requireAdmin, create)
router.put('/:id',  verifyToken, requireAdmin, update)
router.delete('/:id', verifyToken, requireAdmin, remove)

export default router

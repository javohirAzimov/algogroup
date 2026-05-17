import { Router } from 'express'
import { getStats, create } from '../controllers/suggestionsController.js'

const router = Router()
router.get('/stats', getStats)
router.post('/', create)
export default router

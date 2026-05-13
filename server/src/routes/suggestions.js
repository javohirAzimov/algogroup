// Suggestion routes — POST /api/suggestions
import { Router } from 'express'
import { create } from '../controllers/suggestionsController.js'

const router = Router()
router.post('/', create)
export default router

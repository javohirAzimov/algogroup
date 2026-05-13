// Knowledge routes — GET /api/knowledge
import { Router } from 'express'
import { getAll } from '../controllers/knowledgeController.js'

const router = Router()
router.get('/', getAll)
export default router

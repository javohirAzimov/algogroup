import { Router } from 'express'
import { getTournaments, joinTournament, createTournament, deleteTournament } from '../controllers/tournamentsController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)

router.get('/',          getTournaments)
router.post('/:id/join', joinTournament)
router.post('/',         requireAdmin, createTournament)
router.delete('/:id',    requireAdmin, deleteTournament)

export default router

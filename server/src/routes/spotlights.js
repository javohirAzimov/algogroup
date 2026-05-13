import { Router } from 'express'
import { getCurrent, upsert, getSiteMedia, updateSiteMedia } from '../controllers/spotlightsController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/',           getCurrent)
router.post('/',          verifyToken, requireAdmin, upsert)
router.get('/media',      getSiteMedia)
router.post('/media',     verifyToken, requireAdmin, updateSiteMedia)

export default router

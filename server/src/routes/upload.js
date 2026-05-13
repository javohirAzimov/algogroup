import { Router } from 'express'
import { upload, uploadSingle } from '../controllers/uploadController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.post('/', verifyToken, requireAdmin, upload.single('file'), uploadSingle)

export default router

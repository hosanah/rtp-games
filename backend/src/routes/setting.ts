import { Router } from 'express'
import { getTheme, updateTheme } from '../controllers/settingController'
import { authenticateToken } from '../middleware/auth'
import { requireAdmin } from '../middleware/admin'

const router = Router()

router.get('/theme', authenticateToken, requireAdmin, getTheme)
router.put('/theme', authenticateToken, requireAdmin, updateTheme)

export default router

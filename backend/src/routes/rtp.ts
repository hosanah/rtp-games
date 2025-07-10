import { Router } from 'express';
import { 
  addRtpRecord, 
  getUserRtpHistory, 
  getUserRtpStats,
  getGameRtpHistory,
  deleteRtpRecord
} from '../controllers/rtpController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.get('/games/:gameId/history', getGameRtpHistory);

// Rotas protegidas
router.post('/', authenticateToken, addRtpRecord);
router.get('/history', authenticateToken, getUserRtpHistory);
router.get('/stats', authenticateToken, getUserRtpStats);
router.delete('/:id', authenticateToken, deleteRtpRecord);

export default router;


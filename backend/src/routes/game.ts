import { Router } from 'express';
import { listGames, getHouseGames } from '../controllers/gameController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, listGames);
router.get('/house/:id', authenticateToken, getHouseGames);

export default router;

import { Router } from 'express';
import { listGames } from '../controllers/gameController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, listGames);

export default router;

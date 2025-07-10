import { Router } from 'express';
import { 
  getAllGames, 
  getGameById, 
  getGameCategories, 
  getGameProviders,
  getGameStats
} from '../controllers/gameController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Rotas públicas (com autenticação opcional)
router.get('/', optionalAuth, getAllGames);
router.get('/categories', getGameCategories);
router.get('/providers', getGameProviders);
router.get('/stats', getGameStats);
router.get('/:id', optionalAuth, getGameById);

export default router;


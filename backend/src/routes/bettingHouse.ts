import { Router } from 'express';
import {
  createBettingHouse,
  listBettingHouses,
  getBettingHouse,
  updateBettingHouse,
  deleteBettingHouse
} from '../controllers/bettingHouseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createBettingHouse);
router.get('/', authenticateToken, listBettingHouses);
router.get('/:id', authenticateToken, getBettingHouse);
router.put('/:id', authenticateToken, updateBettingHouse);
router.delete('/:id', authenticateToken, deleteBettingHouse);

export default router;

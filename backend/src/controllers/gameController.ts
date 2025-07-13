import { Request, Response } from 'express';
import { Game } from '../models/game';
import { BettingHouse } from '../models/bettingHouse';
import { fetchHouseGames } from '../utils/houseGameFetcher';

export const listGames = async (_req: Request, res: Response): Promise<void> => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (err) {
    console.error('Erro ao listar jogos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getHouseGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const houseId = parseInt(req.params.id, 10);
    const house = await BettingHouse.findByPk(houseId);
    if (!house) {
      res.status(404).json({ error: 'Casa de aposta não encontrada' });
      return;
    }

    const games = await fetchHouseGames(house);
    res.json(games);
  } catch (err) {
    console.error('Erro ao obter jogos da casa:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

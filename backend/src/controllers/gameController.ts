import { Request, Response } from 'express';
import { Game } from '../models/game';

export const listGames = async (_req: Request, res: Response): Promise<void> => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (err) {
    console.error('Erro ao listar jogos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

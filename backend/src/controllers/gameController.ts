import { Request, Response } from 'express';
import { Game } from '../models/game';
import { BettingHouse } from '../models/bettingHouse';
import axios from 'axios';
import { decodeHouseGames, DecodedHouseGame } from '../utils/houseGameDecoder';

interface CacheEntry {
  timestamp: number;
  data: DecodedHouseGame[];
}

const houseCache = new Map<number, CacheEntry>();

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

    const cached = houseCache.get(house.id);
    const intervalMs =
      house.updateIntervalUnit === 'minutes'
        ? house.updateInterval * 60000
        : house.updateInterval * 1000;
    const now = Date.now();

    if (!cached || now - cached.timestamp > intervalMs) {
      try {
        const response = await axios.post<ArrayBuffer>(
          house.apiUrl,
          Buffer.from([8, 1, 16, 2]),
          {
            responseType: 'arraybuffer',
            timeout: Number(process.env.RTP_API_TIMEOUT_MS || 10000),
            family: 4,
            headers: {
              accept: 'application/x-protobuf',
              'content-type': 'application/x-protobuf',
              'x-language-iso': 'pt-BR',
              origin: 'https://cbet.gg',
              referer: 'https://cbet.gg/pt-BR/casinos/casino/lobby',
            },
          },
        );
        const games = decodeHouseGames(response.data);
        houseCache.set(house.id, { timestamp: now, data: games });
        res.json(games);
      } catch (err) {
        console.error('Erro ao consultar API da casa', err);
        res.status(500).json({ error: 'Falha ao consultar API externa' });
      }
    } else {
      res.json(cached.data);
    }
  } catch (err) {
    console.error('Erro ao obter jogos da casa:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

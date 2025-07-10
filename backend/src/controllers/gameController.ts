import { Request, Response } from 'express';
import { Op, fn, col } from 'sequelize';
import { AuthenticatedRequest } from '../types/auth';
import { Game } from '../models/game';
import { RtpHistory } from '../models/rtpHistory';
import { User } from '../models/user';

/**
 * Listar todos os jogos
 */
export const getAllGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      category, 
      provider, 
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (provider) {
      where.provider = provider;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { provider: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const order = [[sortBy as string, sortOrder as string]];

    const { rows: games, count: total } = await Game.findAndCountAll({
      where,
      order,
      offset: skip,
      limit: limitNum,
      attributes: {
        include: [[fn('COUNT', col('rtpHistories.id')), 'rtpHistoryCount']]
      },
      include: [{ model: RtpHistory, attributes: [] }],
      group: ['Game.id']
    });

    res.json({
      games,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter jogo por ID
 */
export const getGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
      res.status(400).json({ 
        error: 'ID do jogo inválido',
        code: 'INVALID_GAME_ID'
      });
      return;
    }

    const game = await Game.findByPk(gameId, {
      include: [{
        model: RtpHistory,
        limit: 10,
        order: [['timestamp', 'DESC']],
        include: [{ model: User, attributes: ['name'] }]
      }]
    });

    if (!game) {
      res.status(404).json({ 
        error: 'Jogo não encontrado',
        code: 'GAME_NOT_FOUND'
      });
      return;
    }

    res.json(game);
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter categorias de jogos
 */
export const getGameCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Game.findAll({
      where: { isActive: true },
      attributes: ['category'],
      group: ['category']
    });

    const categoryList = categories.map(c => (c as any).category);

    res.json(categoryList);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter provedores de jogos
 */
export const getGameProviders = async (req: Request, res: Response): Promise<void> => {
  try {
    const providers = await Game.findAll({
      where: { isActive: true },
      attributes: ['provider'],
      group: ['provider']
    });

    const providerList = providers.map(p => (p as any).provider);

    res.json(providerList);
  } catch (error) {
    console.error('Erro ao buscar provedores:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter estatísticas dos jogos
 */
export const getGameStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalGames,
      totalCategories,
      totalProviders,
      avgRtpResult,
      topGames
    ] = await Promise.all([
      Game.count({ where: { isActive: true } }),
      Game.findAll({
        where: { isActive: true },
        attributes: ['category'],
        group: ['category']
      }),
      Game.findAll({
        where: { isActive: true },
        attributes: ['provider'],
        group: ['provider']
      }),
      Game.findAll({
        where: { isActive: true },
        attributes: [[fn('AVG', col('currentRtp')), 'avgRtp']]
      }),
      Game.findAll({
        where: { isActive: true },
        order: [['currentRtp', 'DESC']],
        limit: 5,
        attributes: [
          'id',
          'name',
          'provider',
          'currentRtp',
          [fn('COUNT', col('rtpHistories.id')), 'rtpHistoryCount']
        ],
        include: [{ model: RtpHistory, attributes: [] }],
        group: ['Game.id']
      })
    ]);

    const averageRtp = parseFloat(((avgRtpResult[0] as any)?.get('avgRtp')) || '0');

      res.json({
        totalGames,
        totalCategories: totalCategories.length,
        totalProviders: totalProviders.length,
        averageRtp,
        topRtpGames: topGames
      });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};


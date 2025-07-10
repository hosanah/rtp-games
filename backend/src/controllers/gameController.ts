import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

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
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { provider: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Construir ordenação
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          _count: {
            select: { rtpHistory: true }
          }
        }
      }),
      prisma.game.count({ where })
    ]);

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

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        rtpHistory: {
          orderBy: { timestamp: 'desc' },
          take: 10,
          include: {
            user: {
              select: { name: true }
            }
          }
        },
        _count: {
          select: { rtpHistory: true }
        }
      }
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
    const categories = await prisma.game.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories.map(c => c.category);

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
    const providers = await prisma.game.findMany({
      where: { isActive: true },
      select: { provider: true },
      distinct: ['provider']
    });

    const providerList = providers.map(p => p.provider);

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
      avgRtp,
      topGames
    ] = await Promise.all([
      prisma.game.count({ where: { isActive: true } }),
      prisma.game.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ['category']
      }),
      prisma.game.findMany({
        where: { isActive: true },
        select: { provider: true },
        distinct: ['provider']
      }),
      prisma.game.aggregate({
        where: { isActive: true },
        _avg: { currentRtp: true }
      }),
      prisma.game.findMany({
        where: { isActive: true },
        orderBy: { currentRtp: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          provider: true,
          currentRtp: true,
          _count: {
            select: { rtpHistory: true }
          }
        }
      })
    ]);

    res.json({
      totalGames,
      totalCategories: totalCategories.length,
      totalProviders: totalProviders.length,
      averageRtp: avgRtp._avg.currentRtp || 0,
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


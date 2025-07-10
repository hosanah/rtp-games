import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

/**
 * Adicionar registro de RTP
 */
export const addRtpRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const { gameId, rtpValue, notes } = req.body;

    // Validações
    if (!gameId || rtpValue === undefined) {
      res.status(400).json({ 
        error: 'ID do jogo e valor RTP são obrigatórios',
        code: 'MISSING_FIELDS'
      });
      return;
    }

    if (typeof rtpValue !== 'number' || rtpValue < 0 || rtpValue > 100) {
      res.status(400).json({ 
        error: 'Valor RTP deve ser um número entre 0 e 100',
        code: 'INVALID_RTP_VALUE'
      });
      return;
    }

    // Verificar se o jogo existe
    const game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) }
    });

    if (!game) {
      res.status(404).json({ 
        error: 'Jogo não encontrado',
        code: 'GAME_NOT_FOUND'
      });
      return;
    }

    // Criar registro RTP
    const rtpRecord = await prisma.rtpHistory.create({
      data: {
        userId: req.user.userId,
        gameId: parseInt(gameId),
        rtpValue: parseFloat(rtpValue.toFixed(2)),
        notes: notes || null
      },
      include: {
        game: {
          select: {
            name: true,
            provider: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(201).json(rtpRecord);
  } catch (error) {
    console.error('Erro ao adicionar registro RTP:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter histórico RTP do usuário
 */
export const getUserRtpHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const { 
      page = '1', 
      limit = '10',
      gameId,
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {
      userId: req.user.userId
    };

    if (gameId) {
      where.gameId = parseInt(gameId as string);
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate as string);
      }
    }

    const [records, total] = await Promise.all([
      prisma.rtpHistory.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limitNum,
        include: {
          game: {
            select: {
              name: true,
              provider: true,
              category: true
            }
          }
        }
      }),
      prisma.rtpHistory.count({ where })
    ]);

    res.json({
      records,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico RTP:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter estatísticas RTP do usuário
 */
export const getUserRtpStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const [
      totalRecords,
      avgRtp,
      bestRtp,
      worstRtp,
      recentRecords,
      gameStats
    ] = await Promise.all([
      prisma.rtpHistory.count({
        where: { userId: req.user.userId }
      }),
      prisma.rtpHistory.aggregate({
        where: { userId: req.user.userId },
        _avg: { rtpValue: true }
      }),
      prisma.rtpHistory.findFirst({
        where: { userId: req.user.userId },
        orderBy: { rtpValue: 'desc' },
        include: {
          game: {
            select: { name: true, provider: true }
          }
        }
      }),
      prisma.rtpHistory.findFirst({
        where: { userId: req.user.userId },
        orderBy: { rtpValue: 'asc' },
        include: {
          game: {
            select: { name: true, provider: true }
          }
        }
      }),
      prisma.rtpHistory.findMany({
        where: { userId: req.user.userId },
        orderBy: { timestamp: 'desc' },
        take: 5,
        include: {
          game: {
            select: { name: true, provider: true }
          }
        }
      }),
      prisma.rtpHistory.groupBy({
        by: ['gameId'],
        where: { userId: req.user.userId },
        _count: { gameId: true },
        _avg: { rtpValue: true },
        orderBy: { _count: { gameId: 'desc' } },
        take: 5
      })
    ]);

    // Buscar informações dos jogos mais jogados
    const gameIds = gameStats.map(stat => stat.gameId);
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true, provider: true }
    });

    const topGames = gameStats.map(stat => {
      const game = games.find(g => g.id === stat.gameId);
      return {
        game,
        recordCount: stat._count.gameId,
        averageRtp: stat._avg.rtpValue
      };
    });

    res.json({
      totalRecords,
      averageRtp: avgRtp._avg.rtpValue || 0,
      bestRtp,
      worstRtp,
      recentRecords,
      topGames
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas RTP:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter histórico RTP de um jogo específico
 */
export const getGameRtpHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { 
      page = '1', 
      limit = '10',
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    if (isNaN(parseInt(gameId))) {
      res.status(400).json({ 
        error: 'ID do jogo inválido',
        code: 'INVALID_GAME_ID'
      });
      return;
    }

    // Verificar se o jogo existe
    const game = await prisma.game.findUnique({
      where: { id: parseInt(gameId) }
    });

    if (!game) {
      res.status(404).json({ 
        error: 'Jogo não encontrado',
        code: 'GAME_NOT_FOUND'
      });
      return;
    }

    // Construir filtros
    const where: any = {
      gameId: parseInt(gameId)
    };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate as string);
      }
    }

    const [records, total, stats] = await Promise.all([
      prisma.rtpHistory.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limitNum,
        include: {
          user: {
            select: { name: true }
          }
        }
      }),
      prisma.rtpHistory.count({ where }),
      prisma.rtpHistory.aggregate({
        where,
        _avg: { rtpValue: true },
        _min: { rtpValue: true },
        _max: { rtpValue: true },
        _count: { rtpValue: true }
      })
    ]);

    res.json({
      game,
      records,
      stats: {
        totalRecords: stats._count.rtpValue,
        averageRtp: stats._avg.rtpValue || 0,
        minRtp: stats._min.rtpValue || 0,
        maxRtp: stats._max.rtpValue || 0
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico RTP do jogo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Deletar registro RTP
 */
export const deleteRtpRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const { id } = req.params;
    const recordId = parseInt(id);

    if (isNaN(recordId)) {
      res.status(400).json({ 
        error: 'ID do registro inválido',
        code: 'INVALID_RECORD_ID'
      });
      return;
    }

    // Verificar se o registro existe e pertence ao usuário
    const record = await prisma.rtpHistory.findUnique({
      where: { id: recordId }
    });

    if (!record) {
      res.status(404).json({ 
        error: 'Registro não encontrado',
        code: 'RECORD_NOT_FOUND'
      });
      return;
    }

    if (record.userId !== req.user.userId) {
      res.status(403).json({ 
        error: 'Não autorizado a deletar este registro',
        code: 'UNAUTHORIZED'
      });
      return;
    }

    // Deletar registro
    await prisma.rtpHistory.delete({
      where: { id: recordId }
    });

    res.json({ 
      message: 'Registro deletado com sucesso',
      id: recordId
    });
  } catch (error) {
    console.error('Erro ao deletar registro RTP:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};


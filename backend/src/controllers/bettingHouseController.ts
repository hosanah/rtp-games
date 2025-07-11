import { Request, Response } from 'express';
import { BettingHouse } from '../models/bettingHouse';

export const createBettingHouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, apiName, apiUrl, updateInterval, currency } = req.body;

    if (!name || !apiName || !apiUrl || !updateInterval || !currency) {
      res.status(400).json({
        error: 'Todos os campos são obrigatórios',
        code: 'MISSING_FIELDS'
      });
      return;
    }

    const house = await BettingHouse.create({
      name,
      apiName,
      apiUrl,
      updateInterval,
      currency
    });

    res.status(201).json(house);
  } catch (error) {
    console.error('Erro ao criar casa de aposta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const listBettingHouses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const houses = await BettingHouse.findAll();
    res.json(houses);
  } catch (error) {
    console.error('Erro ao listar casas de aposta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getBettingHouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const house = await BettingHouse.findByPk(id);

    if (!house) {
      res.status(404).json({
        error: 'Casa de aposta não encontrada',
        code: 'NOT_FOUND'
      });
      return;
    }

    res.json(house);
  } catch (error) {
    console.error('Erro ao obter casa de aposta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const updateBettingHouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const house = await BettingHouse.findByPk(id);

    if (!house) {
      res.status(404).json({
        error: 'Casa de aposta não encontrada',
        code: 'NOT_FOUND'
      });
      return;
    }

    const { name, apiName, apiUrl, updateInterval, currency } = req.body;
    await house.update({ name, apiName, apiUrl, updateInterval, currency });
    res.json(house);
  } catch (error) {
    console.error('Erro ao atualizar casa de aposta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const deleteBettingHouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const house = await BettingHouse.findByPk(id);

    if (!house) {
      res.status(404).json({
        error: 'Casa de aposta não encontrada',
        code: 'NOT_FOUND'
      });
      return;
    }

    await house.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar casa de aposta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

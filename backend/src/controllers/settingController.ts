import { Request, Response } from 'express'
import { Setting } from '../models/setting'

export const getTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const setting = await Setting.findByPk(1)
    res.json({ css: setting?.css || '' })
  } catch (error) {
    console.error('Erro ao obter tema:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export const updateTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { css } = req.body
    const [setting] = await Setting.findOrCreate({ where: { id: 1 } })
    setting.css = css || ''
    await setting.save()
    res.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar tema:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

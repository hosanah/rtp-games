import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types/auth'

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado', code: 'FORBIDDEN' })
    return
  }
  next()
}

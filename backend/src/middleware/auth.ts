import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';

/**
 * Middleware para verificar autenticação JWT
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({ 
        error: 'Token de acesso requerido',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          error: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        });
        return;
      }
      
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ 
          error: 'Token inválido',
          code: 'INVALID_TOKEN'
        });
        return;
      }
    }

    res.status(401).json({ 
      error: 'Falha na autenticação',
      code: 'AUTH_FAILED'
    });
  }
};

/**
 * Middleware opcional para verificar autenticação (não bloqueia se não houver token)
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
};


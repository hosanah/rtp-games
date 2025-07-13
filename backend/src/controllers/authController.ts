import { Request, Response } from 'express';
import { User } from '../models/user';
import { RegisterRequest, LoginRequest, AuthResponse, AuthenticatedRequest, ChangePasswordRequest } from '../types/auth';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  isValidEmail, 
  isValidPassword 
} from '../utils/auth';


/**
 * Registrar novo usuário
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: RegisterRequest = req.body;

    // Validações
    if (!name || !email || !password) {
      res.status(400).json({ 
        error: 'Nome, email e senha são obrigatórios',
        code: 'MISSING_FIELDS'
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ 
        error: 'Email inválido',
        code: 'INVALID_EMAIL'
      });
      return;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({ 
        error: passwordValidation.message,
        code: 'INVALID_PASSWORD'
      });
      return;
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(409).json({ 
        error: 'Email já está em uso',
        code: 'EMAIL_EXISTS'
      });
      return;
    }

    // Criar usuário
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Login de usuário
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validações
    if (!email || !password) {
      res.status(400).json({ 
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_FIELDS'
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ 
        error: 'Email inválido',
        code: 'INVALID_EMAIL'
      });
      return;
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ 
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ 
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };

    res.json(response);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Obter perfil do usuário autenticado
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) {
      res.status(404).json({ 
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Verificar se token é válido
 */
export const verifyTokenEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        valid: false,
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    res.json({ 
      valid: true,
      user: {
        id: req.user.userId,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(500).json({
      valid: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Alterar senha do usuário autenticado
 */
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

  const { currentPassword, newPassword } = req.body as Partial<ChangePasswordRequest>;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias',
        code: 'MISSING_FIELDS'
      });
      return;
    }

    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: passwordValidation.message,
        code: 'INVALID_PASSWORD'
      });
      return;
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      res.status(404).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Senha atual incorreta',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};


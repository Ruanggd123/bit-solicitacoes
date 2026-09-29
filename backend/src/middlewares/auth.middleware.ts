import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../models/types';

// Extensão do tipo Request do Express para conter os dados da sessão do usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_bit_solucoes_2026_dev_env';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Token de autenticação não fornecido. Acesso restrito a usuários autenticados.'
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Formato do token inválido. O cabeçalho deve ser no padrão "Bearer <token>".'
    });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Sessão expirada ou token de autenticação inválido. Faça login novamente.'
    });
    return;
  }
};

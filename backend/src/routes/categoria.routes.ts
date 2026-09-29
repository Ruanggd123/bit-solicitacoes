import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const categorias = db.prepare('SELECT id, nome, descricao FROM categorias WHERE ativo = 1 ORDER BY nome ASC').all();
    res.status(200).json({
      sucesso: true,
      dados: categorias
    });
  } catch (error) {
    next(error);
  }
});

export default router;

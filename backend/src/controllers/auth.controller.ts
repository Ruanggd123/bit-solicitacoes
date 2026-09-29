import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private service: AuthService;

  constructor(service?: AuthService) {
    this.service = service || new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(req.body);
      res.status(200).json({
        sucesso: true,
        mensagem: 'Autenticação realizada com sucesso.',
        dados: result
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const usuario = this.service.getProfile(userId);
      res.status(200).json({
        sucesso: true,
        dados: usuario
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        sucesso: true,
        mensagem: 'Sessão encerrada com sucesso.'
      });
    } catch (error) {
      next(error);
    }
  };
}

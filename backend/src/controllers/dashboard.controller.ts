import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private service: DashboardService;

  constructor(service?: DashboardService) {
    this.service = service || new DashboardService();
  }

  obterMetricas = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metricas = this.service.obterMetricas();
      res.status(200).json({
        sucesso: true,
        dados: metricas
      });
    } catch (error) {
      next(error);
    }
  };
}

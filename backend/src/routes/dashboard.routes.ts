import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new DashboardController();

router.use(authMiddleware);
router.get('/metricas', controller.obterMetricas);

export default router;

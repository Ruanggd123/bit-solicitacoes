import { Router } from 'express';
import authRoutes from './auth.routes';
import solicitacaoRoutes from './solicitacao.routes';
import dashboardRoutes from './dashboard.routes';
import categoriaRoutes from './categoria.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/solicitacoes', solicitacaoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categorias', categoriaRoutes);

// Endpoint de verificação de integridade da API (Health Check)
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    aplicacao: 'Portal de Solicitações Internas - bit Soluções',
    timestamp: new Date().toISOString()
  });
});

export default router;

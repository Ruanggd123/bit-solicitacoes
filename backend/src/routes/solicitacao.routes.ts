import { Router } from 'express';
import { SolicitacaoController } from '../controllers/solicitacao.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody, validateQuery } from '../middlewares/validate.middleware';
import {
  createSolicitacaoSchema,
  updateSolicitacaoSchema,
  updateStatusSchema,
  filterSolicitacaoSchema
} from '../validators/solicitacao.schema';

const router = Router();
const controller = new SolicitacaoController();

// Todas as rotas de solicitações exigem autenticação prévia
router.use(authMiddleware);

router.post('/', validateBody(createSolicitacaoSchema), controller.criar);
router.get('/', validateQuery(filterSolicitacaoSchema), controller.listar);
router.get('/:id', controller.obterPorId);
router.put('/:id', validateBody(updateSolicitacaoSchema), controller.editar);
router.delete('/:id', controller.excluir);
router.patch('/:id/status', validateBody(updateStatusSchema), controller.alterarStatus);

export default router;

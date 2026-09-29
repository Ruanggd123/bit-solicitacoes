import { Request, Response, NextFunction } from 'express';
import { SolicitacaoService } from '../services/solicitacao.service';
import { SolicitacaoFiltros } from '../models/types';

export class SolicitacaoController {
  private service: SolicitacaoService;

  constructor(service?: SolicitacaoService) {
    this.service = service || new SolicitacaoService();
  }

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nova = this.service.criar(req.body, req.user!);
      res.status(201).json({
        sucesso: true,
        mensagem: 'Solicitação registrada com sucesso.',
        dados: nova
      });
    } catch (error) {
      next(error);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filtros: SolicitacaoFiltros = {
        data_inicio: req.query.data_inicio as string | undefined,
        data_fim: req.query.data_fim as string | undefined,
        categoria: req.query.categoria as string | undefined,
        status: req.query.status as any,
        titulo: req.query.titulo as string | undefined
      };

      const solicitacoes = this.service.listar(filtros);

      res.status(200).json({
        sucesso: true,
        dados: solicitacoes,
        total: solicitacoes.length
      });
    } catch (error) {
      next(error);
    }
  };

  obterPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const resultado = this.service.obterPorId(id);

      res.status(200).json({
        sucesso: true,
        dados: resultado.solicitacao,
        historico: resultado.historico
      });
    } catch (error) {
      next(error);
    }
  };

  editar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const atualizada = this.service.editar(id, req.body, req.user!);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Solicitação atualizada com sucesso.',
        dados: atualizada
      });
    } catch (error) {
      next(error);
    }
  };

  excluir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      this.service.excluir(id, req.user!);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Solicitação excluída com sucesso.'
      });
    } catch (error) {
      next(error);
    }
  };

  alterarStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const atualizada = this.service.alterarStatus(id, req.body, req.user!);

      res.status(200).json({
        sucesso: true,
        mensagem: `Status da solicitação alterado com sucesso para "${req.body.status}".`,
        dados: atualizada
      });
    } catch (error) {
      next(error);
    }
  };
}

import { SolicitacaoRepository } from '../repositories/solicitacao.repository';
import {
  Solicitacao,
  SolicitacaoCreateInput,
  SolicitacaoUpdateInput,
  SolicitacaoStatusUpdateInput,
  SolicitacaoFiltros,
  SolicitacaoHistorico,
  AuthPayload
} from '../models/types';
import { AppError } from '../middlewares/errorHandler.middleware';

export class SolicitacaoService {
  private repository: SolicitacaoRepository;

  constructor(repository?: SolicitacaoRepository) {
    this.repository = repository || new SolicitacaoRepository();
  }

  criar(input: SolicitacaoCreateInput, usuarioLogado: AuthPayload): Solicitacao {
    const codigo = this.repository.getNextCodigo();

    const novaSolicitacao = this.repository.create({
      ...input,
      codigo,
      usuario_id: usuarioLogado.id
    });

    // Registrar histórico da criação
    this.repository.addHistorico({
      solicitacao_id: novaSolicitacao.id,
      usuario_id: usuarioLogado.id,
      status_anterior: null,
      novo_status: 'Aberto',
      comentario: 'Solicitação registrada no sistema pelo colaborador.'
    });

    return novaSolicitacao;
  }

  listar(filtros: SolicitacaoFiltros = {}): Solicitacao[] {
    return this.repository.findAll(filtros);
  }

  obterPorId(id: number): { solicitacao: Solicitacao; historico: SolicitacaoHistorico[] } {
    const solicitacao = this.repository.findById(id);

    if (!solicitacao) {
      throw new AppError('Solicitação não encontrada.', 404);
    }

    const historico = this.repository.getHistorico(id);

    return {
      solicitacao,
      historico
    };
  }

  private validarPermissaoModificacao(
    solicitacao: Solicitacao,
    usuarioLogado: AuthPayload,
    acao: 'editar' | 'excluir'
  ): void {
    // Regra de Negócio Central: Apenas solicitações com status 'Aberto' podem ser editadas ou excluídas
    if (solicitacao.status !== 'Aberto') {
      const acaoTexto = acao === 'editar' ? 'alteradas' : 'excluídas';
      throw new AppError(
        `Não é permitido ${acao} uma solicitação com status "${solicitacao.status}". Apenas solicitações com status "Aberto" podem ser ${acaoTexto}.`,
        422
      );
    }

    // Regra de Autorização: O usuário deve ser o criador da demanda ou possuir perfil administrador/gestor
    if (usuarioLogado.perfil === 'colaborador' && solicitacao.usuario_id !== usuarioLogado.id) {
      throw new AppError(`Você não tem permissão para ${acao} uma solicitação de outro colaborador.`, 403);
    }
  }

  editar(id: number, input: SolicitacaoUpdateInput, usuarioLogado: AuthPayload): Solicitacao {
    const solicitacao = this.repository.findById(id);

    if (!solicitacao) {
      throw new AppError('Solicitação não encontrada.', 404);
    }

    this.validarPermissaoModificacao(solicitacao, usuarioLogado, 'editar');

    const atualizada = this.repository.update(id, input);

    if (!atualizada) {
      throw new AppError('Erro ao atualizar os dados da solicitação.', 500);
    }

    // Registrar no histórico a edição cadastral
    this.repository.addHistorico({
      solicitacao_id: id,
      usuario_id: usuarioLogado.id,
      status_anterior: 'Aberto',
      novo_status: 'Aberto',
      comentario: 'Dados cadastrais da solicitação (título/descrição/categoria) foram editados.'
    });

    return atualizada;
  }

  excluir(id: number, usuarioLogado: AuthPayload): boolean {
    const solicitacao = this.repository.findById(id);

    if (!solicitacao) {
      throw new AppError('Solicitação não encontrada.', 404);
    }

    this.validarPermissaoModificacao(solicitacao, usuarioLogado, 'excluir');

    return this.repository.delete(id);
  }

  alterarStatus(id: number, input: SolicitacaoStatusUpdateInput, usuarioLogado: AuthPayload): Solicitacao {
    const solicitacao = this.repository.findById(id);

    if (!solicitacao) {
      throw new AppError('Solicitação não encontrada.', 404);
    }

    const statusAnterior = solicitacao.status;
    const novoStatus = input.status;

    if (statusAnterior === novoStatus) {
      throw new AppError(`A solicitação já se encontra no status "${novoStatus}".`, 400);
    }

    const atualizada = this.repository.updateStatus(id, novoStatus, input.comentario);

    if (!atualizada) {
      throw new AppError('Erro ao atualizar o status da solicitação.', 500);
    }

    // Registrar auditoria da mudança de status
    this.repository.addHistorico({
      solicitacao_id: id,
      usuario_id: usuarioLogado.id,
      status_anterior: statusAnterior,
      novo_status: novoStatus,
      comentario: input.comentario || `Status alterado de "${statusAnterior}" para "${novoStatus}".`
    });

    return atualizada;
  }
}

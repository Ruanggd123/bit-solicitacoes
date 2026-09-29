import React, { useState, useEffect } from 'react';
import { Solicitacao, SolicitacaoHistorico, StatusSolicitacao } from '../types';
import { solicitacoesApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import {
  X,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Send,
  Building,
  CheckCircle2,
  Edit2,
  Trash2
} from 'lucide-react';

interface SolicitacaoDetailModalProps {
  solicitacaoId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged: () => void;
  onEditRequested: (solicitacao: Solicitacao) => void;
  onDeleteRequested: (solicitacao: Solicitacao) => void;
}

export const SolicitacaoDetailModal: React.FC<SolicitacaoDetailModalProps> = ({
  solicitacaoId,
  isOpen,
  onClose,
  onStatusChanged,
  onEditRequested,
  onDeleteRequested
}) => {
  const { showToast } = useToast();
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [historico, setHistorico] = useState<SolicitacaoHistorico[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estado para alteração de status
  const [novoStatus, setNovoStatus] = useState<StatusSolicitacao>('Em Atendimento');
  const [comentarioStatus, setComentarioStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const carregarDetalhes = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await solicitacoesApi.obterPorId(id);
      setSolicitacao(data.solicitacao);
      setHistorico(data.historico);

      // Sugere o próximo status natural
      if (data.solicitacao.status === 'Aberto') {
        setNovoStatus('Em Atendimento');
      } else if (data.solicitacao.status === 'Em Atendimento') {
        setNovoStatus('Concluído');
      } else {
        setNovoStatus('Em Atendimento');
      }
    } catch (error: any) {
      showToast('error', 'Erro', 'Não foi possível carregar os detalhes do chamado.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && solicitacaoId) {
      carregarDetalhes(solicitacaoId);
      setComentarioStatus('');
    }
  }, [isOpen, solicitacaoId]);

  if (!isOpen || !solicitacaoId) return null;

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solicitacao) return;

    if (novoStatus === solicitacao.status) {
      showToast('warning', 'Atenção', 'Selecione um status diferente do atual.');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await solicitacoesApi.alterarStatus(solicitacao.id, novoStatus, comentarioStatus);
      showToast('success', 'Status Alterado', `O chamado agora está "${novoStatus}".`);
      await carregarDetalhes(solicitacao.id);
      setComentarioStatus('');
      onStatusChanged();
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Falha ao atualizar status.';
      showToast('error', 'Erro ao alterar status', msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatarData = (dataStr?: string | null) => {
    if (!dataStr) return '—';
    try {
      const d = new Date(dataStr.replace(' ', 'T'));
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch {
      return dataStr;
    }
  };

  const isAberto = solicitacao?.status === 'Aberto';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {solicitacao?.codigo || '...'}
              </span>
              {solicitacao && <StatusBadge status={solicitacao.status} />}
              {solicitacao && <CategoryBadge categoria={solicitacao.categoria} />}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {solicitacao?.titulo || 'Carregando detalhes...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="overflow-y-auto flex-1 pr-1 py-4 space-y-6">
          {isLoading || !solicitacao ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Carregando detalhes da solicitação...</p>
            </div>
          ) : (
            <>
              {/* Metadados e Informações do Solicitante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-slate-400">Solicitante</span>
                    <span className="font-semibold text-slate-800">{solicitacao.solicitante_nome}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-slate-400">Departamento</span>
                    <span className="font-semibold text-slate-800">{solicitacao.solicitante_departamento}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-slate-400">Data de Abertura</span>
                    <span className="font-semibold text-slate-800">{formatarData(solicitacao.data_abertura)}</span>
                  </div>
                </div>

                {solicitacao.data_conclusao && (
                  <div className="flex items-center gap-2 text-emerald-700 col-span-full bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Concluído em: <strong>{formatarData(solicitacao.data_conclusao)}</strong></span>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Descrição da Demanda
                </h4>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed shadow-sm">
                  {solicitacao.descricao}
                </div>
              </div>

              {/* Ações de Edição e Exclusão (Se status for Aberto) */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Regras de Edição / Exclusão:</span>
                  <p className="text-slate-500 mt-0.5">
                    {isAberto
                      ? 'Como esta solicitação está "Aberta", alterações cadastrais ou exclusão são permitidas.'
                      : 'Esta solicitação não pode mais ser editada ou excluída porque já saiu do status Aberto.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onEditRequested(solicitacao);
                    }}
                    disabled={!isAberto}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-medium text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    title={!isAberto ? 'Apenas chamados abertos podem ser editados' : 'Editar solicitação'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onDeleteRequested(solicitacao);
                    }}
                    disabled={!isAberto}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 font-medium text-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    title={!isAberto ? 'Apenas chamados abertos podem ser excluídos' : 'Excluir solicitação'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>

              {/* Seção: Alterar Status */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  Atualizar Status da Solicitação
                </h4>

                <form onSubmit={handleUpdateStatus} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['Aberto', 'Em Atendimento', 'Concluído'] as StatusSolicitacao[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNovoStatus(st)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                          novoStatus === st
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Comentário / Despacho da Transição (opcional):
                    </label>
                    <input
                      type="text"
                      value={comentarioStatus}
                      onChange={(e) => setComentarioStatus(e.target.value)}
                      placeholder="Ex: Em processo de cotação / Demanda atendida com sucesso..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                      disabled={isUpdatingStatus}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdatingStatus || novoStatus === solicitacao.status}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingStatus ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Confirmar Mudança para "{novoStatus}"
                    </button>
                  </div>
                </form>
              </div>

              {/* Seção: Linha do Tempo / Histórico de Auditoria */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Linha do Tempo e Histórico de Ações
                </h4>

                <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                  {historico.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Nenhum evento registrado.</p>
                  ) : (
                    historico.map((item) => (
                      <div key={item.id} className="relative pl-4">
                        <div className="absolute -left-[1.3rem] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="font-semibold text-slate-800">
                              {item.responsavel_nome} ({item.responsavel_departamento})
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              {formatarData(item.data_registro)}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-slate-500">Status definido para:</span>
                            <StatusBadge status={item.novo_status as StatusSolicitacao} size="sm" />
                          </div>

                          {item.comentario && (
                            <p className="mt-2 text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                              "{item.comentario}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

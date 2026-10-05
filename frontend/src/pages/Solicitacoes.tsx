import React, { useState, useEffect, useCallback } from 'react';
import {
  Solicitacao,
  SolicitacaoFiltros,
  SolicitacaoCreateInput,
  StatusSolicitacao,
  DashboardMetrics
} from '../types';
import { solicitacoesApi, categoriasApi, dashboardApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { FilterBar } from '../components/FilterBar';
import { SolicitacaoModal } from '../components/SolicitacaoModal';
import { SolicitacaoDetailModal } from '../components/SolicitacaoDetailModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  User as UserIcon,
  RefreshCw,
  Download,
  Play,
  CheckCircle2,
  Layers,
  Clock
} from 'lucide-react';
import { formatarData } from '../utils/formatters';
import { canUserManageSolicitacao } from '../utils/permissions';

interface SolicitacoesProps {
  initialStatusFilter?: string;
  onOpenNovaSolicitacaoTrigger?: boolean;
  onResetOpenNovaSolicitacao?: () => void;
}

export const Solicitacoes: React.FC<SolicitacoesProps> = ({
  initialStatusFilter,
  onOpenNovaSolicitacaoTrigger,
  onResetOpenNovaSolicitacao
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [categorias, setCategorias] = useState<Array<{ id: number; nome: string; descricao?: string }>>([]);
  const [metricas, setMetricas] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Estados dos filtros
  const [filtros, setFiltros] = useState<SolicitacaoFiltros>({
    status: (initialStatusFilter as StatusSolicitacao) || '',
    categoria: '',
    titulo: '',
    data_inicio: '',
    data_fim: ''
  });

  // Sincronizar filtro quando a prop mudar (ex: ao navegar pelos cards do Dashboard)
  useEffect(() => {
    if (initialStatusFilter !== undefined) {
      setFiltros((prev) => ({
        ...prev,
        status: (initialStatusFilter as StatusSolicitacao) || ''
      }));
    }
  }, [initialStatusFilter]);

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitacaoParaEditar, setSolicitacaoParaEditar] = useState<Solicitacao | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [detalhesId, setDetalhesId] = useState<number | null>(null);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);

  const [solicitacaoParaExcluir, setSolicitacaoParaExcluir] = useState<Solicitacao | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar Categorias
  const carregarCategorias = async () => {
    try {
      const data = await categoriasApi.listar();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Carregar Métricas dos indicadores
  const carregarMetricas = useCallback(async () => {
    try {
      const data = await dashboardApi.obterMetricas();
      setMetricas(data);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    }
  }, []);

  // Carregar Solicitações com Filtros
  const carregarSolicitacoes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await solicitacoesApi.listar(filtros);
      setSolicitacoes(data);
    } catch (error) {
      showToast('error', 'Erro', 'Falha ao carregar as solicitações.');
    } finally {
      setIsLoading(false);
    }
  }, [filtros, showToast]);

  useEffect(() => {
    carregarCategorias();
    carregarMetricas();
  }, [carregarMetricas]);

  useEffect(() => {
    carregarSolicitacoes();
  }, [carregarSolicitacoes]);

  // Gatilho externo para abrir modal de nova solicitação (ex: via Navbar)
  useEffect(() => {
    if (onOpenNovaSolicitacaoTrigger) {
      setSolicitacaoParaEditar(null);
      setIsModalOpen(true);
      if (onResetOpenNovaSolicitacao) onResetOpenNovaSolicitacao();
    }
  }, [onOpenNovaSolicitacaoTrigger, onResetOpenNovaSolicitacao]);

  const handleClearFilters = () => {
    setFiltros({
      status: '',
      categoria: '',
      titulo: '',
      data_inicio: '',
      data_fim: ''
    });
  };

  const handleRefresh = async () => {
    await Promise.all([carregarSolicitacoes(), carregarMetricas()]);
  };

  const handleOpenCreate = () => {
    setSolicitacaoParaEditar(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (solicitacao: Solicitacao) => {
    if (solicitacao.status !== 'Aberto') {
      showToast('warning', 'Ação não permitida', 'Apenas solicitações com status "Aberto" podem ser editadas.');
      return;
    }
    setSolicitacaoParaEditar(solicitacao);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (id: number) => {
    setDetalhesId(id);
    setIsDetalhesOpen(true);
  };

  // Ação rápida de 1 clique para avançar status
  const handleQuickStatusAdvance = async (sol: Solicitacao, novoStatus: StatusSolicitacao, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdatingId(sol.id);
    try {
      await solicitacoesApi.alterarStatus(sol.id, novoStatus, `Avanço rápido de status para "${novoStatus}".`);
      showToast('success', 'Status Atualizado!', `A solicitação ${sol.codigo} agora está "${novoStatus}".`);
      await Promise.all([carregarSolicitacoes(), carregarMetricas()]);
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Falha ao atualizar o status da solicitação.';
      showToast('error', 'Erro na atualização', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSubmitModal = async (dados: SolicitacaoCreateInput) => {
    setIsSaving(true);
    try {
      if (solicitacaoParaEditar) {
        await solicitacoesApi.editar(solicitacaoParaEditar.id, dados);
        showToast('success', 'Atualizado com sucesso!', 'Os dados da solicitação foram atualizados.');
      } else {
        await solicitacoesApi.criar(dados);
        showToast('success', 'Solicitação Registrada!', 'Sua demanda foi cadastrada com status inicial Aberto.');
      }
      setIsModalOpen(false);
      await Promise.all([carregarSolicitacoes(), carregarMetricas()]);
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao processar a solicitação.';
      showToast('error', 'Erro', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!solicitacaoParaExcluir) return;

    setIsDeleting(true);
    try {
      await solicitacoesApi.excluir(solicitacaoParaExcluir.id);
      showToast('success', 'Excluída!', `A solicitação ${solicitacaoParaExcluir.codigo} foi removida.`);
      setSolicitacaoParaExcluir(null);
      await Promise.all([carregarSolicitacoes(), carregarMetricas()]);
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Falha ao excluir a solicitação.';
      showToast('error', 'Erro na exclusão', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const exportarParaCSV = () => {
    if (solicitacoes.length === 0) {
      showToast('warning', 'Sem dados', 'Nenhuma solicitação para exportar com os filtros atuais.');
      return;
    }

    const cabecalhos = ['Código', 'Título', 'Categoria', 'Solicitante', 'Departamento', 'Data de Abertura', 'Status', 'Data de Conclusão', 'Observações'];

    const linhas = solicitacoes.map((s) => [
      `"${s.codigo}"`,
      `"${s.titulo.replace(/"/g, '""')}"`,
      `"${s.categoria}"`,
      `"${s.solicitante_nome || ''}"`,
      `"${s.solicitante_departamento || ''}"`,
      `"${formatarData(s.data_abertura)}"`,
      `"${s.status}"`,
      `"${formatarData(s.data_conclusao)}"`,
      `"${(s.observacoes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [cabecalhos.join(';'), ...linhas.map((e) => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_solicitacoes_bitsolucoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Relatório Gerado!', 'O arquivo CSV foi baixado com sucesso.');
  };

  const statusTabs = [
    { label: 'Todas', value: '', count: metricas?.total ?? solicitacoes.length, icon: Layers },
    { label: 'Abertas', value: 'Aberto', count: metricas?.abertas ?? 0, icon: Clock },
    { label: 'Em Atendimento', value: 'Em Atendimento', count: metricas?.em_atendimento ?? 0, icon: Play },
    { label: 'Concluídas', value: 'Concluído', count: metricas?.concluidas ?? 0, icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gerenciamento de Solicitações
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {solicitacoes.length} {solicitacoes.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Consulte, acompanhe e gerencie as demandas internas com ações ágeis e filtros em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Atualizar lista e indicadores"
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportarParaCSV}
            title="Exportar para planilha (CSV/Excel)"
            className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 rounded-xl hover:bg-slate-50 transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Exportar Planilha</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* Abas Rápidas por Status com Contadores ao Vivo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {statusTabs.map((tab) => {
          const isActive = (filtros.status || '') === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFiltros((prev) => ({ ...prev, status: tab.value as StatusSolicitacao | '' }))}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-blue-500/20 shadow-md ring-2 ring-blue-600/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Componente de Filtros (Período, Categoria, Status e Texto Livre) */}
      <FilterBar
        filtros={filtros}
        categorias={categorias}
        onChange={setFiltros}
        onClear={handleClearFilters}
      />

      {/* Tabela Desktop / Cards Mobile */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Buscando solicitações...</p>
          </div>
        ) : solicitacoes.length === 0 ? (
          <div className="py-16 text-center text-slate-500 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm text-slate-700">Nenhuma solicitação encontrada</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tente redefinir os filtros aplicados ou cadastre uma nova solicitação interna.
            </p>
          </div>
        ) : (
          <>
            {/* Visualização em Tabela para Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3.5 px-4">Código</th>
                    <th className="py-3.5 px-4">Título</th>
                    <th className="py-3.5 px-4">Categoria</th>
                    <th className="py-3.5 px-4">Solicitante</th>
                    <th className="py-3.5 px-4">Data Abertura</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {solicitacoes.map((sol) => {
                    const isAberto = sol.status === 'Aberto';
                    const canEditOrDelete = canUserManageSolicitacao(user, sol);
                    const isRowBusy = updatingId === sol.id;

                    return (
                      <tr
                        key={sol.id}
                        onClick={() => handleOpenDetails(sol.id)}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        title="Clique para visualizar detalhes completos"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {sol.codigo}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                          {sol.titulo}
                        </td>
                        <td className="py-3.5 px-4">
                          <CategoryBadge categoria={sol.categoria} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-medium text-slate-800">{sol.solicitante_nome}</div>
                          <div className="text-[11px] text-slate-400">{sol.solicitante_departamento}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {formatarData(sol.data_abertura)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={sol.status} size="sm" />
                        </td>
                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ação Rápida de 1 Clique: Iniciar Atendimento */}
                            {sol.status === 'Aberto' && (
                              <button
                                onClick={(e) => handleQuickStatusAdvance(sol, 'Em Atendimento', e)}
                                disabled={isRowBusy}
                                className="px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                                title="Iniciar atendimento imediatamente"
                              >
                                <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                                <span>Atender</span>
                              </button>
                            )}

                            {/* Ação Rápida de 1 Clique: Concluir */}
                            {sol.status === 'Em Atendimento' && (
                              <button
                                onClick={(e) => handleQuickStatusAdvance(sol, 'Concluído', e)}
                                disabled={isRowBusy}
                                className="px-2.5 py-1 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                                title="Concluir solicitação imediatamente"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>Concluir</span>
                              </button>
                            )}

                            {/* Ver detalhes */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails(sol.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Ver detalhes completos e histórico"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Editar (apenas status 'Aberto') */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(sol);
                              }}
                              disabled={!canEditOrDelete}
                              className={`p-1.5 rounded-lg transition-colors ${
                                canEditOrDelete
                                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 cursor-pointer'
                                  : 'text-slate-300 bg-slate-50 cursor-not-allowed opacity-40'
                              }`}
                              title={
                                !isAberto
                                  ? 'Não é permitido editar chamados em atendimento ou concluídos'
                                  : 'Editar solicitação'
                              }
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Excluir (apenas status 'Aberto') */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSolicitacaoParaExcluir(sol);
                              }}
                              disabled={!canEditOrDelete}
                              className={`p-1.5 rounded-lg transition-colors ${
                                canEditOrDelete
                                  ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer'
                                  : 'text-slate-300 bg-slate-50 cursor-not-allowed opacity-40'
                              }`}
                              title={
                                !isAberto
                                  ? 'Não é permitido excluir chamados em atendimento ou concluídos'
                                  : 'Excluir solicitação'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visualização Adaptada em Cards para Dispositivos Móveis */}
            <div className="md:hidden divide-y divide-slate-100">
              {solicitacoes.map((sol) => {
                const isAberto = sol.status === 'Aberto';
                const canEditOrDelete = canUserManageSolicitacao(user, sol);
                const isRowBusy = updatingId === sol.id;

                return (
                  <div
                    key={sol.id}
                    onClick={() => handleOpenDetails(sol.id)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {sol.codigo}
                      </span>
                      <StatusBadge status={sol.status} size="sm" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{sol.titulo}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sol.descricao}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                      <CategoryBadge categoria={sol.categoria} size="sm" />
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatarData(sol.data_abertura)}</span>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sol.solicitante_nome}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Ação Rápida Mobile */}
                        {sol.status === 'Aberto' && (
                          <button
                            onClick={(e) => handleQuickStatusAdvance(sol, 'Em Atendimento', e)}
                            disabled={isRowBusy}
                            className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-emerald-600" />
                            Atender
                          </button>
                        )}
                        {sol.status === 'Em Atendimento' && (
                          <button
                            onClick={(e) => handleQuickStatusAdvance(sol, 'Concluído', e)}
                            disabled={isRowBusy}
                            className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Concluir
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDetails(sol.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                        >
                          Detalhes
                        </button>
                        {canEditOrDelete && (
                          <button
                            onClick={() => handleOpenEdit(sol)}
                            className="px-2 py-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg"
                          >
                            Editar
                          </button>
                        )}
                        {canEditOrDelete && (
                          <button
                            onClick={() => setSolicitacaoParaExcluir(sol)}
                            className="px-2 py-1 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé informativo da listagem */}
            <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span className="font-medium">
                Mostrando <strong className="text-slate-800">{solicitacoes.length}</strong> {solicitacoes.length === 1 ? 'solicitação' : 'solicitações'}
              </span>
              <span className="text-[11px] text-slate-400">
                * Conforme regra de negócio, solicitações "Em Atendimento" ou "Concluído" não permitem edição/exclusão.
              </span>
            </div>
          </>
        )}
      </div>

      {/* Modal de Cadastro / Edição */}
      <SolicitacaoModal
        isOpen={isModalOpen}
        solicitacaoParaEditar={solicitacaoParaEditar}
        categorias={categorias}
        isLoading={isSaving}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
      />

      {/* Modal de Detalhes e Alteração de Status */}
      <SolicitacaoDetailModal
        solicitacaoId={detalhesId}
        isOpen={isDetalhesOpen}
        onClose={() => setIsDetalhesOpen(false)}
        onStatusChanged={handleRefresh}
        onEditRequested={(sol) => handleOpenEdit(sol)}
        onDeleteRequested={(sol) => setSolicitacaoParaExcluir(sol)}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={!!solicitacaoParaExcluir}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a solicitação ${solicitacaoParaExcluir?.codigo} ("${solicitacaoParaExcluir?.titulo}")? Esta ação é definitiva e não poderá ser desfeita.`}
        confirmLabel="Sim, Excluir"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSolicitacaoParaExcluir(null)}
      />
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  Solicitacao,
  SolicitacaoFiltros,
  SolicitacaoCreateInput,
  StatusSolicitacao
} from '../types';
import { solicitacoesApi, categoriasApi } from '../services/api';
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
  Download
} from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados dos filtros
  const [filtros, setFiltros] = useState<SolicitacaoFiltros>({
    status: (initialStatusFilter as StatusSolicitacao) || '',
    categoria: '',
    titulo: '',
    data_inicio: '',
    data_fim: ''
  });

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
  }, []);

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
      carregarSolicitacoes();
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
      carregarSolicitacoes();
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Falha ao excluir a solicitação.';
      showToast('error', 'Erro na exclusão', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatarData = (dataStr?: string | null) => {
    if (!dataStr) return '—';
    try {
      const d = new Date(dataStr.replace(' ', 'T'));
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(d);
    } catch {
      return dataStr;
    }
  };

  const exportarParaCSV = () => {
    if (solicitacoes.length === 0) {
      showToast('warning', 'Sem dados', 'Nenhuma solicitação para exportar com os filtros atuais.');
      return;
    }

    const cabecalhos = ['Código', 'Título', 'Categoria', 'Solicitante', 'Departamento', 'Data de Abertura', 'Status', 'Data de Conclusão', 'Observações'];
    
    const linhas = solicitacoes.map(s => [
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

    const csvContent = '\uFEFF' + [cabecalhos.join(';'), ...linhas.map(e => e.join(';'))].join('\r\n');
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gerenciamento de Solicitações
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consulte, acompanhe e gerencie as demandas internas de todos os setores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={carregarSolicitacoes}
            title="Atualizar lista"
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportarParaCSV}
            title="Exportar para planilha (CSV/Excel)"
            className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Exportar Planilha</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* Componente de Filtros (Período, Categoria, Status e Texto Livre) */}
      <FilterBar
        filtros={filtros}
        categorias={categorias}
        onChange={setFiltros}
        onClear={handleClearFilters}
      />

      {/* Tabela Desktop / Cards Mobile */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {solicitacoes.map((sol) => {
                    const isAberto = sol.status === 'Aberto';
                    const canEditOrDelete =
                      isAberto &&
                      (user?.perfil === 'administrador' ||
                        user?.perfil === 'gestor' ||
                        sol.usuario_id === user?.id);

                    return (
                      <tr
                        key={sol.id}
                        className="hover:bg-slate-50/80 transition-colors group"
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
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ver detalhes / Alterar Status */}
                            <button
                              onClick={() => handleOpenDetails(sol.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Ver detalhes / Alterar status"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Editar (apenas status 'Aberto') */}
                            <button
                              onClick={() => handleOpenEdit(sol)}
                              disabled={!canEditOrDelete}
                              className={`p-1.5 rounded-lg transition-colors ${
                                canEditOrDelete
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-slate-300 cursor-not-allowed'
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
                              onClick={() => setSolicitacaoParaExcluir(sol)}
                              disabled={!canEditOrDelete}
                              className={`p-1.5 rounded-lg transition-colors ${
                                canEditOrDelete
                                  ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-slate-300 cursor-not-allowed'
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
                const canEditOrDelete =
                  isAberto &&
                  (user?.perfil === 'administrador' ||
                    user?.perfil === 'gestor' ||
                    sol.usuario_id === user?.id);

                return (
                  <div key={sol.id} className="p-4 space-y-3">
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

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sol.solicitante_nome}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDetails(sol.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg"
                        >
                          Detalhes
                        </button>
                        {canEditOrDelete && (
                          <button
                            onClick={() => handleOpenEdit(sol)}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg"
                          >
                            Editar
                          </button>
                        )}
                        {canEditOrDelete && (
                          <button
                            onClick={() => setSolicitacaoParaExcluir(sol)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
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
        onStatusChanged={carregarSolicitacoes}
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

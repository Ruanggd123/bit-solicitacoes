import React, { useState, useEffect } from 'react';
import { DashboardMetrics, Solicitacao } from '../types';
import { dashboardApi, solicitacoesApi } from '../services/api';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { formatarData } from '../utils/formatters';
import {
  Inbox,
  Clock,
  PlayCircle,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FolderOpen,
  PieChart,
  User as UserIcon
} from 'lucide-react';

interface DashboardProps {
  onNavigateToSolicitacoes: (statusFilter?: string) => void;
  onOpenNovaSolicitacao: () => void;
  onViewSolicitacao: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToSolicitacoes,
  onOpenNovaSolicitacao,
  onViewSolicitacao
}) => {
  const [metricas, setMetricas] = useState<DashboardMetrics | null>(null);
  const [recentes, setRecentes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [metricasData, solicitacoesData] = await Promise.all([
        dashboardApi.obterMetricas(),
        solicitacoesApi.listar()
      ]);
      setMetricas(metricasData);
      setRecentes(solicitacoesData.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  if (isLoading || !metricas) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Consolidando indicadores em tempo real...</p>
      </div>
    );
  }

  // Cálculos de porcentagem para o pipeline visual
  const percAbertas = metricas.total > 0 ? Math.round((metricas.abertas / metricas.total) * 100) : 0;
  const percEmAtendimento = metricas.total > 0 ? Math.round((metricas.em_atendimento / metricas.total) * 100) : 0;
  const percConcluidas = metricas.total > 0 ? Math.round((metricas.concluidas / metricas.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Visão Geral em Tempo Real
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Portal de Solicitações Internas
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Acompanhe a distribuição e o ciclo de atendimento das demandas de todos os departamentos da bit Soluções.
          </p>
        </div>

        <button
          onClick={onOpenNovaSolicitacao}
          className="relative z-10 self-start sm:self-auto px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Demanda
        </button>
      </div>

      {/* Grid com os 4 Indicadores Obrigatórios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total de Solicitações"
          value={metricas.total}
          icon={Inbox}
          variant="slate"
          badge="100%"
          description="Todas as demandas registradas"
          onClick={() => onNavigateToSolicitacoes()}
        />

        <StatCard
          title="Solicitações Abertas"
          value={metricas.abertas}
          icon={Clock}
          variant="blue"
          badge={`${percAbertas}%`}
          description="Aguardando atendimento inicial"
          onClick={() => onNavigateToSolicitacoes('Aberto')}
        />

        <StatCard
          title="Em Atendimento"
          value={metricas.em_atendimento}
          icon={PlayCircle}
          variant="amber"
          badge={`${percEmAtendimento}%`}
          description="Em andamento pelas equipes"
          onClick={() => onNavigateToSolicitacoes('Em Atendimento')}
        />

        <StatCard
          title="Solicitações Concluídas"
          value={metricas.concluidas}
          icon={CheckCircle2}
          variant="emerald"
          badge={`${percConcluidas}%`}
          description="Finalizadas com sucesso"
          onClick={() => onNavigateToSolicitacoes('Concluído')}
        />
      </div>

      {/* Pipeline Visual de Atendimento */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Pipeline de Evolução das Demandas</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Total de {metricas.total} solicitações no ciclo</span>
        </div>

        {/* Barra de Progresso Multicor */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-blue-500 h-full transition-all duration-700"
            style={{ width: `${percAbertas}%` }}
            title={`Abertas: ${metricas.abertas} (${percAbertas}%)`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-700"
            style={{ width: `${percEmAtendimento}%` }}
            title={`Em Atendimento: ${metricas.em_atendimento} (${percEmAtendimento}%)`}
          />
          <div
            className="bg-emerald-500 h-full transition-all duration-700"
            style={{ width: `${percConcluidas}%` }}
            title={`Concluídas: ${metricas.concluidas} (${percConcluidas}%)`}
          />
        </div>

        {/* Legenda com Indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
          <button
            onClick={() => onNavigateToSolicitacoes('Aberto')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-semibold text-slate-700">Abertas</span>
            </div>
            <span className="font-extrabold text-blue-700">{metricas.abertas} ({percAbertas}%)</span>
          </button>

          <button
            onClick={() => onNavigateToSolicitacoes('Em Atendimento')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700">Em Atendimento</span>
            </div>
            <span className="font-extrabold text-amber-700">{metricas.em_atendimento} ({percEmAtendimento}%)</span>
          </button>

          <button
            onClick={() => onNavigateToSolicitacoes('Concluído')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">Concluídas</span>
            </div>
            <span className="font-extrabold text-emerald-700">{metricas.concluidas} ({percConcluidas}%)</span>
          </button>
        </div>
      </div>

      {/* Seções Analíticas: Distribuição por Categoria e Chamados Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Categoria */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">Demandas por Categoria</h2>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 flex-1">
            {metricas.por_categoria && metricas.por_categoria.length > 0 ? (
              metricas.por_categoria.map((item) => {
                const percentual = metricas.total > 0
                  ? Math.round((item.total / metricas.total) * 100)
                  : 0;

                return (
                  <div key={item.categoria} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <CategoryBadge categoria={item.categoria} size="sm" />
                      <span className="font-bold text-slate-800">
                        {item.total} <span className="text-slate-400 font-normal">({percentual}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">Nenhuma categoria registrada.</p>
            )}
          </div>
        </div>

        {/* Últimas Solicitações Registradas */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Últimas Solicitações Registradas</h2>
              <p className="text-xs text-slate-500 mt-0.5">Chamados mais recentes em acompanhamento</p>
            </div>
            <button
              onClick={() => onNavigateToSolicitacoes()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 p-1 hover:underline"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-3">Código</th>
                  <th className="pb-3">Título</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Solicitante</th>
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Nenhuma solicitação encontrada no momento.
                    </td>
                  </tr>
                ) : (
                  recentes.map((sol) => (
                    <tr
                      key={sol.id}
                      onClick={() => onViewSolicitacao(sol.id)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 font-mono font-bold text-slate-700">
                        {sol.codigo}
                      </td>
                      <td className="py-3.5 font-semibold text-slate-900 max-w-[180px] truncate">
                        {sol.titulo}
                      </td>
                      <td className="py-3.5">
                        <CategoryBadge categoria={sol.categoria} size="sm" />
                      </td>
                      <td className="py-3.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                            {sol.solicitante_nome ? sol.solicitante_nome.charAt(0) : 'U'}
                          </div>
                          <span className="truncate max-w-[100px]">{sol.solicitante_nome}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-500 whitespace-nowrap">
                        {formatarData(sol.data_abertura)}
                      </td>
                      <td className="py-3.5 whitespace-nowrap">
                        <StatusBadge status={sol.status} size="sm" />
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <span className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Detalhes →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

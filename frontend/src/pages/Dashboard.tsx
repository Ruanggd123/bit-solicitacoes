import React, { useState, useEffect } from 'react';
import { DashboardMetrics, Solicitacao } from '../types';
import { dashboardApi, solicitacoesApi } from '../services/api';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import {
  Inbox,
  Clock,
  PlayCircle,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FolderOpen
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
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Carregando indicadores do sistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Geral de Demandas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visão consolidada dos chamados e evolução dos atendimentos internos.
          </p>
        </div>

        <button
          onClick={onOpenNovaSolicitacao}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
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
          description="Todas as demandas registradas"
          onClick={() => onNavigateToSolicitacoes()}
        />

        <StatCard
          title="Solicitações Abertas"
          value={metricas.abertas}
          icon={Clock}
          variant="blue"
          description="Aguardando atendimento inicial"
          onClick={() => onNavigateToSolicitacoes('Aberto')}
        />

        <StatCard
          title="Em Atendimento"
          value={metricas.em_atendimento}
          icon={PlayCircle}
          variant="amber"
          description="Em andamento pelas equipes"
          onClick={() => onNavigateToSolicitacoes('Em Atendimento')}
        />

        <StatCard
          title="Solicitações Concluídas"
          value={metricas.concluidas}
          icon={CheckCircle2}
          variant="emerald"
          description="Finalizadas com sucesso"
          onClick={() => onNavigateToSolicitacoes('Concluído')}
        />
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

          <div className="space-y-3.5 flex-1">
            {metricas.por_categoria && metricas.por_categoria.length > 0 ? (
              metricas.por_categoria.map((item) => {
                const percentual = metricas.total > 0
                  ? Math.round((item.total / metricas.total) * 100)
                  : 0;

                return (
                  <div key={item.categoria} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CategoryBadge categoria={item.categoria} size="sm" />
                      </div>
                      <span className="font-semibold text-slate-700">
                        {item.total} ({percentual}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Nenhuma categoria registrada.</p>
            )}
          </div>
        </div>

        {/* Últimas Solicitações Registradas */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-sm font-bold text-slate-800">Últimas Solicitações Registradas</h2>
            <button
              onClick={() => onNavigateToSolicitacoes()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Nenhuma solicitação encontrada no momento.
                    </td>
                  </tr>
                ) : (
                  recentes.map((sol) => (
                    <tr
                      key={sol.id}
                      onClick={() => onViewSolicitacao(sol.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 font-mono font-bold text-slate-600">
                        {sol.codigo}
                      </td>
                      <td className="py-3 font-semibold text-slate-900 max-w-xs truncate">
                        {sol.titulo}
                      </td>
                      <td className="py-3">
                        <CategoryBadge categoria={sol.categoria} size="sm" />
                      </td>
                      <td className="py-3">
                        <StatusBadge status={sol.status} size="sm" />
                      </td>
                      <td className="py-3 text-right">
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

import React from 'react';
import { SolicitacaoFiltros, StatusSolicitacao } from '../types';
import { Search, Filter, RotateCcw, Calendar, X, Tag } from 'lucide-react';

interface FilterBarProps {
  filtros: SolicitacaoFiltros;
  categorias: Array<{ id: number; nome: string }>;
  onChange: (novosFiltros: SolicitacaoFiltros) => void;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filtros,
  categorias,
  onChange,
  onClear
}) => {
  const hasActiveFilters = !!(
    filtros.titulo ||
    filtros.categoria ||
    filtros.status ||
    filtros.data_inicio ||
    filtros.data_fim
  );

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span>Filtros e Consulta de Solicitações</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Pesquisa por Texto Livre (Título / Código) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Texto livre (título / código)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filtros.titulo || ''}
              onChange={(e) => onChange({ ...filtros, titulo: e.target.value })}
              placeholder="Buscar por termo ou protocolo..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            />
          </div>
        </div>

        {/* Filtro por Categoria */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Categoria
          </label>
          <select
            value={filtros.categoria || ''}
            onChange={(e) => onChange({ ...filtros, categoria: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white font-medium"
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Status
          </label>
          <select
            value={filtros.status || ''}
            onChange={(e) => onChange({ ...filtros, status: e.target.value as StatusSolicitacao | '' })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white font-medium"
          >
            <option value="">Todos os Status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Atendimento">Em Atendimento</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>

        {/* Filtro por Período */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Período (Início e Fim)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="date"
              value={filtros.data_inicio || ''}
              onChange={(e) => onChange({ ...filtros, data_inicio: e.target.value })}
              title="Data inicial"
              className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
            />
            <input
              type="date"
              value={filtros.data_fim || ''}
              onChange={(e) => onChange({ ...filtros, data_fim: e.target.value })}
              title="Data final"
              className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Chips de Filtros Ativos para Facilidade de Consulta */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" /> Filtros aplicados:
          </span>

          {filtros.titulo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium text-[11px]">
              Busca: "{filtros.titulo}"
              <button onClick={() => onChange({ ...filtros, titulo: '' })} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filtros.categoria && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium text-[11px]">
              Setor: {filtros.categoria}
              <button onClick={() => onChange({ ...filtros, categoria: '' })} className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filtros.status && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium text-[11px]">
              Status: {filtros.status}
              <button onClick={() => onChange({ ...filtros, status: '' })} className="hover:text-amber-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filtros.data_inicio || filtros.data_fim) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]">
              Datas: {filtros.data_inicio || 'Início'} até {filtros.data_fim || 'Hoje'}
              <button onClick={() => onChange({ ...filtros, data_inicio: '', data_fim: '' })} className="hover:text-slate-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

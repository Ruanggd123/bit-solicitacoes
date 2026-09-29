import React, { useState, useEffect } from 'react';
import { Solicitacao, SolicitacaoCreateInput, CategoriaSolicitacao } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { X, Send, Save, Info } from 'lucide-react';

interface SolicitacaoModalProps {
  isOpen: boolean;
  solicitacaoParaEditar?: Solicitacao | null;
  categorias: Array<{ id: number; nome: string; descricao?: string }>;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (dados: SolicitacaoCreateInput) => Promise<void>;
}

export const SolicitacaoModal: React.FC<SolicitacaoModalProps> = ({
  isOpen,
  solicitacaoParaEditar,
  categorias,
  isLoading = false,
  onClose,
  onSubmit
}) => {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaSolicitacao>('TI');
  const [erros, setErros] = useState<{ titulo?: string; descricao?: string }>({});

  const isEditing = !!solicitacaoParaEditar;

  useEffect(() => {
    if (solicitacaoParaEditar) {
      setTitulo(solicitacaoParaEditar.titulo);
      setDescricao(solicitacaoParaEditar.descricao);
      setCategoria(solicitacaoParaEditar.categoria);
    } else {
      setTitulo('');
      setDescricao('');
      setCategoria(categorias.length > 0 ? categorias[0].nome : 'TI');
    }
    setErros({});
  }, [solicitacaoParaEditar, isOpen, categorias]);

  if (!isOpen) return null;

  const validar = (): boolean => {
    const novosErros: { titulo?: string; descricao?: string } = {};
    if (!titulo.trim() || titulo.trim().length < 3) {
      novosErros.titulo = 'O título deve conter no mínimo 3 caracteres.';
    } else if (titulo.length > 150) {
      novosErros.titulo = 'O título não pode ultrapassar 150 caracteres.';
    }

    if (!descricao.trim() || descricao.trim().length < 5) {
      novosErros.descricao = 'A descrição detalhada deve conter no mínimo 5 caracteres.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    await onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Editar Solicitação' : 'Nova Solicitação Interna'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isEditing
                ? `Atualize os detalhes do chamado ${solicitacaoParaEditar.codigo}`
                : 'Preencha os campos abaixo para registrar sua demanda'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificação informativa dos campos automáticos exigidos no edital */}
        {!isEditing && (
          <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Campos automáticos do sistema:</span>
              <span className="ml-1">
                Data de abertura (hoje), Solicitante ({user?.nome || 'Você'}) e Status inicial (Aberto).
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Título da Solicitação <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Aquisição de licença de software / Ajuste na rede"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                erros.titulo
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
              disabled={isLoading}
            />
            {erros.titulo && <p className="text-xs text-rose-500 mt-1">{erros.titulo}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Categoria <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              disabled={isLoading}
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome} {cat.descricao ? `— ${cat.descricao}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descrição Detalhada <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              placeholder="Descreva de forma clara o que você precisa, justificativa e eventuais prazos necessários..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                erros.descricao
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
              disabled={isLoading}
            />
            {erros.descricao && <p className="text-xs text-rose-500 mt-1">{erros.descricao}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isEditing ? 'Salvar Alterações' : 'Registrar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

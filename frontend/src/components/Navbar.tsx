import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'solicitacoes';
  onSelectTab: (tab: 'dashboard' | 'solicitacoes') => void;
  onOpenNovaSolicitacao: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNovaSolicitacao
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPerfilBadge = () => {
    if (!user) return null;
    let badgeColor = 'bg-slate-100 text-slate-700';
    if (user.perfil === 'administrador') badgeColor = 'bg-purple-100 text-purple-800';
    if (user.perfil === 'gestor') badgeColor = 'bg-blue-100 text-blue-800';

    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
        {user.perfil}
      </span>
    );
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Marca */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-xl tracking-tight">
                b<span className="text-cyan-200">i</span>t
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  bit <span className="text-blue-600 font-semibold text-sm">Soluções</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-400 font-medium">
                  Portal de Solicitações Internas
                </span>
              </div>
            </div>

            {/* Links Desktop */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => onSelectTab('solicitacoes')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'solicitacoes'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Solicitações
              </button>
            </nav>
          </div>

          {/* Área do Usuário Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenNovaSolicitacao}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              + Nova Solicitação
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">{user?.nome}</span>
                  {getPerfilBadge()}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                  <Building2 className="w-3 h-3" />
                  <span>{user?.departamento}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Encerrar Sessão"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenNovaSolicitacao}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg"
            >
              + Nova
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                {user?.nome?.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{user?.nome}</p>
                <p className="text-[11px] text-slate-500">{user?.departamento}</p>
              </div>
            </div>
            {getPerfilBadge()}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard de Indicadores
            </button>
            <button
              onClick={() => {
                onSelectTab('solicitacoes');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                currentTab === 'solicitacoes' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Gerenciamento de Solicitações
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              Sair do Sistema
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

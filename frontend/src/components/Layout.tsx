import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  currentTab: 'dashboard' | 'solicitacoes';
  onSelectTab: (tab: 'dashboard' | 'solicitacoes') => void;
  onOpenNovaSolicitacao: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  onOpenNovaSolicitacao
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        onOpenNovaSolicitacao={onOpenNovaSolicitacao}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 bit Soluções — Portal Corporativo de Solicitações Internas.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Paraíba • João Pessoa / Campina Grande</span>
            <span>•</span>
            <span>Desafio Técnico Full Stack Júnior</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

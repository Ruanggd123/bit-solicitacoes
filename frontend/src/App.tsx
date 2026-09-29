import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Solicitacoes } from './pages/Solicitacoes';
import { Layout } from './components/Layout';
import { SolicitacaoDetailModal } from './components/SolicitacaoDetailModal';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'solicitacoes'>('dashboard');
  const [solicitacaoFiltroStatus, setSolicitacaoFiltroStatus] = useState<string | undefined>(undefined);
  const [triggerNovaSolicitacao, setTriggerNovaSolicitacao] = useState(false);

  // Modal de detalhes global quando acionado pelo Dashboard
  const [quickViewId, setQuickViewId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">Carregando Portal bit Soluções...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleNavigateToSolicitacoes = (statusFilter?: string) => {
    setSolicitacaoFiltroStatus(statusFilter);
    setCurrentTab('solicitacoes');
  };

  const handleOpenNovaSolicitacao = () => {
    setCurrentTab('solicitacoes');
    setTriggerNovaSolicitacao(true);
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        if (tab === 'solicitacoes') {
          setSolicitacaoFiltroStatus(undefined);
        }
        setCurrentTab(tab);
      }}
      onOpenNovaSolicitacao={handleOpenNovaSolicitacao}
    >
      {currentTab === 'dashboard' ? (
        <Dashboard
          onNavigateToSolicitacoes={handleNavigateToSolicitacoes}
          onOpenNovaSolicitacao={handleOpenNovaSolicitacao}
          onViewSolicitacao={(id) => setQuickViewId(id)}
        />
      ) : (
        <Solicitacoes
          initialStatusFilter={solicitacaoFiltroStatus}
          onOpenNovaSolicitacaoTrigger={triggerNovaSolicitacao}
          onResetOpenNovaSolicitacao={() => setTriggerNovaSolicitacao(false)}
        />
      )}

      {/* Modal de Detalhes rápido acionado pelo Dashboard */}
      {quickViewId && (
        <SolicitacaoDetailModal
          solicitacaoId={quickViewId}
          isOpen={!!quickViewId}
          onClose={() => setQuickViewId(null)}
          onStatusChanged={() => {}}
          onEditRequested={() => {
            setQuickViewId(null);
            setCurrentTab('solicitacoes');
          }}
          onDeleteRequested={() => {
            setQuickViewId(null);
            setCurrentTab('solicitacoes');
          }}
        />
      )}
    </Layout>
  );
};

export default App;

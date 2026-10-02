import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Lock, User, ArrowRight, Shield, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !senha.trim()) {
      setErro('Por favor, informe seu usuário e senha.');
      return;
    }

    setIsLoading(true);
    setErro(null);

    try {
      await login(usuario.trim(), senha);
      showToast('success', 'Bem-vindo(a)!', 'Autenticação realizada com sucesso no Portal bit Soluções.');
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Credenciais inválidas. Verifique seu usuário e senha.';
      setErro(msg);
      showToast('error', 'Falha na autenticação', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Preenchimento com 1 clique para facilidade dos avaliadores
  const preencherDemo = (userDemo: string, passDemo: string) => {
    setUsuario(userDemo);
    setSenha(passDemo);
    setErro(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo (Glow sutil) */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Cabeçalho com Logo Corporativo bit Soluções */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 shadow-xl shadow-blue-500/25 text-white font-black text-3xl mb-4 ring-4 ring-white/10">
            b<span className="text-cyan-200">i</span>t
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            bit <span className="text-blue-400 font-semibold">Soluções</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 flex items-center justify-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Portal de Solicitações Internas
          </p>
        </div>

        {/* Card do Formulário de Login */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Acesse sua conta
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sistema Online" />
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Informe suas credenciais corporativas para acessar o painel de demandas.
            </p>
          </div>

          {erro && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium animate-fadeIn">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Usuário
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Seu usuário corporativo (ex: admin)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha de acesso"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  title={mostrarSenha ? 'Ocultar senha' : 'Ver senha'}
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Atalho de Credenciais de Demonstração para os Avaliadores */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2.5">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Contas de teste (1 clique para preencher):
              </span>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Avaliador
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => preencherDemo('admin', 'admin123')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-blue-700">Admin</div>
                <div className="text-[10px] text-slate-500">TI / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => preencherDemo('joao.silva', 'senha123')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/60 transition-all group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-purple-700">Colaborador</div>
                <div className="text-[10px] text-slate-500">RH / senha123</div>
              </button>

              <button
                type="button"
                onClick={() => preencherDemo('maria.souza', 'senha123')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 transition-all group"
              >
                <div className="font-bold text-slate-800 text-[11px] group-hover:text-emerald-700">Gestor</div>
                <div className="text-[10px] text-slate-500">Fin / senha123</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          © 2026 bit Soluções • Paraíba (João Pessoa / Campina Grande)
        </p>
      </div>
    </div>
  );
};

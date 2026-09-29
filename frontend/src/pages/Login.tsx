import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Lock, User, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
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
      showToast('success', 'Bem-vindo(a)!', 'Login realizado com sucesso.');
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Usuário ou senha incorretos.';
      setErro(msg);
      showToast('error', 'Falha na autenticação', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Facilidade para o avaliador preencher credenciais rapidamente com 1 clique
  const preencherDemo = (userDemo: string, passDemo: string) => {
    setUsuario(userDemo);
    setSenha(passDemo);
    setErro(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Cabeçalho da Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 shadow-xl shadow-blue-500/25 text-white font-black text-3xl mb-4">
            b<span className="text-cyan-200">i</span>t
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            bit <span className="text-blue-400 font-semibold">Soluções</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Portal de Solicitações Internas
          </p>
        </div>

        {/* Card do Formulário de Login */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/10">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Acesse sua conta</h2>
            <p className="text-xs text-slate-500 mt-1">
              Informe suas credenciais corporativas para acessar o sistema.
            </p>
          </div>

          {erro && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
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
                  placeholder="Seu usuário (ex: admin ou joao.silva)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
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
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha corporativa"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Atalho de Credenciais de Demonstração para o Avaliador */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Contas de demonstração (1 clique para testar):</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => preencherDemo('admin', 'admin123')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <div className="font-semibold text-slate-800">Admin (TI)</div>
                <div className="text-[11px] text-slate-500">admin / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => preencherDemo('joao.silva', 'senha123')}
                className="p-2 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <div className="font-semibold text-slate-800">Colaborador (RH)</div>
                <div className="text-[11px] text-slate-500">joao.silva / senha123</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 bit Soluções. Avaliação Técnica Desenvolvedor(a) Júnior.
        </p>
      </div>
    </div>
  );
};

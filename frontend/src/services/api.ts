import axios from 'axios';
import {
  User,
  Solicitacao,
  SolicitacaoCreateInput,
  SolicitacaoUpdateInput,
  SolicitacaoFiltros,
  SolicitacaoHistorico,
  DashboardMetrics,
  StatusSolicitacao
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para injetar o token JWT no cabeçalho das requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bit_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para redirecionamento automático caso a sessão expire (HTTP 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bit_token');
      localStorage.removeItem('bit_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (usuario: string, senha: string): Promise<{ token: string; usuario: User }> => {
    const res = await api.post('/auth/login', { usuario, senha });
    return res.data.dados;
  },
  me: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.dados;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};

export const solicitacoesApi = {
  listar: async (filtros?: SolicitacaoFiltros): Promise<Solicitacao[]> => {
    const params: Record<string, string> = {};
    if (filtros?.data_inicio) params.data_inicio = filtros.data_inicio;
    if (filtros?.data_fim) params.data_fim = filtros.data_fim;
    if (filtros?.categoria) params.categoria = filtros.categoria;
    if (filtros?.status) params.status = filtros.status;
    if (filtros?.titulo) params.titulo = filtros.titulo;

    const res = await api.get('/solicitacoes', { params });
    return res.data.dados;
  },

  obterPorId: async (id: number): Promise<{ solicitacao: Solicitacao; historico: SolicitacaoHistorico[] }> => {
    const res = await api.get(`/solicitacoes/${id}`);
    return {
      solicitacao: res.data.dados,
      historico: res.data.historico
    };
  },

  criar: async (dados: SolicitacaoCreateInput): Promise<Solicitacao> => {
    const res = await api.post('/solicitacoes', dados);
    return res.data.dados;
  },

  editar: async (id: number, dados: SolicitacaoUpdateInput): Promise<Solicitacao> => {
    const res = await api.put(`/solicitacoes/${id}`, dados);
    return res.data.dados;
  },

  excluir: async (id: number): Promise<void> => {
    await api.delete(`/solicitacoes/${id}`);
  },

  alterarStatus: async (id: number, status: StatusSolicitacao, comentario?: string): Promise<Solicitacao> => {
    const res = await api.patch(`/solicitacoes/${id}/status`, { status, comentario });
    return res.data.dados;
  }
};

export const dashboardApi = {
  obterMetricas: async (): Promise<DashboardMetrics> => {
    const res = await api.get('/dashboard/metricas');
    return res.data.dados;
  }
};

export const categoriasApi = {
  listar: async (): Promise<Array<{ id: number; nome: string; descricao?: string }>> => {
    const res = await api.get('/categorias');
    return res.data.dados;
  }
};

export default api;

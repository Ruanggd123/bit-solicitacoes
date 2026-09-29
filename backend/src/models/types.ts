export type UserRole = 'administrador' | 'gestor' | 'colaborador';

export interface User {
  id: number;
  nome: string;
  usuario: string;
  senha_hash: string;
  departamento: string;
  perfil: UserRole;
  criado_em?: string;
}

export type UserDTO = Omit<User, 'senha_hash'>;

export interface AuthPayload {
  id: number;
  usuario: string;
  nome: string;
  departamento: string;
  perfil: UserRole;
}

export type StatusSolicitacao = 'Aberto' | 'Em Atendimento' | 'Concluído';

export type CategoriaSolicitacao = 'TI' | 'RH' | 'Compras' | 'Financeiro' | 'Infraestrutura' | string;

export interface Solicitacao {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaSolicitacao;
  status: StatusSolicitacao;
  usuario_id: number;
  data_abertura: string;
  data_atualizacao: string;
  data_conclusao?: string | null;
  observacoes?: string | null;
  // Campos agregados de JOIN com a tabela usuarios:
  solicitante_nome?: string;
  solicitante_departamento?: string;
}

export interface SolicitacaoCreateInput {
  titulo: string;
  descricao: string;
  categoria: CategoriaSolicitacao;
}

export interface SolicitacaoUpdateInput {
  titulo?: string;
  descricao?: string;
  categoria?: CategoriaSolicitacao;
}

export interface SolicitacaoStatusUpdateInput {
  status: StatusSolicitacao;
  comentario?: string;
}

export interface SolicitacaoFiltros {
  data_inicio?: string;
  data_fim?: string;
  categoria?: string;
  status?: StatusSolicitacao;
  titulo?: string;
}

export interface SolicitacaoHistorico {
  id: number;
  solicitacao_id: number;
  usuario_id: number;
  status_anterior?: string | null;
  novo_status: string;
  comentario?: string | null;
  data_registro: string;
  // Campos de JOIN com usuarios:
  responsavel_nome?: string;
  responsavel_departamento?: string;
}

export interface DashboardMetrics {
  total: number;
  abertas: number;
  em_atendimento: number;
  concluidas: number;
  por_categoria?: Array<{ categoria: string; total: number }>;
}

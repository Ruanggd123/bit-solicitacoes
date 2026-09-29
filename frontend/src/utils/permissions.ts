import { User, Solicitacao } from '../types';

/**
 * Valida de forma centralizada se o usuário autenticado possui permissão
 * para editar ou excluir uma solicitação (Apenas status Aberto + Criador ou Admin/Gestor).
 */
export const canUserManageSolicitacao = (
  user: User | null,
  solicitacao: Solicitacao
): boolean => {
  if (!user) return false;
  if (solicitacao.status !== 'Aberto') return false;

  return (
    user.perfil === 'administrador' ||
    user.perfil === 'gestor' ||
    solicitacao.usuario_id === user.id
  );
};

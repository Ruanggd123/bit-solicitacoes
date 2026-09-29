/**
 * Utilitários compartilhados para formatação de dados e datas no padrão pt-BR
 */

export const formatarData = (dataStr?: string | null): string => {
  if (!dataStr) return '—';
  try {
    const d = new Date(dataStr.replace(' ', 'T'));
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch {
    return dataStr;
  }
};

export const formatarDataHora = (dataStr?: string | null): string => {
  if (!dataStr) return '—';
  try {
    const d = new Date(dataStr.replace(' ', 'T'));
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dataStr;
  }
};

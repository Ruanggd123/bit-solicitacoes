import React from 'react';
import { StatusSolicitacao } from '../types';
import { Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusSolicitacao;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, size = 'md' }) => {
  let colorStyles = 'bg-blue-50 text-blue-700 border-blue-200';
  let icon = <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;

  if (status === 'Em Atendimento') {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <PlayCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
  } else if (status === 'Concluído') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    icon = <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
  }

  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs font-medium px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${colorStyles} ${sizeStyles}`}>
      {showIcon && icon}
      <span>{status}</span>
    </span>
  );
};

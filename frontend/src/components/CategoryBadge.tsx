import React from 'react';
import { CategoriaSolicitacao } from '../types';
import { Laptop, Users, ShoppingCart, DollarSign, Building } from 'lucide-react';

interface CategoryBadgeProps {
  categoria: CategoriaSolicitacao;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ categoria, size = 'md' }) => {
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Laptop;

  switch (categoria) {
    case 'TI':
      badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      Icon = Laptop;
      break;
    case 'RH':
      badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
      Icon = Users;
      break;
    case 'Compras':
      badgeColor = 'bg-cyan-50 text-cyan-700 border-cyan-200';
      Icon = ShoppingCart;
      break;
    case 'Financeiro':
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      Icon = DollarSign;
      break;
    case 'Infraestrutura':
      badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
      Icon = Building;
      break;
    default:
      badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
      Icon = Laptop;
  }

  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs font-medium px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border font-medium ${badgeColor} ${sizeStyles}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{categoria}</span>
    </span>
  );
};

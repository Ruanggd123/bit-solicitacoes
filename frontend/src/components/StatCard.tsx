import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'blue' | 'amber' | 'emerald' | 'slate';
  description?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant,
  description,
  onClick
}) => {
  const variantStyles = {
    blue: {
      cardBg: 'hover:border-blue-300',
      iconBg: 'bg-blue-100 text-blue-700',
      badge: 'text-blue-700 bg-blue-50'
    },
    amber: {
      cardBg: 'hover:border-amber-300',
      iconBg: 'bg-amber-100 text-amber-700',
      badge: 'text-amber-700 bg-amber-50'
    },
    emerald: {
      cardBg: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-700',
      badge: 'text-emerald-700 bg-emerald-50'
    },
    slate: {
      cardBg: 'hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      badge: 'text-slate-700 bg-slate-50'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${currentVariant.cardBg}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentVariant.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {description && (
        <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          {description}
        </p>
      )}
    </div>
  );
};

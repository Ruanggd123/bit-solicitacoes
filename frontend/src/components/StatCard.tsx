import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'blue' | 'amber' | 'emerald' | 'slate';
  description?: string;
  badge?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant,
  description,
  badge,
  onClick
}) => {
  const variantStyles = {
    blue: {
      cardBorder: 'hover:border-blue-400',
      topLine: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
      badgeBg: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    amber: {
      cardBorder: 'hover:border-amber-400',
      topLine: 'bg-gradient-to-r from-amber-500 to-orange-500',
      iconBg: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
      badgeBg: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    emerald: {
      cardBorder: 'hover:border-emerald-400',
      topLine: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
      badgeBg: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    slate: {
      cardBorder: 'hover:border-slate-400',
      topLine: 'bg-gradient-to-r from-slate-600 to-slate-800',
      iconBg: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
      badgeBg: 'text-slate-700 bg-slate-100 border-slate-200'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${currentVariant.cardBorder}`}
    >
      {/* Linha de Destaque no Topo */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${currentVariant.topLine}`} />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{value}</span>
            {badge && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentVariant.badgeBg}`}>
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${currentVariant.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {description && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{description}</span>
          {onClick && (
            <span className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Filtrar →
            </span>
          )}
        </div>
      )}
    </div>
  );
};

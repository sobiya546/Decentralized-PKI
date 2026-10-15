import React from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon = ShieldCheck,
  description,
  accentColor = 'cyan', // 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose'
  onClick
}) => {
  const accentStyles = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBox: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBox: 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBox: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]',
      glow: 'group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBox: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]',
      glow: 'group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBox: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]'
    }
  };

  const currentAccent = accentStyles[accentColor] || accentStyles.cyan;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl border ${currentAccent.border} p-5 transition-all duration-300 hover:-translate-y-1 ${currentAccent.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
            {change && (
              <span
                className={`inline-flex items-center text-xs font-semibold ${
                  changeType === 'positive'
                    ? 'text-emerald-400'
                    : changeType === 'negative'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {changeType === 'positive' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-xs text-slate-400 line-clamp-1">{description}</p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${currentAccent.iconBox}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Subtle bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

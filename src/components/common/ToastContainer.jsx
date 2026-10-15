import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-cyan-500/30';
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
        let shadow = 'shadow-[0_10px_30px_rgba(6,182,212,0.15)]';

        if (toast.type === 'success') {
          borderColor = 'border-emerald-500/40';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          shadow = 'shadow-[0_10px_30px_rgba(52,211,153,0.15)]';
        } else if (toast.type === 'warning') {
          borderColor = 'border-amber-500/40';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          shadow = 'shadow-[0_10px_30px_rgba(251,191,36,0.15)]';
        } else if (toast.type === 'error') {
          borderColor = 'border-rose-500/40';
          icon = <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />;
          shadow = 'shadow-[0_10px_30px_rgba(244,63,94,0.15)]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-slate-900/95 backdrop-blur-xl border ${borderColor} ${shadow} text-slate-100 transition-all duration-300 transform translate-y-0`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-wide">{toast.title}</h4>
              <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';

export const Badge = ({ status, variant, children, size = 'md' }) => {
  const value = (status || children || '').toString().toLowerCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  // Certificate Statuses
  if (value === 'valid' || value === 'active' || value === 'approved' || value === 'success') {
    styles = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
  } else if (value === 'expiring soon' || value === 'pending' || value === 'warning' || value === 'medium') {
    styles = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
  } else if (value === 'expired' || value === 'rejected' || value === 'high') {
    styles = 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]';
  } else if (value === 'revoked' || value === 'suspended' || value === 'critical' || value === 'failure' || value === 'blocked') {
    styles = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
  } else if (value === 'info' || value === 'low') {
    styles = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
    dotColor = 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeClasses} ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{children || status}</span>
    </span>
  );
};

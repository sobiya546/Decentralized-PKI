import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowUpRight, CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RecentEventsWidget = ({ auditLogs = [] }) => {
  const navigate = useNavigate();
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" /> Recent Security & PKI Events
          </h3>
          <p className="text-xs text-slate-400">Consensus audit trail & cross-domain actions</p>
        </div>
        <button
          onClick={() => navigate('/audit-logs')}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          <span>All Audit Logs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-800/60 my-2">
        {recentLogs.map((log) => (
          <div
            key={log.id}
            onClick={() => navigate('/audit-logs')}
            className="py-3 flex items-start gap-3 hover:bg-slate-800/30 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <div className="mt-1">
              {log.result === 'Success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : log.result === 'Blocked' ? (
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white tracking-wide font-mono">
                    {log.eventType}
                  </span>
                  <Badge size="sm" status={log.severity}>
                    {log.severity}
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 line-clamp-1 leading-relaxed">
                {log.description}
              </p>

              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                <span className="text-cyan-400 font-medium">{log.organization}</span>
                <span>•</span>
                <span className="truncate max-w-[150px]">{log.targetId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Recorded via Decentralized Ledger</span>
        <span className="font-mono text-cyan-300 font-semibold">{auditLogs.length} events logged</span>
      </div>
    </div>
  );
};

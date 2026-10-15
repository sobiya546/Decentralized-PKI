import React from 'react';
import { Route, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TrustPathFinder = ({
  organizations = [],
  trustRelationships = [],
  sourceId,
  targetId,
  onSourceChange,
  onTargetChange,
  onReset
}) => {
  // Find direct relationship or path
  const directRel = trustRelationships.find(
    (r) =>
      (r.sourceOrgId === sourceId && r.targetOrgId === targetId) ||
      (r.sourceOrgId === targetId && r.targetOrgId === sourceId)
  );

  const sourceOrg = organizations.find((o) => o.id === sourceId);
  const targetOrg = organizations.find((o) => o.id === targetId);

  // Compute transitive path if not direct
  let pathHops = [];
  let isTransitive = false;
  let cumulativeScore = 0;

  if (sourceId && targetId && sourceId !== targetId) {
    if (directRel) {
      pathHops = [
        { from: sourceOrg, to: targetOrg, rel: directRel }
      ];
      cumulativeScore = directRel.trustScore;
    } else {
      // Find 2-hop intermediary
      const intermediary = organizations.find((mid) => {
        if (mid.id === sourceId || mid.id === targetId) return false;
        const link1 = trustRelationships.find(
          (r) =>
            ((r.sourceOrgId === sourceId && r.targetOrgId === mid.id) ||
              (r.sourceOrgId === mid.id && r.targetOrgId === sourceId)) &&
            r.status === 'active'
        );
        const link2 = trustRelationships.find(
          (r) =>
            ((r.sourceOrgId === mid.id && r.targetOrgId === targetId) ||
              (r.sourceOrgId === targetId && r.targetOrgId === mid.id)) &&
            r.status === 'active'
        );
        return link1 && link2;
      });

      if (intermediary) {
        isTransitive = true;
        const link1 = trustRelationships.find(
          (r) =>
            (r.sourceOrgId === sourceId && r.targetOrgId === intermediary.id) ||
            (r.sourceOrgId === intermediary.id && r.targetOrgId === sourceId)
        );
        const link2 = trustRelationships.find(
          (r) =>
            (r.sourceOrgId === intermediary.id && r.targetOrgId === targetId) ||
            (r.sourceOrgId === targetId && r.targetOrgId === intermediary.id)
        );

        pathHops = [
          { from: sourceOrg, to: intermediary, rel: link1 },
          { from: intermediary, to: targetOrg, rel: link2 }
        ];
        cumulativeScore = Math.round((link1.trustScore * link2.trustScore) / 100);
      }
    }
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Cross-Organization Trust Path Analysis</h4>
            <p className="text-xs text-slate-400">Calculate direct and transitive cryptographic trust bridges</p>
          </div>
        </div>

        {(sourceId || targetId) && (
          <button
            onClick={onReset}
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Clear Path
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {/* Source selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Source Organization (Origin)
          </label>
          <select
            value={sourceId}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="">Select Origin Node...</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.shortName})
              </option>
            ))}
          </select>
        </div>

        {/* Target selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Target Organization (Relying Party)
          </label>
          <select
            value={targetId}
            onChange={(e) => onTargetChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="">Select Target Node...</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id} disabled={org.id === sourceId}>
                {org.name} ({org.shortName})
              </option>
            ))}
          </select>
        </div>

        {/* Path Status Result */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-center">
          {sourceId && targetId ? (
            pathHops.length > 0 ? (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Trust Path Verified
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{cumulativeScore}% Score</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isTransitive ? 'Multi-hop Transitive Bridge' : 'Direct Cryptographic Edge'}
                </p>
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> No Direct or Transitive Path
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Requires bilateral federation agreement</p>
              </div>
            )
          ) : (
            <span className="text-xs text-slate-500 italic">Select source and target nodes to inspect trust path</span>
          )}
        </div>
      </div>

      {/* Path Breadcrumb Visualization */}
      {pathHops.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Resolved Path:</span>
          {pathHops.map((hop, idx) => (
            <React.Fragment key={idx}>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium shrink-0">
                {hop.from?.shortName}
              </span>
              <div className="flex items-center gap-1 text-slate-500 shrink-0">
                <span className="text-[10px] font-mono text-cyan-400">
                  [{hop.rel?.protocol?.split('-')[0]}]
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              {idx === pathHops.length - 1 && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium shrink-0">
                  {hop.to?.shortName}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

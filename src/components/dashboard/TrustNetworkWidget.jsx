import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrustNetworkWidget = () => {
  const navigate = useNavigate();
  const { organizations, trustRelationships } = useApp();

  const activeRels = trustRelationships.filter((r) => r.status === 'active');
  const pendingRels = trustRelationships.filter((r) => r.status === 'pending');
  const suspendedRels = trustRelationships.filter((r) => r.status === 'suspended');

  // Compute 5 node coordinates in a circle
  const orgCount = organizations.length;
  const radius = 90;
  const centerX = 160;
  const centerY = 120;

  const nodePositions = organizations.map((org, index) => {
    const angle = (index * 2 * Math.PI) / orgCount - Math.PI / 2;
    return {
      ...org,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" /> Decentralized Trust Mesh
          </h3>
          <p className="text-xs text-slate-400">Consensus topology & cross-organization bridges</p>
        </div>
        <button
          onClick={() => navigate('/trust-network')}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          <span>Full Visualizer</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="relative h-60 my-2 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800/50 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />

        <svg className="w-full h-full max-w-sm" viewBox="0 0 320 240">
          {/* Edges */}
          {trustRelationships.map((rel) => {
            const source = nodePositions.find((n) => n.id === rel.sourceOrgId);
            const target = nodePositions.find((n) => n.id === rel.targetOrgId);
            if (!source || !target) return null;

            let strokeColor = '#06b6d4'; // Active
            let strokeDash = '';
            if (rel.status === 'pending') {
              strokeColor = '#f59e0b';
              strokeDash = '4 4';
            } else if (rel.status === 'suspended') {
              strokeColor = '#f43f5e';
              strokeDash = '2 4';
            }

            return (
              <line
                key={rel.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={strokeColor}
                strokeWidth={rel.status === 'active' ? '2' : '1.5'}
                strokeDasharray={strokeDash}
                opacity={0.65}
              />
            );
          })}

          {/* Center Hub Indicator */}
          <circle
            cx={centerX}
            cy={centerY}
            r="16"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          <text
            x={centerX}
            y={centerY + 3}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="7"
            fontFamily="monospace"
            fontWeight="bold"
          >
            BFT-MESH
          </text>

          {/* Nodes */}
          {nodePositions.map((node) => {
            const isSuspended = node.trustStatus === 'suspended';
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => navigate('/trust-network')}
              >
                {/* Glow ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  fill="#090e1a"
                  stroke={isSuspended ? '#f43f5e' : '#06b6d4'}
                  strokeWidth="2"
                  className={isSuspended ? '' : 'shadow-[0_0_12px_rgba(6,182,212,0.6)]'}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill={isSuspended ? '#881337' : '#083344'}
                />
                <text
                  x={node.x}
                  y={node.y + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {node.shortName?.slice(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating live badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-[10px] text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{organizations.length} Trust Anchors</span>
        </div>
      </div>

      {/* Relationship Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
        <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Active</p>
          <p className="text-base font-extrabold text-cyan-400 font-mono mt-0.5">{activeRels.length}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Pending</p>
          <p className="text-base font-extrabold text-amber-400 font-mono mt-0.5">{pendingRels.length}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Suspended</p>
          <p className="text-base font-extrabold text-rose-400 font-mono mt-0.5">{suspendedRels.length}</p>
        </div>
      </div>
    </div>
  );
};

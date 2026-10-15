import React, { useState } from 'react';
import {
  Network,
  Route,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustGraph } from '../components/network/TrustGraph';
import { NodeDetailsPanel } from '../components/network/NodeDetailsPanel';
import { TrustPathFinder } from '../components/network/TrustPathFinder';

export const TrustNetworkPage = () => {
  const { organizations, trustRelationships } = useApp();

  const [selectedOrg, setSelectedOrg] = useState(organizations[0] || null);
  const [highlightSourceId, setHighlightSourceId] = useState('');
  const [highlightTargetId, setHighlightTargetId] = useState('');

  const activeRels = trustRelationships.filter((r) => r.status === 'active');
  const pendingRels = trustRelationships.filter((r) => r.status === 'pending');
  const suspendedRels = trustRelationships.filter((r) => r.status === 'suspended');

  const handleSelectOrgFromGraph = (org) => {
    setSelectedOrg(org);
  };

  const handleResetPath = () => {
    setHighlightSourceId('');
    setHighlightTargetId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Network className="w-7 h-7 text-cyan-400" />
            <span>Decentralized Trust Network Topology</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Interactive multi-party trust fabric visualization, consensus edges, and transitive delegation path evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-mono">Consensus Mesh: 100% Peer Convergence</span>
          </div>
        </div>
      </div>

      {/* Path Finder Bar */}
      <TrustPathFinder
        organizations={organizations}
        trustRelationships={trustRelationships}
        sourceId={highlightSourceId}
        targetId={highlightTargetId}
        onSourceChange={setHighlightSourceId}
        onTargetChange={setHighlightTargetId}
        onReset={handleResetPath}
      />

      {/* Main Graph & Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Canvas */}
        <div className={selectedOrg ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <TrustGraph
            organizations={organizations}
            trustRelationships={trustRelationships}
            onSelectOrg={handleSelectOrgFromGraph}
            selectedOrgId={selectedOrg?.id}
            highlightSourceId={highlightSourceId}
            highlightTargetId={highlightTargetId}
          />

          {/* Quick instructions bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Click any node to inspect organization identity and trust connections.</span>
              </span>
              <span>•</span>
              <span>Drag nodes to reorganize topology layout.</span>
            </div>
            <div className="font-mono text-cyan-400">
              {activeRels.length} Active / {pendingRels.length} Pending / {suspendedRels.length} Suspended Bridges
            </div>
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        {selectedOrg && (
          <div className="lg:col-span-4">
            <NodeDetailsPanel
              org={selectedOrg}
              onClose={() => setSelectedOrg(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

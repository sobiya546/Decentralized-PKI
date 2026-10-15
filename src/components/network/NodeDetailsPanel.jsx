import React, { useState } from 'react';
import {
  Building2,
  Shield,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Server,
  Lock,
  Globe,
  Mail,
  MapPin,
  X
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const NodeDetailsPanel = ({ org, onClose }) => {
  const { trustRelationships, organizations, updateOrganizationTrust, switchActiveOrg, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!org) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied', 'Fingerprint copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  // Find relationships for this org
  const orgRelationships = trustRelationships.filter(
    (r) => r.sourceOrgId === org.id || r.targetOrgId === org.id
  );

  return (
    <div className="w-full lg:w-96 rounded-2xl bg-slate-900/95 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-md">
            {org.shortName?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-base font-bold text-white leading-tight">{org.name}</h4>
            <span className="text-xs text-cyan-400 font-mono">{org.id}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Trust Score & Status Banner */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Trust Score</p>
          <p className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{org.trustScore}%</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Consensus Status</p>
          <div className="mt-1">
            <Badge status={org.trustStatus} size="sm">
              {org.trustStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Globe className="w-3.5 h-3.5" /> Domain
          </span>
          <span className="font-mono text-cyan-300">{org.domain}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Server className="w-3.5 h-3.5" /> Validator Nodes
          </span>
          <span className="font-mono">{org.nodesCount} active</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5" /> Key Algorithm
          </span>
          <span className="font-mono text-slate-200">{org.algorithm}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5" /> Location
          </span>
          <span className="text-slate-200">{org.location}</span>
        </div>
      </div>

      {/* Public Key Fingerprint Box */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span>Root Public Key Fingerprint</span>
          <button
            onClick={() => handleCopy(org.fingerprint)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 break-all leading-relaxed">
          {org.fingerprint}
        </div>
      </div>

      {/* Connected Trust Relationships */}
      <div>
        <p className="text-xs font-bold text-white mb-2 flex items-center justify-between">
          <span>Trust Connections ({orgRelationships.length})</span>
        </p>
        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
          {orgRelationships.map((rel) => {
            const peerId = rel.sourceOrgId === org.id ? rel.targetOrgId : rel.sourceOrgId;
            const peerOrg = organizations.find((o) => o.id === peerId);

            return (
              <div
                key={rel.id}
                className="p-2 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium truncate max-w-[130px]">
                    {peerOrg?.shortName || peerId}
                  </span>
                  <Badge size="sm" status={rel.status}>
                    {rel.status}
                  </Badge>
                </div>
                <span className="font-mono font-bold text-cyan-400 text-[11px]">
                  {rel.trustScore}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <button
          onClick={() => switchActiveOrg(org.id)}
          className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          Switch Active Context to {org.shortName}
        </button>

        <div className="flex gap-2">
          {org.trustStatus !== 'active' ? (
            <button
              onClick={() => updateOrganizationTrust(org.id, 'active')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
            >
              Approve Trust
            </button>
          ) : (
            <button
              onClick={() => updateOrganizationTrust(org.id, 'suspended')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
            >
              Suspend Node
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

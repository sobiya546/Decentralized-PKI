import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Share2,
  Award,
  Network,
  ShieldCheck,
  FileText,
  Settings,
  Lock,
  Cpu,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Organizations', path: '/organizations', icon: Building2 },
  { name: 'Identity Federation', path: '/federation', icon: Share2 },
  { name: 'Certificates', path: '/certificates', icon: Award },
  { name: 'Trust Network', path: '/trust-network', icon: Network },
  { name: 'Verify Certificate', path: '/verify', icon: ShieldCheck },
  { name: 'Audit Logs', path: '/audit-logs', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { organizations, certificates, activeOrg } = useApp();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">NexDPKI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Decentralized PKI Fabric</p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Banner */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Anchor</p>
            <p className="text-xs font-semibold text-cyan-200 truncate">{activeOrg.name}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
              </NavLink>
            );
          })}
        </nav>

        {/* Network Health / Node Consensus Indicator */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">Consensus Mesh</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Optimal
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Peer Quorum:</span>
              <span className="font-mono text-slate-200">{organizations.length}/{organizations.length} Nodes</span>
            </div>
            <div className="flex justify-between">
              <span>Active Certs:</span>
              <span className="font-mono text-cyan-300">{certificates.filter(c => c.status === 'Valid').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Latency:</span>
              <span className="font-mono text-emerald-300">14 ms</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>BFT-MESH #1,849,204</span>
            <span className="text-cyan-400">100% Sync</span>
          </div>
        </div>
      </aside>
    </>
  );
};

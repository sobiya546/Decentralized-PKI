import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Building,
  Bell,
  Shield,
  Palette,
  Server,
  RotateCcw,
  Download,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToJSON } from '../utils/exportUtils';

export const SettingsPage = () => {
  const {
    currentUser,
    setCurrentUser,
    organizations,
    activeOrgId,
    switchActiveOrg,
    resetAllData,
    certificates,
    federatedIdentities,
    trustRelationships,
    auditLogs,
    addToast
  } = useApp();

  const [userName, setUserName] = useState(currentUser.name);
  const [userRole, setUserRole] = useState(currentUser.role);
  const [userEmail, setUserEmail] = useState(currentUser.email);

  // Preference toggles
  const [notifExpiry, setNotifExpiry] = useState(true);
  const [notifRevocation, setNotifRevocation] = useState(true);
  const [notifFederation, setNotifFederation] = useState(true);
  const [notifConsensus, setNotifConsensus] = useState(false);

  // Security preferences
  const [defaultAlgorithm, setDefaultAlgorithm] = useState('Ed25519-DPKI');
  const [consensusMode, setConsensusMode] = useState('BFT-Mesh (Byzantine Fault Tolerant)');
  const [crlInterval, setCrlInterval] = useState('15 Minutes (High Assurance)');
  const [strictMutualTrust, setStrictMutualTrust] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name: userName,
      role: userRole,
      email: userEmail
    }));
    addToast('Profile Updated', 'Security identity profile saved successfully.', 'success');
  };

  const handleExportFullBackup = () => {
    const backupData = {
      backupTimestamp: new Date().toISOString(),
      version: 'NexDPKI-v2.4',
      organizations,
      trustRelationships,
      federatedIdentities,
      certificates,
      auditLogs,
      activeOrgId,
      currentUser
    };
    exportToJSON(`nexdpki_full_state_backup_${new Date().toISOString().slice(0, 10)}`, backupData);
    addToast('Backup Exported', 'Full application state backup downloaded as JSON', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-cyan-400" />
          <span>Platform Settings & Node Configurations</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Manage identity security profiles, decentralized PKI preferences, consensus protocol settings, and API connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Identity Profile */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <User className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Active User Profile</h3>
              <p className="text-xs text-slate-400">Identity authority & clearance</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Official Security Role
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Identity Principal / Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Clearance:</span>
              <span className="font-semibold text-cyan-300 font-mono">{currentUser.clearanceLevel}</span>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Active Organization Switcher & Node Context */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Active Organization Anchor</h3>
              <p className="text-xs text-slate-400">Contextual trust authority node</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Select Operating Identity Provider
              </label>
              <select
                value={activeOrgId}
                onChange={(e) => switchActiveOrg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-xs sm:text-sm text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-semibold"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.shortName}) - {org.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Domain:</span>
                <span className="font-mono text-cyan-300">{organizations.find((o) => o.id === activeOrgId)?.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nodes in Cluster:</span>
                <span className="font-mono text-white">{organizations.find((o) => o.id === activeOrgId)?.nodesCount} nodes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consensus Algorithm:</span>
                <span className="font-mono text-white">{organizations.find((o) => o.id === activeOrgId)?.algorithm}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Interface Theme
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-between">
                  <span>Cyber Navy (Active)</span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 text-slate-500 border border-slate-800 flex items-center justify-between opacity-60 cursor-not-allowed">
                  <span>High Contrast (Pro)</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Cryptographic Preferences */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Shield className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Cryptographic & DPKI Protocol Settings</h3>
            <p className="text-xs text-slate-400">Key sizes, ledger consensus, and revocation sync parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Default Key Algorithm
            </label>
            <select
              value={defaultAlgorithm}
              onChange={(e) => {
                setDefaultAlgorithm(e.target.value);
                addToast('Preference Saved', `Default key algorithm set to ${e.target.value}`, 'info');
              }}
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
            >
              <option value="Ed25519-DPKI">Ed25519-DPKI (High Speed, Post-Quantum)</option>
              <option value="RSA-4096-PSS">RSA-4096-PSS (Legacy Enterprise)</option>
              <option value="ECDSA-P384">ECDSA-P384 (NIST Compliant)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Consensus Protocol Engine
            </label>
            <select
              value={consensusMode}
              onChange={(e) => {
                setConsensusMode(e.target.value);
                addToast('Consensus Engine', `Mode changed to ${e.target.value}`, 'info');
              }}
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="BFT-Mesh (Byzantine Fault Tolerant)">BFT-Mesh (Byzantine Fault Tolerant)</option>
              <option value="Federated Proof-of-Authority">Federated Proof-of-Authority (PoA)</option>
              <option value="Sovereign Multi-Party Raft">Sovereign Multi-Party Raft</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              CRL & OCSP Synchronization
            </label>
            <select
              value={crlInterval}
              onChange={(e) => {
                setCrlInterval(e.target.value);
                addToast('CRL Sync Interval', `Interval set to ${e.target.value}`, 'info');
              }}
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="15 Minutes (High Assurance)">15 Minutes (High Assurance)</option>
              <option value="1 Hour (Standard)">1 Hour (Standard)</option>
              <option value="6 Hours (Low Bandwidth)">6 Hours (Low Bandwidth)</option>
            </select>
          </div>
        </div>

        {/* Notification preferences checkboxes */}
        <div className="pt-3 border-t border-slate-800/80">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Security Event Notification Triggers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <input
                type="checkbox"
                checked={notifExpiry}
                onChange={(e) => setNotifExpiry(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span className="text-slate-300">Certificate Expiry Warnings</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <input
                type="checkbox"
                checked={notifRevocation}
                onChange={(e) => setNotifRevocation(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span className="text-slate-300">Revocation Broadcasts</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <input
                type="checkbox"
                checked={notifFederation}
                onChange={(e) => setNotifFederation(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span className="text-slate-300">Identity Federation Claims</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <input
                type="checkbox"
                checked={notifConsensus}
                onChange={(e) => setNotifConsensus(e.target.checked)}
                className="rounded accent-cyan-500"
              />
              <span className="text-slate-300">Consensus Round Alerts</span>
            </label>
          </div>
        </div>
      </div>

      {/* API Connection Status Placeholder */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Consortium API Gateway & Peer Node Status</h3>
              <p className="text-xs text-slate-400">Decentralized endpoint telemetry and mock backend connectors</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational (Mock Engine)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Primary Peer URL</span>
            <p className="text-cyan-300 font-mono mt-0.5">wss://pki-mesh-01.consortium.net:8443</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Consensus Round Time</span>
            <p className="text-white font-mono mt-0.5">420 ms (BFT Quorum)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Active API Gateway</span>
            <p className="text-emerald-400 font-mono mt-0.5">REST / gRPC / JSON-RPC v2.4</p>
          </div>
        </div>
      </div>

      {/* Data Management & State Export */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Data Management & State Export</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset demo data to initial factory state or download a full JSON snapshot of all entities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportFullBackup}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export State (JSON)</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all organizations, certificates, and federations to factory defaults?')) {
                resetAllData();
              }
            }}
            className="py-2 px-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

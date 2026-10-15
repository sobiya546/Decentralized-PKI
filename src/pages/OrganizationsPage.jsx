import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Server,
  Lock,
  Globe,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { formatDate } from '../utils/cryptoUtils';

export const OrganizationsPage = () => {
  const {
    organizations,
    registerOrganization,
    updateOrganizationTrust,
    switchActiveOrg,
    activeOrgId,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(null);

  // New Organization Form State
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    shortName: '',
    domain: '',
    type: 'Consortium Trust Anchor',
    contactEmail: '',
    location: '',
    algorithm: 'Ed25519-DPKI',
    nodesCount: '4',
    description: ''
  });

  const handleCopy = (fingerprint, id) => {
    navigator.clipboard.writeText(fingerprint);
    setCopiedFingerprint(id);
    addToast('Copied', 'Public key fingerprint copied to clipboard', 'info');
    setTimeout(() => setCopiedFingerprint(null), 2000);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newOrgForm.name.trim() || !newOrgForm.domain.trim()) {
      addToast('Validation Error', 'Organization name and domain are required.', 'warning');
      return;
    }

    const created = registerOrganization(newOrgForm);
    setIsRegisterModalOpen(false);
    setNewOrgForm({
      name: '',
      shortName: '',
      domain: '',
      type: 'Consortium Trust Anchor',
      contactEmail: '',
      location: '',
      algorithm: 'Ed25519-DPKI',
      nodesCount: '4',
      description: ''
    });
  };

  const handleExportCSV = () => {
    const rows = organizations.map((o) => ({
      ID: o.id,
      Name: o.name,
      ShortName: o.shortName,
      Domain: o.domain,
      Type: o.type,
      TrustStatus: o.trustStatus,
      TrustScore: `${o.trustScore}%`,
      Algorithm: o.algorithm,
      NodesCount: o.nodesCount,
      RegistrationDate: o.registrationDate,
      Fingerprint: o.fingerprint
    }));
    exportToCSV('nexdpki_organizations', rows);
    addToast('Exported', 'Organization directory exported to CSV', 'success');
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesFilter = statusFilter === 'all' || org.trustStatus === statusFilter;
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.domain.toLowerCase().includes(search.toLowerCase()) ||
      org.id.toLowerCase().includes(search.toLowerCase()) ||
      org.fingerprint.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-cyan-400" />
            <span>Participating Organizations</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Decentralized consortium trust anchors and cross-organization root identity providers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register Organization</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations by name, domain, ID, or public key fingerprint..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'active', 'pending', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize text-xs font-semibold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Domain & ID</th>
                <th className="py-3.5 px-4">Public Key Fingerprint</th>
                <th className="py-3.5 px-4">Trust Status</th>
                <th className="py-3.5 px-4">Consensus Score</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOrgs.map((org) => {
                const isActiveContext = org.id === activeOrgId;
                return (
                  <tr
                    key={org.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrg(org)}
                  >
                    {/* Name & Type */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0">
                          {org.shortName?.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                              {org.name}
                            </span>
                            {isActiveContext && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-semibold border border-cyan-500/30">
                                Active Context
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{org.type}</span>
                        </div>
                      </div>
                    </td>

                    {/* Domain & ID */}
                    <td className="py-4 px-4 font-mono">
                      <span className="text-cyan-400 font-semibold">{org.domain}</span>
                      <div className="text-[10px] text-slate-500">{org.id}</div>
                    </td>

                    {/* Public Key Fingerprint */}
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2 max-w-xs">
                        <span className="truncate text-slate-300 text-[11px] bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                          {org.fingerprint}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(org.fingerprint, org.id);
                          }}
                          className="p-1 text-slate-400 hover:text-cyan-400 rounded transition-colors shrink-0"
                          title="Copy fingerprint"
                        >
                          {copiedFingerprint === org.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Trust Status */}
                    <td className="py-4 px-4">
                      <Badge status={org.trustStatus}>{org.trustStatus.toUpperCase()}</Badge>
                    </td>

                    {/* Consensus Score */}
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${org.trustScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-white text-xs">{org.trustScore}%</span>
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(org.registrationDate)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrg(org)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        >
                          Details
                        </button>

                        {org.trustStatus !== 'active' ? (
                          <button
                            onClick={() => updateOrganizationTrust(org.id, 'active')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => updateOrganizationTrust(org.id, 'suspended')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Details Modal */}
      {selectedOrg && (
        <Modal
          isOpen={!!selectedOrg}
          onClose={() => setSelectedOrg(null)}
          title={selectedOrg.name}
          subtitle={`Organization Node: ${selectedOrg.id}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => {
                  switchActiveOrg(selectedOrg.id);
                  setSelectedOrg(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold transition-colors"
              >
                Switch Active Context to this Org
              </button>

              <div className="flex items-center gap-2">
                {selectedOrg.trustStatus === 'active' ? (
                  <button
                    onClick={() => {
                      updateOrganizationTrust(selectedOrg.id, 'suspended');
                      setSelectedOrg(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold"
                  >
                    Suspend Trust
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateOrganizationTrust(selectedOrg.id, 'active');
                      setSelectedOrg(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold"
                  >
                    Restore Trust
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Overview cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Trust Status</span>
                <div className="mt-1">
                  <Badge status={selectedOrg.trustStatus}>{selectedOrg.trustStatus.toUpperCase()}</Badge>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Consensus Score</span>
                <p className="text-base font-extrabold text-cyan-300 font-mono mt-0.5">{selectedOrg.trustScore}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Nodes / Weight</span>
                <p className="text-base font-extrabold text-white font-mono mt-0.5">{selectedOrg.nodesCount} ({selectedOrg.consensusWeight})</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Algorithm</span>
                <p className="text-xs font-bold text-slate-200 font-mono mt-1">{selectedOrg.algorithm}</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              {selectedOrg.description}
            </p>

            {/* Key Information */}
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Consortium Domain:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedOrg.domain}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Security Contact:</span>
                <span className="font-mono text-slate-200">{selectedOrg.contactEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Jurisdiction / Location:</span>
                <span className="text-slate-200">{selectedOrg.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Onboarded Timestamp:</span>
                <span className="font-mono text-slate-400">{new Date(selectedOrg.registrationDate).toUTCString()}</span>
              </div>
            </div>

            {/* Public Key Fingerprint box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 font-semibold">Decentralized PKI Fingerprint (SHA-256)</span>
                <button
                  onClick={() => handleCopy(selectedOrg.fingerprint, 'modal')}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all leading-relaxed">
                {selectedOrg.fingerprint}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Register Organization Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New Consortium Organization"
        subtitle="Provision a decentralized PKI root anchor into the identity federation mesh"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Organization Full Name *
              </label>
              <input
                type="text"
                required
                value={newOrgForm.name}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                placeholder="e.g. Apex Quantum Institute"
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Short Name / Code *
              </label>
              <input
                type="text"
                required
                value={newOrgForm.shortName}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, shortName: e.target.value })}
                placeholder="e.g. AQI"
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Primary Domain *
              </label>
              <input
                type="text"
                required
                value={newOrgForm.domain}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, domain: e.target.value })}
                placeholder="e.g. aqi.edu or consortium.net"
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Consortium Type
              </label>
              <select
                value={newOrgForm.type}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              >
                <option value="Academic & Research Trust Anchor">Academic & Research Trust Anchor</option>
                <option value="Fintech & Clearing Consortium">Fintech & Clearing Consortium</option>
                <option value="Mesh Infrastructure & Cloud Fabric">Mesh Infrastructure & Cloud Fabric</option>
                <option value="Sovereign Public Sector Authority">Sovereign Public Sector Authority</option>
                <option value="Healthcare & Bio-Identity Provider">Healthcare & Bio-Identity Provider</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Root Cryptographic Algorithm
              </label>
              <select
                value={newOrgForm.algorithm}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, algorithm: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
              >
                <option value="Ed25519-DPKI">Ed25519-DPKI (Recommended)</option>
                <option value="RSA-4096-PSS">RSA-4096-PSS</option>
                <option value="ECDSA-P384">ECDSA-P384</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Validator Nodes Count
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={newOrgForm.nodesCount}
                onChange={(e) => setNewOrgForm({ ...newOrgForm, nodesCount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description / Policy Scope
            </label>
            <textarea
              rows="3"
              value={newOrgForm.description}
              onChange={(e) => setNewOrgForm({ ...newOrgForm, description: e.target.value })}
              placeholder="Provide context regarding the organization's identity federation policies and cryptographic assurance requirements..."
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              A 256-bit decentralized root key pair and SHA-256 fingerprint will be automatically generated upon submission.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Provision Anchor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

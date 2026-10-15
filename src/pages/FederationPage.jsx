import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Download,
  Copy,
  Check,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { formatDate } from '../utils/cryptoUtils';

export const FederationPage = () => {
  const {
    federatedIdentities,
    organizations,
    createFederationRequest,
    updateFederationStatus,
    activeOrgId,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedToken, setSelectedToken] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // New Request Form
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    title: '',
    homeOrgId: activeOrgId || 'ORG-APEX-01',
    targetOrgId: 'ORG-NOVA-02',
    requestedScope: 'Research-Cluster:Access, Telemetry:Read',
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!requestForm.name.trim() || !requestForm.email.trim()) {
      addToast('Validation Error', 'Subject name and email are required.', 'warning');
      return;
    }
    if (requestForm.homeOrgId === requestForm.targetOrgId) {
      addToast('Validation Error', 'Home organization and Target organization must be distinct.', 'warning');
      return;
    }

    createFederationRequest(requestForm);
    setIsRequestModalOpen(false);
    setRequestForm({
      name: '',
      email: '',
      title: '',
      homeOrgId: activeOrgId,
      targetOrgId: organizations.find((o) => o.id !== activeOrgId)?.id || 'ORG-NOVA-02',
      requestedScope: 'Research-Cluster:Access, Telemetry:Read',
    });
  };

  const handleExportCSV = () => {
    const rows = federatedIdentities.map((f) => {
      const home = organizations.find((o) => o.id === f.homeOrgId)?.name || f.homeOrgId;
      const target = organizations.find((o) => o.id === f.targetOrgId)?.name || f.targetOrgId;
      return {
        IdentityDID: f.id,
        Name: f.name,
        Email: f.email,
        Title: f.title,
        HomeOrganization: home,
        TargetOrganization: target,
        Scope: f.requestedScope,
        Status: f.status,
        VerificationStatus: f.verificationStatus,
        RequestDate: f.requestDate,
        TokenID: f.dpkiTokenId
      };
    });
    exportToCSV('nexdpki_federated_identities', rows);
    addToast('Exported', 'Federated identity directory exported to CSV', 'success');
  };

  const filteredIdentities = federatedIdentities.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.requestedScope.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Share2 className="w-7 h-7 text-cyan-400" />
            <span>Cross-Organization Identity Federation</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Secure bilateral and multi-lateral identity delegations, verifiable claims, and zero-trust handshakes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Federation Request</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search identity DID, subject name, email, or requested scope..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
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

      {/* Federation Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Subject & DID</th>
                <th className="py-3.5 px-4">Home IdP → Relying Target</th>
                <th className="py-3.5 px-4">Requested Scope</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Cryptographic Verification</th>
                <th className="py-3.5 px-4">Requested</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredIdentities.map((item) => {
                const homeOrg = organizations.find((o) => o.id === item.homeOrgId);
                const targetOrg = organizations.find((o) => o.id === item.targetOrgId);

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Subject */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{item.id}</p>
                          <p className="text-[11px] text-slate-400">{item.title}</p>
                        </div>
                      </div>
                    </td>

                    {/* Home vs Target Org Bridge */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                          {homeOrg?.shortName || item.homeOrgId}
                          <span className="text-[9px] text-slate-400 block font-normal uppercase">Home IdP</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-indigo-500/30 text-indigo-300 font-semibold text-[11px]">
                          {targetOrg?.shortName || item.targetOrgId}
                          <span className="text-[9px] text-slate-400 block font-normal uppercase">Relying Party</span>
                        </div>
                      </div>
                    </td>

                    {/* Scope */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-slate-300 text-[11px] bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800 block max-w-xs truncate">
                        {item.requestedScope}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge status={item.status}>{item.status.toUpperCase()}</Badge>
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        {item.status === 'approved' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : item.status === 'rejected' ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs truncate max-w-[160px]">{item.verificationStatus}</span>
                      </div>
                    </td>

                    {/* Requested date */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(item.requestDate)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedToken(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <FileCode className="w-3 h-3 text-cyan-400" />
                          <span>Proof</span>
                        </button>

                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateFederationStatus(item.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateFederationStatus(item.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold"
                            >
                              Reject
                            </button>
                          </>
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

      {/* Verifiable Credential / Token Proof Modal */}
      {selectedToken && (
        <Modal
          isOpen={!!selectedToken}
          onClose={() => setSelectedToken(null)}
          title="Decentralized Identity Claim & Verifiable Proof"
          subtitle={`Token ID: ${selectedToken.dpkiTokenId}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => {
                  const proofData = {
                    '@context': [
                      'https://www.w3.org/2018/credentials/v1',
                      'https://w3id.org/security/suites/ed25519-2020/v1'
                    ],
                    id: selectedToken.dpkiTokenId,
                    type: ['VerifiableCredential', 'FederatedIdentityAttestation'],
                    issuer: selectedToken.homeOrgId,
                    issuanceDate: selectedToken.requestDate,
                    expirationDate: selectedToken.expiryDate,
                    credentialSubject: {
                      id: selectedToken.id,
                      name: selectedToken.name,
                      title: selectedToken.title,
                      scope: selectedToken.requestedScope,
                      targetOrganization: selectedToken.targetOrgId
                    },
                    proof: {
                      type: 'Ed25519Signature2020',
                      created: selectedToken.requestDate,
                      verificationMethod: `${selectedToken.homeOrgId}#key-1`,
                      proofPurpose: 'assertionMethod',
                      proofValue: 'z3t5K...simulatedCryptographicProofSignature'
                    }
                  };
                  exportToJSON(`federation_proof_${selectedToken.name.replace(/\s+/g, '_')}`, proofData);
                  addToast('Exported', 'Verifiable credential saved as JSON', 'success');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Token JSON</span>
              </button>

              <button
                onClick={() => setSelectedToken(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Status</span>
                <div className="mt-0.5">
                  <Badge status={selectedToken.status}>{selectedToken.status.toUpperCase()}</Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Assurance Level</span>
                <p className="text-slate-200 font-mono mt-0.5">{selectedToken.assuranceLevel}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Token ID</span>
                <p className="text-cyan-300 font-mono mt-0.5">{selectedToken.dpkiTokenId}</p>
              </div>
            </div>

            {/* Simulated JSON-LD Verifiable Credential Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-slate-400">
                <span className="font-semibold">W3C Verifiable Credential Data Payload</span>
                <span className="text-[10px] font-mono text-cyan-400">JSON-LD Compliant</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1'
    ],
    id: selectedToken.dpkiTokenId,
    type: ['VerifiableCredential', 'FederatedIdentityAttestation'],
    issuer: selectedToken.homeOrgId,
    issuanceDate: selectedToken.requestDate,
    expirationDate: selectedToken.expiryDate,
    credentialSubject: {
      id: selectedToken.id,
      name: selectedToken.name,
      email: selectedToken.email,
      title: selectedToken.title,
      authorizedScope: selectedToken.requestedScope,
      targetAuthority: selectedToken.targetOrgId
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: selectedToken.requestDate,
      verificationMethod: `${selectedToken.homeOrgId}#key-1`,
      proofPurpose: 'assertionMethod',
      jws: 'eyJhbGciOiJFZERTQSI...dGVkUGtpdjI0'
    }
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </Modal>
      )}

      {/* New Federation Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Initiate Cross-Organization Identity Federation"
        subtitle="Request mutual cryptographic delegation between participating consortium anchors"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Home Organization (IdP) *
              </label>
              <select
                value={requestForm.homeOrgId}
                onChange={(e) => setRequestForm({ ...requestForm, homeOrgId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Target Organization (Relying Party) *
              </label>
              <select
                value={requestForm.targetOrgId}
                onChange={(e) => setRequestForm({ ...requestForm, targetOrgId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              >
                {organizations.map((org) => (
                  <option
                    key={org.id}
                    value={org.id}
                    disabled={org.id === requestForm.homeOrgId}
                  >
                    {org.name} ({org.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Subject Full Name *
              </label>
              <input
                type="text"
                required
                value={requestForm.name}
                onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                placeholder="e.g. Dr. Alexander Thorne"
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Subject Official Email *
              </label>
              <input
                type="email"
                required
                value={requestForm.email}
                onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                placeholder="e.g. a.thorne@domain.edu"
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Professional Role / Title
            </label>
            <input
              type="text"
              value={requestForm.title}
              onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
              placeholder="e.g. Senior Quantum Research Associate"
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Requested Authorization Scopes
            </label>
            <input
              type="text"
              value={requestForm.requestedScope}
              onChange={(e) => setRequestForm({ ...requestForm, requestedScope: e.target.value })}
              placeholder="e.g. Cluster-3:Compute, Telemetry:Read, Sovereign-Audit:Sign"
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Submit Federation Claim
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

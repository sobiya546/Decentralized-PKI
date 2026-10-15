import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Award,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Download,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Calendar,
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { exportToJSON, exportToCSV } from '../utils/exportUtils';
import { formatDate, getDaysRemaining } from '../utils/cryptoUtils';

export const CertificatesPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialStatus = searchParams.get('status') || 'all';

  const {
    certificates,
    organizations,
    issueCertificate,
    revokeCertificate,
    activeOrgId,
    addToast
  } = useApp();

  const [search, setSearch] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [revokingCert, setRevokingCert] = useState(null);
  const [revocationReason, setRevocationReason] = useState('Key Compromise');
  const [copiedFingerprint, setCopiedFingerprint] = useState(null);
  const [copiedPEM, setCopiedPEM] = useState(false);

  // New Certificate Form
  const [newCertForm, setNewCertForm] = useState({
    subject: '',
    subjectCommonName: '',
    subjectType: 'Identity / User',
    issuerOrgId: activeOrgId || 'ORG-APEX-01',
    algorithm: 'Ed25519-DPKI',
    validityDays: 365,
    usage: 'Digital Signature, Federated Authentication, Key Agreement'
  });

  useEffect(() => {
    if (initialQuery) setSearch(initialQuery);
    if (initialStatus) setStatusFilter(initialStatus);
  }, [initialQuery, initialStatus]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedFingerprint(id);
    addToast('Copied', 'Fingerprint copied to clipboard', 'info');
    setTimeout(() => setCopiedFingerprint(null), 2000);
  };

  const handleCopyPEM = (pem) => {
    navigator.clipboard.writeText(pem);
    setCopiedPEM(true);
    addToast('Copied', 'PEM certificate block copied', 'info');
    setTimeout(() => setCopiedPEM(false), 2000);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!newCertForm.subject.trim()) {
      addToast('Validation Error', 'Subject identity/DID is required.', 'warning');
      return;
    }

    const created = issueCertificate(newCertForm);
    setIsIssueModalOpen(false);
    setNewCertForm({
      subject: '',
      subjectCommonName: '',
      subjectType: 'Identity / User',
      issuerOrgId: activeOrgId,
      algorithm: 'Ed25519-DPKI',
      validityDays: 365,
      usage: 'Digital Signature, Federated Authentication, Key Agreement'
    });
  };

  const handleConfirmRevoke = () => {
    if (!revokingCert) return;
    revokeCertificate(revokingCert.id, revocationReason);
    setRevokingCert(null);
    if (selectedCert?.id === revokingCert.id) {
      setSelectedCert(null);
    }
  };

  const handleDownloadJSON = (cert) => {
    const dataToExport = {
      ...cert,
      exportedAt: new Date().toISOString(),
      disclaimer: 'Simulated Decentralized PKI Certificate metadata for demonstration purposes.'
    };
    exportToJSON(`pki_certificate_${cert.id}`, dataToExport);
    addToast('Downloaded', `Certificate ${cert.id} saved as JSON`, 'success');
  };

  const handleExportAllCSV = () => {
    const rows = certificates.map((c) => ({
      CertificateID: c.id,
      Subject: c.subject,
      SubjectCommonName: c.subjectCommonName,
      SubjectType: c.subjectType,
      IssuerOrganization: c.issuerName,
      Algorithm: c.algorithm,
      Status: c.status,
      IssuedDate: c.issuedDate,
      ExpiryDate: c.expiryDate,
      SerialNumber: c.serialNumber,
      Fingerprint: c.fingerprint,
      RevocationReason: c.revocationReason || 'N/A'
    }));
    exportToCSV('nexdpki_certificates', rows);
    addToast('Exported', 'Certificate registry exported to CSV', 'success');
  };

  const filteredCerts = certificates.filter((cert) => {
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    const matchesSearch =
      cert.id.toLowerCase().includes(search.toLowerCase()) ||
      cert.subject.toLowerCase().includes(search.toLowerCase()) ||
      cert.subjectCommonName.toLowerCase().includes(search.toLowerCase()) ||
      cert.issuerName.toLowerCase().includes(search.toLowerCase()) ||
      cert.fingerprint.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-cyan-400" />
            <span>PKI Digital Certificate Management</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Decentralized certificate lifecycle management, simulated X.509 issuance, verification, and revocation broadcast.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAllCSV}
            className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Certificate Issuance</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificates by ID, subject, issuer, or SHA-256 fingerprint..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'Valid', 'Expiring Soon', 'Expired', 'Revoked'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
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

      {/* Certificates Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Certificate ID & Subject</th>
                <th className="py-3.5 px-4">Issuing Authority</th>
                <th className="py-3.5 px-4">Algorithm & Serial</th>
                <th className="py-3.5 px-4">Public Key Fingerprint</th>
                <th className="py-3.5 px-4">Validity Window</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCerts.map((cert) => {
                const daysRemaining = getDaysRemaining(cert.expiryDate);

                return (
                  <tr
                    key={cert.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCert(cert)}
                  >
                    {/* ID & Subject */}
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-mono font-bold text-cyan-300 text-xs block group-hover:text-cyan-200">
                          {cert.id}
                        </span>
                        <p className="font-semibold text-white text-xs mt-0.5">
                          {cert.subjectCommonName}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">
                          {cert.subject}
                        </span>
                      </div>
                    </td>

                    {/* Issuer */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <span>{cert.issuerName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">{cert.issuerOrgId}</span>
                    </td>

                    {/* Algorithm */}
                    <td className="py-4 px-4 font-mono">
                      <span className="text-slate-200 text-xs font-semibold">{cert.algorithm}</span>
                      <span className="text-[10px] text-slate-400 block">S/N: {cert.serialNumber}</span>
                    </td>

                    {/* Fingerprint */}
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2 max-w-xs">
                        <span className="truncate text-slate-300 text-[11px] bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                          {cert.fingerprint}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(cert.fingerprint, cert.id);
                          }}
                          className="p-1 text-slate-400 hover:text-cyan-400 rounded transition-colors shrink-0"
                          title="Copy fingerprint"
                        >
                          {copiedFingerprint === cert.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Validity */}
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400">Exp: {formatDate(cert.expiryDate)}</span>
                        {cert.status === 'Valid' && (
                          <span className="block text-[10px] text-emerald-400 font-sans">
                            {daysRemaining} days remaining
                          </span>
                        )}
                        {cert.status === 'Expiring Soon' && (
                          <span className="block text-[10px] text-amber-400 font-sans font-bold">
                            Expires in {daysRemaining} days!
                          </span>
                        )}
                        {cert.status === 'Expired' && (
                          <span className="block text-[10px] text-orange-400 font-sans font-semibold">
                            Expired
                          </span>
                        )}
                        {cert.status === 'Revoked' && (
                          <span className="block text-[10px] text-rose-400 font-sans font-semibold">
                            Revoked on ledger
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge status={cert.status}>{cert.status}</Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadJSON(cert)}
                          className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Download Certificate JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {cert.status !== 'Revoked' && (
                          <button
                            onClick={() => setRevokingCert(cert)}
                            className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                          >
                            Revoke
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

      {/* Certificate Details Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title={`Certificate: ${selectedCert.id}`}
          subtitle={`Subject: ${selectedCert.subjectCommonName}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => handleDownloadJSON(selectedCert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Metadata JSON</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedCert.status !== 'Revoked' && (
                  <button
                    onClick={() => {
                      setRevokingCert(selectedCert);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold"
                  >
                    Revoke Certificate
                  </button>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Status overview */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Status</span>
                <div className="mt-1">
                  <Badge status={selectedCert.status}>{selectedCert.status}</Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Algorithm</span>
                <p className="text-slate-200 font-mono mt-1 font-bold">{selectedCert.algorithm}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Key Strength</span>
                <p className="text-cyan-300 font-mono mt-1">{selectedCert.keySize}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Serial Number</span>
                <p className="text-slate-300 font-mono mt-1">{selectedCert.serialNumber}</p>
              </div>
            </div>

            {/* X.509 Attributes Breakdown */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Subject Common Name:</span>
                <span className="font-semibold text-white">{selectedCert.subjectCommonName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Subject Identity DID:</span>
                <span className="font-mono text-cyan-300">{selectedCert.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Issuing Organization:</span>
                <span className="font-semibold text-white">{selectedCert.issuerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Authorized Key Usage:</span>
                <span className="font-mono text-slate-300">{selectedCert.usage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Not Valid Before:</span>
                <span className="font-mono text-slate-300">{new Date(selectedCert.issuedDate).toUTCString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Not Valid After:</span>
                <span className="font-mono text-slate-300">{new Date(selectedCert.expiryDate).toUTCString()}</span>
              </div>
              {selectedCert.revocationReason && (
                <div className="flex justify-between py-1 border-b border-slate-800/50 text-rose-300">
                  <span className="text-rose-400 font-bold">Revocation Reason:</span>
                  <span className="font-semibold">{selectedCert.revocationReason}</span>
                </div>
              )}
            </div>

            {/* SHA-256 Fingerprint */}
            <div>
              <div className="flex items-center justify-between mb-1 text-slate-400">
                <span className="font-semibold">Cryptographic SHA-256 Fingerprint</span>
                <button
                  onClick={() => handleCopy(selectedCert.fingerprint, 'modal')}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all leading-relaxed">
                {selectedCert.fingerprint}
              </div>
            </div>

            {/* Mock PEM Certificate Block */}
            <div>
              <div className="flex items-center justify-between mb-1 text-slate-400">
                <span className="font-semibold">Simulated X.509 PEM Certificate</span>
                <button
                  onClick={() => handleCopyPEM(selectedCert.pem)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                >
                  {copiedPEM ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPEM ? 'Copied' : 'Copy PEM'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 max-h-36 overflow-y-auto custom-scrollbar leading-relaxed">
{selectedCert.pem}
              </pre>
            </div>
          </div>
        </Modal>
      )}

      {/* Issue Certificate Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Simulate PKI Certificate Issuance"
        subtitle="Issue a digital certificate and publish attestation to the decentralized PKI ledger"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Issuing Organization Node *
            </label>
            <select
              value={newCertForm.issuerOrgId}
              onChange={(e) => setNewCertForm({ ...newCertForm, issuerOrgId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.shortName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Subject Common Name (CN) *
              </label>
              <input
                type="text"
                required
                value={newCertForm.subjectCommonName}
                onChange={(e) => {
                  const cn = e.target.value;
                  const slug = cn.toLowerCase().replace(/[^a-z0-9]/g, '.');
                  setNewCertForm({
                    ...newCertForm,
                    subjectCommonName: cn,
                    subject: `did:dpki:auth:subject:${slug}`
                  });
                }}
                placeholder="e.g. Dr. Arthur Pendelton"
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Subject Type
              </label>
              <select
                value={newCertForm.subjectType}
                onChange={(e) => setNewCertForm({ ...newCertForm, subjectType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              >
                <option value="Identity / User">Identity / User</option>
                <option value="Service Mesh TLS">Service Mesh TLS Node</option>
                <option value="Signing Authority">Sub-Signing Authority</option>
                <option value="Cross-Domain Bridge">Cross-Domain Bridge</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Subject Decentralized Identifier (DID) *
            </label>
            <input
              type="text"
              required
              value={newCertForm.subject}
              onChange={(e) => setNewCertForm({ ...newCertForm, subject: e.target.value })}
              placeholder="e.g. did:dpki:apex:user:arthur.pendelton"
              className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Cryptographic Algorithm
              </label>
              <select
                value={newCertForm.algorithm}
                onChange={(e) => setNewCertForm({ ...newCertForm, algorithm: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
              >
                <option value="Ed25519-DPKI">Ed25519-DPKI (Post-Quantum Friendly)</option>
                <option value="RSA-4096-PSS">RSA-4096-PSS</option>
                <option value="ECDSA-P384">ECDSA-P384</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Validity Window
              </label>
              <select
                value={newCertForm.validityDays}
                onChange={(e) => setNewCertForm({ ...newCertForm, validityDays: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
              >
                <option value="30">30 Days (Short-lived Mesh)</option>
                <option value="90">90 Days (Automated Rotation)</option>
                <option value="365">1 Year (Standard Identity)</option>
                <option value="730">2 Years (Root Trust Anchor)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Simulated PKI Operation: A 64-character SHA-256 fingerprint and serial number will be generated and signed by the issuing node.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Issue Certificate
            </button>
          </div>
        </form>
      </Modal>

      {/* Revocation Confirmation Dialog */}
      {revokingCert && (
        <Modal
          isOpen={!!revokingCert}
          onClose={() => setRevokingCert(null)}
          title="Revoke Digital Certificate"
          subtitle={`Certificate: ${revokingCert.id}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Irreversible Ledger Broadcast</p>
                <p className="mt-0.5 text-xs text-rose-300 leading-relaxed">
                  Revoking this certificate immediately publishes its serial to the decentralized CRL and marks all cross-organization handshakes invalid.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Select Revocation Reason *
              </label>
              <select
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-xs text-white rounded-xl border border-slate-800 focus:border-rose-500/50 focus:outline-none"
              >
                <option value="Key Compromise">Key Compromise (Suspected Private Key Leak)</option>
                <option value="Affiliation Changed">Affiliation Changed (Subject Left Organization)</option>
                <option value="Superseded">Superseded (Replaced by New Key Pair)</option>
                <option value="Cessation of Operation">Cessation of Operation</option>
                <option value="Administrative Revocation">Administrative Audit Revocation</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRevokingCert(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              >
                Broadcast Revocation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

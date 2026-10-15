import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  Sparkles,
  Lock,
  Building,
  Key,
  Layers,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { exportToJSON } from '../utils/exportUtils';

export const VerifyPage = () => {
  const { certificates, organizations, verifyCertificateDetails, addToast } = useApp();

  const [inputCertId, setInputCertId] = useState('CERT-APEX-USR-8849');
  const [inputIdentityId, setInputIdentityId] = useState('did:dpki:apex:user:elena.rostova');
  const [inputIssuerOrgId, setInputIssuerOrgId] = useState('ORG-APEX-01');

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgressStep, setVerificationProgressStep] = useState(0);
  const [report, setReport] = useState(null);

  // Quick Preset Handlers
  const handleLoadPreset = (certId, identityId, orgId) => {
    setInputCertId(certId);
    setInputIdentityId(identityId);
    setInputIssuerOrgId(orgId);
    setReport(null);
  };

  const handleRunVerification = async (e) => {
    if (e) e.preventDefault();
    if (!inputCertId.trim()) {
      addToast('Input Required', 'Please enter a Certificate ID or Fingerprint.', 'warning');
      return;
    }

    setIsVerifying(true);
    setReport(null);
    setVerificationProgressStep(1);

    // Simulate multi-step cryptographic verification sequence
    setTimeout(() => setVerificationProgressStep(2), 350);
    setTimeout(() => setVerificationProgressStep(3), 700);
    setTimeout(() => setVerificationProgressStep(4), 1050);
    setTimeout(() => setVerificationProgressStep(5), 1400);

    setTimeout(async () => {
      const generatedReport = await verifyCertificateDetails(inputCertId);
      setReport(generatedReport);
      setIsVerifying(false);
      setVerificationProgressStep(0);

      if (generatedReport.verdict === 'VALID') {
        addToast('Verification Passed', 'Certificate and federation trust chain verified.', 'success');
      } else if (generatedReport.verdict === 'WARNING') {
        addToast('Verification Warning', 'Certificate verified but expires soon.', 'warning');
      } else {
        addToast('Verification Failed', 'Certificate is revoked, expired, or untrusted.', 'error');
      }
    }, 1750);
  };

  const handleExportReceipt = () => {
    if (!report) return;
    const receiptData = {
      auditReceiptId: `RCPT-VERIFY-${Date.now().toString().slice(-6)}`,
      timestamp: report.timestamp,
      verifiedQuery: report.searchedQuery,
      verdict: report.verdict,
      checksPerformed: report.checks,
      certificateSnapshot: report.certificate,
      issuerSnapshot: report.issuer,
      disclaimer: 'Decentralized PKI Verification Receipt. Generated via simulated BFT consensus nodes.'
    };
    exportToJSON(`verification_receipt_${report.certificate?.id || 'query'}`, receiptData);
    addToast('Downloaded', 'Verification audit receipt exported as JSON', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-cyan-400" />
          <span>Certificate & Identity Verification Center</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Decentralized verification engine: validates issuer DID documents, cross-domain trust links, real-time CRL consensus, and expiration time-locks.
        </p>
      </div>

      {/* Quick Test Presets Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Scenario Presets (1-Click Test Runs)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() =>
              handleLoadPreset(
                'CERT-APEX-USR-8849',
                'did:dpki:apex:user:elena.rostova',
                'ORG-APEX-01'
              )
            }
            className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                Preset 1: Valid Researcher
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PASS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Apex University Ed25519 Cert</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadPreset(
                'CERT-NOVA-SRV-3310',
                'did:dpki:nova:svc:quantum-mesh-node',
                'ORG-NOVA-02'
              )
            }
            className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-amber-300">
                Preset 2: Expiring Soon
              </span>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                WARN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Nova Labs TLS Service Node</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadPreset(
                'CERT-SEC-SETTLE-009',
                'did:dpki:sec:settlement:core-ledger-alpha',
                'ORG-SEC-03'
              )
            }
            className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-rose-300">
                Preset 3: Revoked Key
              </span>
              <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                FAIL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">SecureBank Compromised Key</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadPreset(
                'CERT-CLD-EDGE-714',
                'did:dpki:cld:edge:us-east-router-04',
                'ORG-CLD-04'
              )
            }
            className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-orange-300">
                Preset 4: Expired Cert
              </span>
              <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-full border border-orange-500/30">
                EXPIRED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">CloudBridge ZeroTrust Router</p>
          </button>
        </div>
      </div>

      {/* Input Verification Form */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl">
        <form onSubmit={handleRunVerification} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Certificate ID or Fingerprint *
              </label>
              <input
                type="text"
                required
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                placeholder="e.g. CERT-APEX-USR-8849"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-xs sm:text-sm text-slate-100 rounded-xl border border-slate-800 focus:border-cyan-500/60 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Identity DID
              </label>
              <input
                type="text"
                value={inputIdentityId}
                onChange={(e) => setInputIdentityId(e.target.value)}
                placeholder="e.g. did:dpki:apex:user:elena.rostova"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-xs sm:text-sm text-slate-100 rounded-xl border border-slate-800 focus:border-cyan-500/60 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expected Issuing Organization
              </label>
              <select
                value={inputIssuerOrgId}
                onChange={(e) => setInputIssuerOrgId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-xs sm:text-sm text-slate-100 rounded-xl border border-slate-800 focus:border-cyan-500/60 focus:outline-none"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-mono">
              Engine: Decentralized Zero-Trust Verification Engine v2.4
            </span>

            <button
              type="submit"
              disabled={isVerifying}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Scanning Consensus Quorum...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Cryptographic Verification</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Scanning Animation indicator */}
        {isVerifying && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Simulating BFT-Mesh Ledger Verification (Step {verificationProgressStep}/5)...</span>
              </span>
              <span>{verificationProgressStep * 20}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${verificationProgressStep * 20}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Verification Report */}
      {report && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          {/* Verdict Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              report.verdict === 'VALID'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.15)]'
                : report.verdict === 'WARNING'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-950/60 border border-current shrink-0">
                {report.verdict === 'VALID' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : report.verdict === 'WARNING' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-400" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-400" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider block">
                  Overall Verification Result
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {report.verdict === 'VALID'
                    ? 'VERIFIED & TRUSTED'
                    : report.verdict === 'WARNING'
                    ? 'WARNING: EXPIRING SOON'
                    : 'VERIFICATION FAILED: UNTRUSTED / REVOKED'}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {report.verdict === 'VALID'
                    ? 'All 5 cryptographic security checks successfully verified by consensus quorum.'
                    : report.verdict === 'WARNING'
                    ? 'Cryptographic signature is valid, but certificate validity expires in fewer than 15 days.'
                    : 'Failed one or more mandatory trust checks. Certificate cannot be trusted for federation.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleExportReceipt}
              className="py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-current font-bold text-xs flex items-center gap-2 self-start sm:self-auto shrink-0 transition-all text-white"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download Audit Receipt (JSON)</span>
            </button>
          </div>

          {/* 5 Specific Verification Checks Breakdown */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Cryptographic Check Hierarchy (5/5)
            </h4>

            <div className="space-y-3">
              {Object.entries(report.checks).map(([key, check], index) => {
                const passed = check.passed;
                const isWarning = check.isWarning;

                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5 transition-all"
                  >
                    <div className="mt-0.5">
                      {passed && !isWarning ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white tracking-wide">
                          Step {index + 1}: {check.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            passed && !isWarning
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : isWarning
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {passed && !isWarning ? 'PASSED' : isWarning ? 'WARNING' : 'FAILED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {check.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate Metadata Snapshot */}
          {report.certificate && (
            <div className="pt-4 border-t border-slate-800 text-xs">
              <h4 className="text-sm font-bold text-white mb-2">Verified Subject Attributes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Common Name</span>
                  <p className="font-semibold text-white mt-0.5">{report.certificate.subjectCommonName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Issuer Node</span>
                  <p className="font-semibold text-cyan-300 mt-0.5">{report.certificate.issuerName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Algorithm</span>
                  <p className="font-mono text-slate-200 mt-0.5">{report.certificate.algorithm}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Serial Number</span>
                  <p className="font-mono text-slate-200 mt-0.5">{report.certificate.serialNumber}</p>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">
                  Decentralized Fingerprint (SHA-256)
                </span>
                {report.certificate.fingerprint}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

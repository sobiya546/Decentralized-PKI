import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  Cpu,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { organizations, switchActiveOrg, setCurrentUser, addToast } = useApp();

  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || 'ORG-APEX-01');
  const [email, setEmail] = useState('e.rostova@apex.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOrgChange = (newOrgId) => {
    setSelectedOrgId(newOrgId);
    const org = organizations.find((o) => o.id === newOrgId);
    if (org) {
      setEmail(`security.admin@${org.domain}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter valid email credentials and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switchActiveOrg(selectedOrgId);
      const org = organizations.find((o) => o.id === selectedOrgId);
      setCurrentUser((prev) => ({
        ...prev,
        organizationId: selectedOrgId,
        email: email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      }));
      addToast('Authenticated', `Session initiated under ${org?.name || 'Organization'}`, 'success');
      navigate('/');
    }, 700);
  };

  const handleQuickDemoLogin = (orgId, demoName, role, demoEmail) => {
    setSelectedOrgId(orgId);
    switchActiveOrg(orgId);
    setCurrentUser((prev) => ({
      ...prev,
      organizationId: orgId,
      name: demoName,
      role: role,
      email: demoEmail
    }));
    addToast('Demo Session Initialized', `Signed in as ${demoName} (${role})`, 'success');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Cyber Glow & Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 shadow-[0_0_25px_rgba(6,182,212,0.4)] mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NexDPKI Framework
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Decentralized PKI Management & Secure Cross-Organization Identity Federation
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Consortium Access</h2>
              <p className="text-xs text-slate-400">Authenticate via verified organization anchor</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>TLS-DPoP</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Organization Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Participating Organization
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedOrgId}
                  onChange={(e) => handleOrgChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 text-xs sm:text-sm text-slate-100 rounded-xl border border-slate-800 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Identity Principal / Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@organization.domain"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-xs sm:text-sm text-slate-100 rounded-xl border border-slate-800 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
              />
            </div>

            {/* Password Field with Show/Hide */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Hardware Key / Passphrase
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Demo: Any</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter cryptographic passphrase"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 text-xs sm:text-sm text-slate-100 rounded-xl border border-slate-800 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign-in Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Verifying Root DPKI Anchor...</span>
                </>
              ) : (
                <>
                  <span>Sign In to PKI Fabric</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> 1-Click Demo Profiles
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemoLogin(
                    'ORG-APEX-01',
                    'Dr. Elena Rostova',
                    'Chief Security Officer',
                    'e.rostova@apex.edu'
                  )
                }
                className="w-full p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-cyan-300">Apex University</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">• Dr. Elena Rostova (CSO)</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">Select</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemoLogin(
                    'ORG-NOVA-02',
                    'Marcus Vance',
                    'Lead Systems Architect',
                    'm.vance@novalabs.org'
                  )
                }
                className="w-full p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-cyan-300">Nova Research Labs</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">• Marcus Vance (Lead Architect)</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">Select</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemoLogin(
                    'ORG-GOV-05',
                    'Federal Root Inspector',
                    'Sovereign Auditor',
                    'auditor@digitalgov.gov'
                  )
                }
                className="w-full p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="font-bold text-white group-hover:text-cyan-300">Digital Government Services</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">• Sovereign Auditor</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">Select</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <p className="mt-5 text-center text-[11px] text-slate-500 font-mono">
          Prototype Mode: Cryptographic consensus simulated in-browser
        </p>
      </div>
    </div>
  );
};

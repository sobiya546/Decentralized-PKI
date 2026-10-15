import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Share2,
  Award,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Radio,
  FileCheck2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { CertStatusChart } from '../components/dashboard/CertStatusChart';
import { FederationActivityChart } from '../components/dashboard/FederationActivityChart';
import { TrustNetworkWidget } from '../components/dashboard/TrustNetworkWidget';
import { RecentEventsWidget } from '../components/dashboard/RecentEventsWidget';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    organizations,
    federatedIdentities,
    certificates,
    auditLogs,
    activeOrg,
    updateFederationStatus
  } = useApp();

  // Summary Metrics calculations
  const totalOrgs = organizations.length;
  const activeIdentities = federatedIdentities.filter((f) => f.status === 'approved').length;
  const validCerts = certificates.filter((c) => c.status === 'Valid').length;
  const expiringCerts = certificates.filter((c) => c.status === 'Expiring Soon').length;
  const revokedCerts = certificates.filter((c) => c.status === 'Revoked').length;

  // Pending federation requests for quick action
  const pendingFederations = federatedIdentities.filter((f) => f.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner & Welcome Context */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 p-6 backdrop-blur-xl shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Decentralized PKI Security Operations
              </span>
              <span className="text-[11px] text-slate-400 font-mono">• Consensus Height #1,849,204</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cross-Organization Trust & Identity Fabric
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Real-time monitoring of decentralized public key infrastructures, mutual certificate trust chains, and cross-domain federated identity delegations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/verify')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Certificate</span>
            </button>
            <button
              onClick={() => navigate('/certificates')}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Issue Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Organizations"
          value={totalOrgs}
          change="+1 new"
          changeType="positive"
          icon={Building2}
          description="Participating trust anchors"
          accentColor="cyan"
          onClick={() => navigate('/organizations')}
        />
        <StatCard
          title="Federated Identities"
          value={activeIdentities}
          change="+12% vol"
          changeType="positive"
          icon={Share2}
          description="Active cross-domain DIDs"
          accentColor="blue"
          onClick={() => navigate('/federation')}
        />
        <StatCard
          title="Valid Certificates"
          value={validCerts}
          change="Healthy"
          changeType="positive"
          icon={Award}
          description="Uncompromised active keys"
          accentColor="emerald"
          onClick={() => navigate('/certificates')}
        />
        <StatCard
          title="Expiring Soon"
          value={expiringCerts}
          change="Action Req"
          changeType="neutral"
          icon={Clock}
          description="Expires in < 15 days"
          accentColor="amber"
          onClick={() => navigate('/certificates?status=Expiring Soon')}
        />
        <StatCard
          title="Revoked / Severed"
          value={revokedCerts}
          change="Compromised"
          changeType="negative"
          icon={AlertOctagon}
          description="On decentralized CRL"
          accentColor="rose"
          onClick={() => navigate('/certificates?status=Revoked')}
        />
      </div>

      {/* Trust Network Visualization & Certificate Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrustNetworkWidget />
        </div>
        <div className="lg:col-span-1">
          <CertStatusChart certificates={certificates} />
        </div>
      </div>

      {/* Federation Activity Volume & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FederationActivityChart />
        </div>
        <div className="lg:col-span-1">
          <RecentEventsWidget auditLogs={auditLogs} />
        </div>
      </div>

      {/* Recent Identity Verification Requests Section */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              <span>Pending Cross-Organization Federation Handshakes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Identity claims submitted for mutual cryptographic endorsement
            </p>
          </div>
          <button
            onClick={() => navigate('/federation')}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            <span>Manage All Federations</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingFederations.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No pending cross-organization identity requests. All trust links are synchronized.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 mt-2">
            {pendingFederations.map((item) => {
              const homeOrg = organizations.find((o) => o.id === item.homeOrgId);
              const targetOrg = organizations.find((o) => o.id === item.targetOrgId);

              return (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{item.name}</span>
                      <span className="text-xs font-mono text-cyan-400 font-medium">({item.id})</span>
                      <Badge size="sm" status={item.status}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span className="text-slate-300 font-medium">{item.title}</span>
                      <span>•</span>
                      <span className="text-cyan-300">{homeOrg?.shortName} (Home)</span>
                      <span>→</span>
                      <span className="text-indigo-300">{targetOrg?.shortName} (Target)</span>
                    </div>

                    <p className="text-xs text-slate-400">
                      <span className="text-slate-500">Requested Scope:</span> {item.requestedScope}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateFederationStatus(item.id, 'approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
                    >
                      Approve Link
                    </button>
                    <button
                      onClick={() => updateFederationStatus(item.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

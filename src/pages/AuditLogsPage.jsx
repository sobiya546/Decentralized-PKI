import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldAlert,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Calendar,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { formatDateTime } from '../utils/cryptoUtils';

export const AuditLogsPage = () => {
  const {
    auditLogs,
    liveStreamActive,
    setLiveStreamActive,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const handleExportCSV = () => {
    const rows = filteredLogs.map((log) => ({
      ID: log.id,
      Timestamp: log.timestamp,
      EventType: log.eventType,
      Organization: log.organization,
      TargetID: log.targetId,
      Severity: log.severity,
      Result: log.result,
      Node: log.node,
      Description: log.description
    }));
    exportToCSV('nexdpki_security_audit_logs', rows);
    addToast('Exported', 'Security audit logs exported to CSV', 'success');
  };

  const handleExportJSON = () => {
    exportToJSON('nexdpki_security_audit_logs', filteredLogs);
    addToast('Exported', 'Security audit logs exported to JSON', 'success');
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesType = eventTypeFilter === 'all' || log.eventType === eventTypeFilter;
    const matchesSearch =
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.eventType.toLowerCase().includes(search.toLowerCase()) ||
      log.organization.toLowerCase().includes(search.toLowerCase()) ||
      log.targetId.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });

  const eventTypes = [
    'all',
    'CERT_ISSUED',
    'CERT_REVOKED',
    'CERT_VERIFIED',
    'TRUST_ESTABLISHED',
    'TRUST_SUSPENDED',
    'FEDERATION_REQUEST',
    'FEDERATION_APPROVED',
    'KEY_ROTATION'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-cyan-400" />
            <span>Security & Cryptographic Audit Logs</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Immutable decentralized ledger audit trail: key operations, consensus rounds, and cross-domain handshakes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setLiveStreamActive(!liveStreamActive);
              addToast(
                liveStreamActive ? 'Live Stream Paused' : 'Live SOC Stream Activated',
                liveStreamActive ? 'Telemetry paused.' : 'Consensus heartbeat streaming active.',
                'info'
              );
            }}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              liveStreamActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveStreamActive ? 'text-cyan-400 animate-pulse' : ''}`} />
            <span>{liveStreamActive ? 'Live SOC Stream: Active' : 'Start Live SOC Stream'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by Target ID, organization, event type, or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          {/* Severity selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-500 font-semibold uppercase text-[10px] mr-1">Severity:</span>
            {['all', 'Critical', 'High', 'Medium', 'Low', 'Info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Event type dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Event Type:</span>
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:border-cyan-500/50 focus:outline-none font-mono"
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Timestamp & Node</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Organization & Target</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  {/* Timestamp */}
                  <td className="py-4 px-4 font-mono text-[11px] whitespace-nowrap">
                    <span className="text-slate-300 block font-medium">
                      {formatDateTime(log.timestamp)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{log.node}</span>
                  </td>

                  {/* Event Type */}
                  <td className="py-4 px-4 font-mono">
                    <span className="text-cyan-300 font-bold text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800 block w-fit">
                      {log.eventType}
                    </span>
                    <span className="text-[10px] text-slate-500">{log.id}</span>
                  </td>

                  {/* Organization & Target */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-white">{log.organization}</p>
                    <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[150px] block">
                      {log.targetId}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-4 max-w-sm">
                    <p className="text-slate-300 line-clamp-2 leading-relaxed">
                      {log.description}
                    </p>
                  </td>

                  {/* Severity */}
                  <td className="py-4 px-4">
                    <Badge status={log.severity}>{log.severity}</Badge>
                  </td>

                  {/* Result */}
                  <td className="py-4 px-4">
                    <Badge status={log.result}>{log.result}</Badge>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Event: ${selectedLog.id}`}
          subtitle={`Type: ${selectedLog.eventType} • Node: ${selectedLog.node}`}
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => {
                  exportToJSON(`audit_event_${selectedLog.id}`, selectedLog);
                  addToast('Exported', 'Log entry saved as JSON', 'success');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Entry JSON</span>
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Severity</span>
                <div className="mt-1">
                  <Badge status={selectedLog.severity}>{selectedLog.severity}</Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Result</span>
                <div className="mt-1">
                  <Badge status={selectedLog.result}>{selectedLog.result}</Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Organization</span>
                <p className="font-semibold text-white mt-1 truncate">{selectedLog.organization}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Target ID</span>
                <p className="font-mono text-cyan-300 mt-1 truncate">{selectedLog.targetId}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1">Event Narrative:</span>
              <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
                {selectedLog.description}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1">Full Immutable Ledger Record (JSON):</span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

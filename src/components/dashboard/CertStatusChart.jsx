import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, AlertOctagon, Clock } from 'lucide-react';

const STATUS_COLORS = {
  Valid: '#10B981',        // Emerald
  'Expiring Soon': '#F59E0B', // Amber
  Expired: '#F97316',      // Orange
  Revoked: '#F43F5E',      // Rose
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-white flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          {data.name}
        </p>
        <p className="text-sm font-extrabold text-cyan-300 mt-1 font-mono">
          {data.value} <span className="text-xs text-slate-400 font-normal">certificates</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {data.payload.percentage}% of total PKI pool
        </p>
      </div>
    );
  }
  return null;
};

export const CertStatusChart = ({ certificates = [] }) => {
  const counts = {
    Valid: 0,
    'Expiring Soon': 0,
    Expired: 0,
    Revoked: 0,
  };

  certificates.forEach((c) => {
    if (counts[c.status] !== undefined) {
      counts[c.status] += 1;
    } else {
      counts.Valid += 1;
    }
  });

  const total = certificates.length || 1;

  const data = [
    { name: 'Valid', value: counts.Valid, color: STATUS_COLORS.Valid, percentage: ((counts.Valid / total) * 100).toFixed(0) },
    { name: 'Expiring Soon', value: counts['Expiring Soon'], color: STATUS_COLORS['Expiring Soon'], percentage: ((counts['Expiring Soon'] / total) * 100).toFixed(0) },
    { name: 'Expired', value: counts.Expired, color: STATUS_COLORS.Expired, percentage: ((counts.Expired / total) * 100).toFixed(0) },
    { name: 'Revoked', value: counts.Revoked, color: STATUS_COLORS.Revoked, percentage: ((counts.Revoked / total) * 100).toFixed(0) },
  ].filter((item) => item.value > 0);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white">Certificate Distribution</h3>
          <p className="text-xs text-slate-400">Cryptographic status breakdown</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-cyan-400 font-bold">{certificates.length} Total</span>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-48 my-2 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#0f172a"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white font-mono">{counts.Valid}</span>
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Active OK</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <div className="flex-1 flex justify-between">
            <span className="text-slate-300">Valid</span>
            <span className="font-mono font-bold text-emerald-400">{counts.Valid}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <div className="flex-1 flex justify-between">
            <span className="text-slate-300">Expiring</span>
            <span className="font-mono font-bold text-amber-400">{counts['Expiring Soon']}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <div className="flex-1 flex justify-between">
            <span className="text-slate-300">Expired</span>
            <span className="font-mono font-bold text-orange-400">{counts.Expired}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <div className="flex-1 flex justify-between">
            <span className="text-slate-300">Revoked</span>
            <span className="font-mono font-bold text-rose-400">{counts.Revoked}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

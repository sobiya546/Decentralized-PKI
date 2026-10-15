import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const SAMPLE_ACTIVITY_DATA = [
  { day: 'Mon', verifications: 142, federations: 38 },
  { day: 'Tue', verifications: 198, federations: 45 },
  { day: 'Wed', verifications: 260, federations: 62 },
  { day: 'Thu', verifications: 310, federations: 55 },
  { day: 'Fri', verifications: 420, federations: 89 },
  { day: 'Sat', verifications: 285, federations: 41 },
  { day: 'Sun', verifications: 360, federations: 74 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-slate-300 mb-1">{label} Telemetry</p>
        <p className="text-xs text-cyan-400 font-mono flex items-center justify-between gap-3">
          <span>Verifications:</span>
          <span className="font-bold text-white">{payload[0]?.value} ops</span>
        </p>
        <p className="text-xs text-indigo-400 font-mono flex items-center justify-between gap-3 mt-0.5">
          <span>Federation Handshakes:</span>
          <span className="font-bold text-white">{payload[1]?.value} links</span>
        </p>
      </div>
    );
  }
  return null;
};

export const FederationActivityChart = () => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white">Federation & Verification Volume</h3>
          <p className="text-xs text-slate-400">7-day cross-organization cryptographic activity</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Verifications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-300">Federation</span>
          </div>
        </div>
      </div>

      <div className="h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SAMPLE_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="verifications"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#cyanGradient)"
            />
            <Area
              type="monotone"
              dataKey="federations"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#indigoGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

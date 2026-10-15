import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const TrustGraph = ({
  organizations = [],
  trustRelationships = [],
  onSelectOrg,
  selectedOrgId,
  highlightSourceId,
  highlightTargetId
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Position nodes radially with nice spacing
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  // Layout calculation
  const width = 800;
  const height = 540;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 200;

  useEffect(() => {
    const initialPositions = {};
    const count = organizations.length;

    organizations.forEach((org, i) => {
      // If node position already exists, preserve it, otherwise calculate radial position
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      initialPositions[org.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    setNodePositions(initialPositions);
  }, [organizations]);

  // Compute highlighted path edges if source and target are selected
  const isEdgeInHighlightedPath = (rel) => {
    if (!highlightSourceId || !highlightTargetId) return false;
    // Direct link
    if (
      (rel.sourceOrgId === highlightSourceId && rel.targetOrgId === highlightTargetId) ||
      (rel.sourceOrgId === highlightTargetId && rel.targetOrgId === highlightSourceId)
    ) {
      return true;
    }
    // Simple transitive hop through intermediary nodes
    const involvesSource = rel.sourceOrgId === highlightSourceId || rel.targetOrgId === highlightSourceId;
    const involvesTarget = rel.sourceOrgId === highlightTargetId || rel.targetOrgId === highlightTargetId;
    return involvesSource || involvesTarget;
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'canvas-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingNodeId) {
      const svg = e.currentTarget.getBoundingClientRect();
      const clientX = (e.clientX - svg.left - pan.x) / zoom;
      const clientY = (e.clientY - svg.top - pan.y) / zoom;
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: { x: clientX, y: clientY },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.6), 2.2));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesFilter = filterStatus === 'all' || org.trustStatus === filterStatus;
    const matchesSearch =
      org.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/90 border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Filter & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/60 border-b border-slate-800/80 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter trust nodes..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 text-xs text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'active', 'pending', 'suspended'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium text-[11px] ${
                  filterStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Canvas controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 pl-1">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        className="relative w-full h-[520px] bg-[#070b14] cursor-grab active:cursor-grabbing select-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Cyber Grid Background */}
        <div
          id="canvas-bg"
          className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none"
        />

        <svg
          className="w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Edge Markers */}
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
            <marker
              id="arrow-pending"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            <marker
              id="arrow-suspended"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Trust Edges */}
            {trustRelationships.map((rel) => {
              const sourcePos = nodePositions[rel.sourceOrgId];
              const targetPos = nodePositions[rel.targetOrgId];
              if (!sourcePos || !targetPos) return null;

              const isHighlighted = isEdgeInHighlightedPath(rel);
              const hasHighlightMode = highlightSourceId && highlightTargetId;

              let strokeColor = '#06b6d4';
              let strokeDash = '';
              let marker = 'url(#arrow-active)';

              if (rel.status === 'pending') {
                strokeColor = '#f59e0b';
                strokeDash = '6 4';
                marker = 'url(#arrow-pending)';
              } else if (rel.status === 'suspended') {
                strokeColor = '#f43f5e';
                strokeDash = '3 5';
                marker = 'url(#arrow-suspended)';
              }

              if (isHighlighted) {
                strokeColor = '#38bdf8';
              }

              const opacity = hasHighlightMode ? (isHighlighted ? 1 : 0.15) : 0.75;
              const strokeWidth = isHighlighted ? 3.5 : rel.status === 'active' ? 2 : 1.5;

              // Compute midpoint for edge label
              const midX = (sourcePos.x + targetPos.x) / 2;
              const midY = (sourcePos.y + targetPos.y) / 2;

              return (
                <g key={rel.id} className="transition-opacity duration-300">
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    opacity={opacity}
                    markerEnd={marker}
                  />

                  {/* Edge Trust Score Pill on hover or highlighted */}
                  {(isHighlighted || hoveredNodeId === rel.sourceOrgId || hoveredNodeId === rel.targetOrgId) && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-20"
                        y="-10"
                        width="40"
                        height="20"
                        rx="6"
                        fill="#090e1a"
                        stroke={strokeColor}
                        strokeWidth="1"
                        opacity={opacity}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {rel.trustScore}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Central BFT Root Mesh Core */}
            <g transform={`translate(${centerX}, ${centerY})`}>
              <circle
                r="36"
                fill="#070c18"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <circle
                r="24"
                fill="#0b1329"
                stroke="#38bdf8"
                strokeWidth="1"
                opacity="0.8"
              />
              <text
                y="-4"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                DECENTRALIZED
              </text>
              <text
                y="8"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="7"
                fontFamily="monospace"
              >
                ROOT FABRIC
              </text>
            </g>

            {/* Nodes */}
            {organizations.map((org) => {
              const pos = nodePositions[org.id];
              if (!pos) return null;

              const isSelected = selectedOrgId === org.id;
              const isSource = highlightSourceId === org.id;
              const isTarget = highlightTargetId === org.id;
              const isSuspended = org.trustStatus === 'suspended';
              const isPending = org.trustStatus === 'pending';

              let borderColor = '#06b6d4';
              let fillColor = '#090e1a';
              if (isSuspended) {
                borderColor = '#f43f5e';
                fillColor = '#1c0a0e';
              } else if (isPending) {
                borderColor = '#f59e0b';
                fillColor = '#1c1507';
              }

              if (isSelected || isSource || isTarget) {
                borderColor = '#38bdf8';
              }

              return (
                <g
                  key={org.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredNodeId(org.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(org.id);
                  }}
                  onClick={() => onSelectOrg && onSelectOrg(org)}
                >
                  {/* Outer Pulsing Glow Ring for selected/source/target */}
                  {(isSelected || isSource || isTarget) && (
                    <circle
                      r="40"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer border ring */}
                  <circle
                    r="32"
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={isSelected ? '3.5' : '2'}
                    className={isSuspended ? '' : 'shadow-[0_0_20px_rgba(6,182,212,0.4)]'}
                  />

                  {/* Inner node circle */}
                  <circle
                    r="24"
                    fill="#0f172a"
                    stroke={borderColor}
                    strokeWidth="1"
                    opacity="0.9"
                  />

                  {/* Text initials */}
                  <text
                    y="-2"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="sans-serif"
                    letterSpacing="0.05em"
                  >
                    {org.shortName?.slice(0, 4).toUpperCase()}
                  </text>
                  <text
                    y="10"
                    textAnchor="middle"
                    fill={isSuspended ? '#fb7185' : '#38bdf8'}
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {org.trustScore}%
                  </text>

                  {/* Bottom Organization Label */}
                  <g transform="translate(0, 48)">
                    <rect
                      x="-65"
                      y="-12"
                      width="130"
                      height="20"
                      rx="6"
                      fill="#090e1a"
                      stroke={borderColor}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <text
                      y="2"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {org.name.length > 20 ? org.shortName : org.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend Drawer (Bottom Right) */}
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl text-xs space-y-2 pointer-events-auto">
          <p className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Graph Legend
          </p>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-cyan-400" />
              <span className="text-slate-300">Active Trust Link</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-amber-400 border-dashed" />
              <span className="text-slate-300">Pending Authorization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-rose-500" />
              <span className="text-slate-300">Suspended / Severed</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-950" />
              <span className="text-slate-300">Drag to reposition nodes</span>
            </div>
          </div>
        </div>

        {/* Floating status */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>Decentralized Consensus Live • {organizations.length} Nodes Synchronized</span>
        </div>
      </div>
    </div>
  );
};

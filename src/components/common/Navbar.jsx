import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Building,
  RotateCcw,
  Check,
  ChevronDown,
  LogOut,
  User,
  ShieldAlert,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const {
    organizations,
    activeOrgId,
    activeOrg,
    switchActiveOrg,
    currentUser,
    setCurrentUser,
    auditLogs,
    resetAllData,
    liveStreamActive,
    setLiveStreamActive,
    addToast
  } = useApp();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const orgRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (orgRef.current && !orgRef.current.contains(e.target)) setOrgDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/certificates?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    navigate('/login');
    addToast('Logged Out', 'You have been signed out of the session.', 'info');
  };

  const highPriorityLogs = auditLogs.filter(
    (l) => l.severity === 'Critical' || l.severity === 'High'
  ).slice(0, 5);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates, identities, or fingerprints..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/80 text-sm text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-xs"
          />
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live SOC Stream toggle */}
        <button
          onClick={() => {
            setLiveStreamActive(!liveStreamActive);
            addToast(
              liveStreamActive ? 'Live Stream Paused' : 'Live SOC Stream Activated',
              liveStreamActive ? 'Background audit pulse suspended.' : 'Real-time consensus telemetry enabled.',
              'info'
            );
          }}
          title={liveStreamActive ? 'Live SOC Stream Active' : 'Enable Simulated Live SOC Stream'}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            liveStreamActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${liveStreamActive ? 'text-cyan-400 animate-pulse' : ''}`} />
          <span>Live SOC Stream</span>
        </button>

        {/* Reset Demo Data button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo certificates, organizations, and identities to default state?')) {
              resetAllData();
            }
          }}
          title="Reset to default demo dataset"
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-xl border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Active Organization Switcher Dropdown */}
        <div className="relative" ref={orgRef}>
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-cyan-500/30 text-xs font-medium transition-all shadow-sm"
          >
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white max-w-[120px] sm:max-w-[160px] truncate">
              {activeOrg.shortName || activeOrg.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Organization Node
              </div>
              <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                {organizations.map((org) => {
                  const isSelected = org.id === activeOrgId;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchActiveOrg(org.id);
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-medium">{org.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{org.domain}</p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl border border-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {highPriorityLogs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
            {highPriorityLogs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Security Alerts
                </span>
                <button
                  onClick={() => {
                    navigate('/audit-logs');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View All <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {highPriorityLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No critical security events.</p>
                ) : (
                  highPriorityLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => {
                        navigate('/audit-logs');
                        setNotifDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-rose-400 uppercase">{log.eventType}</span>
                        <span className="text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left pr-1">
              <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[110px]">{currentUser.role.split('&')[0]}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-3 z-50">
              <div className="pb-3 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-cyan-400 font-mono">{currentUser.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-semibold border border-cyan-500/30">
                    {currentUser.clearanceLevel.split('/')[0]}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Security Profile & Keys</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

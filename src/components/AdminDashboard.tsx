import React, { useState, useEffect, useRef } from 'react';
import { BrandSymbol } from './BrandSymbol';
import {
  Lock,
  LogOut,
  Mail,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  Archive,
  ChevronRight,
  Send,
  Sliders,
  Volume2,
  VolumeX,
  FileText,
  KeyRound,
  ArrowLeft,
  X,
  Sparkles,
  Inbox,
  UserCheck,
} from 'lucide-react';
import { EnquiryRecord, EnquiryStatus } from '../server/database';

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
}

interface SummaryStats {
  total: number;
  new: number;
  contacted: number;
  inProgress: number;
  completed: number;
  archived: number;
  notificationsSent: number;
  notificationsFailed: number;
  notificationsNotConfigured: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPortfolio }) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('dbuilds_admin_token'));
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CRM State
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);

  // Real-time & sound state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState<number>(0);
  const [hasNewArrivals, setHasNewArrivals] = useState(false);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);

  // Audio synthesizer for subtle modern alert chime
  const playAlertSound = () => {
    if (!audioEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Check current session
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
        fetchEnquiries(authToken);
        fetchStats(authToken);
      } else {
        // Token invalid
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      sessionStorage.setItem('dbuilds_admin_token', data.token);
      setToken(data.token);
      setAdminUser(data.user);
      fetchEnquiries(data.token);
      fetchStats(data.token);
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    sessionStorage.removeItem('dbuilds_admin_token');
    setToken(null);
    setAdminUser(null);
    setEnquiries([]);
    setSelectedEnquiry(null);
  };

  // Fetch enquiries with filters
  const fetchEnquiries = async (authToken = token, isPoll = false) => {
    if (!authToken) return;
    if (!isPoll) setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        const newRecords: EnquiryRecord[] = data.enquiries || [];

        // Check if new enquiries arrived during polling
        if (isPoll && lastSeenCount > 0 && newRecords.length > lastSeenCount) {
          setHasNewArrivals(true);
          playAlertSound();
        }
        setLastSeenCount(newRecords.length);
        setEnquiries(newRecords);

        // Update selected enquiry if it's currently open
        if (selectedEnquiry) {
          const fresh = newRecords.find((r) => r.id === selectedEnquiry.id);
          if (fresh) setSelectedEnquiry(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      if (!isPoll) setIsLoading(false);
    }
  };

  // Fetch metrics summary
  const fetchStats = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/enquiries/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
  };

  // Fetch config status
  const fetchConfigStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/config-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConfigStatus(data);
        setShowConfigModal(true);
      }
    } catch {}
  };

  // Periodic polling listener (every 12s)
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchEnquiries(token, true);
      fetchStats(token);
    }, 12000);
    return () => clearInterval(interval);
  }, [token, statusFilter, searchQuery, lastSeenCount, audioEnabled]);

  // Sync internal notes input when opening an enquiry
  useEffect(() => {
    if (selectedEnquiry) {
      setNotesInput(selectedEnquiry.internalNotes || '');
    }
  }, [selectedEnquiry?.id]);

  // Update status action
  const handleUpdateStatus = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry || !token) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedEnquiry(data.enquiry);
        setEnquiries((prev) => prev.map((e) => (e.id === data.enquiry.id ? data.enquiry : e)));
        fetchStats(token);
      }
    } catch (err) {
      console.error('Update status failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save internal notes
  const handleSaveNotes = async () => {
    if (!selectedEnquiry || !token) return;
    setIsSavingNotes(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internalNotes: notesInput }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedEnquiry(data.enquiry);
        setEnquiries((prev) => prev.map((e) => (e.id === data.enquiry.id ? data.enquiry : e)));
      }
    } catch (err) {
      console.error('Save notes failed:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Retry notification email
  const handleRetryNotification = async () => {
    if (!selectedEnquiry || !token) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}/retry-notification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.enquiry) {
        setSelectedEnquiry(data.enquiry);
        setEnquiries((prev) => prev.map((e) => (e.id === data.enquiry.id ? data.enquiry : e)));
        fetchStats(token);
      }
    } catch (err) {
      console.error('Retry notification failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async () => {
    if (!selectedEnquiry || !token) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== selectedEnquiry.id));
        setSelectedEnquiry(null);
        setDeleteConfirmOpen(false);
        fetchStats(token);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status color helper
  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#65F4E8]/15 text-[#65F4E8] border border-[#65F4E8]/30">New</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#63B3FF]/15 text-[#63B3FF] border border-[#63B3FF]/30">Contacted</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Completed</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-[#929BAA] border border-white/15">Archived</span>;
    }
  };

  // Notification badge helper
  const getNotificationBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Notified</span>;
      case 'failed':
        return <span className="text-[10px] font-mono text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="text-[10px] font-mono text-[#929BAA] flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (WHEN UNAUTHENTICATED)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-[#05070C] text-[#F4F6FA] flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#929BAA] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>
          <div className="flex items-center gap-2">
            <BrandSymbol size={24} />
            <span className="font-display font-bold text-sm tracking-tight text-white">
              DBUILDS <span className="text-[#63B3FF] font-mono text-xs">2.0</span>
            </span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-12">
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0A0E16] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#63B3FF] to-[#65F4E8]" />

            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#101723] border border-white/10 flex items-center justify-center text-[#65F4E8] mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white">Administrator Access</h2>
              <p className="font-body text-xs text-[#929BAA] mt-2">
                Private Client CRM & Enquiry Notification Control
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#929BAA] mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="professional1511new@gmail.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#05070C] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#929BAA] mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#05070C] border border-white/10 text-xs sm:text-sm text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-4 py-3 px-4 rounded-lg bg-[#F4F6FA] hover:bg-white text-[#05070C] font-mono text-xs uppercase font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/[0.06] text-center text-[11px] font-mono text-[#929BAA]/60">
              RESTRICTED SYSTEM · DHANUSH / DBUILDS 2.0
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-[#929BAA]/40">
          buildbyd.com · Client CRM Pipeline
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#05070C] text-[#F4F6FA] flex flex-col font-body">
      {/* Top Bar Contract (Admin Version) */}
      <header className="bg-[#0A0E16] border-b border-white/[0.08] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="text-xs font-mono text-[#929BAA] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2.5">
              <BrandSymbol size={24} />
              <span className="font-display font-bold text-sm text-white">
                DBUILDS CRM <span className="text-[#65F4E8] font-mono text-xs">2.0</span>
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Live Polling Alert Indicator */}
            {hasNewArrivals && (
              <button
                type="button"
                onClick={() => {
                  setHasNewArrivals(false);
                  fetchEnquiries();
                }}
                className="px-2.5 py-1 rounded bg-[#65F4E8]/20 border border-[#65F4E8] text-[#65F4E8] text-[11px] font-mono flex items-center gap-1.5 animate-pulse"
              >
                <Sparkles className="w-3 h-3" />
                <span>New Enquiries Arrived!</span>
              </button>
            )}

            {/* Audio chime toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !audioEnabled;
                setAudioEnabled(nextState);
                if (nextState) playAlertSound();
              }}
              title={audioEnabled ? 'Mute arrival sound' : 'Enable arrival chime'}
              className={`p-1.5 rounded border transition-colors ${
                audioEnabled
                  ? 'border-[#65F4E8]/50 text-[#65F4E8] bg-[#65F4E8]/10'
                  : 'border-white/10 text-[#929BAA] hover:text-white'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Config Status Info */}
            <button
              type="button"
              onClick={fetchConfigStatus}
              title="View Email & Notification Settings"
              className="p-1.5 rounded border border-white/10 text-[#929BAA] hover:text-white transition-colors"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Manual Refresh */}
            <button
              type="button"
              onClick={() => {
                fetchEnquiries();
                fetchStats();
              }}
              disabled={isLoading}
              title="Refresh database"
              className="p-1.5 rounded border border-white/10 text-[#929BAA] hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#63B3FF]' : ''}`} />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-xs font-mono text-[#929BAA] hover:text-red-400 hover:border-red-500/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-xl bg-[#0A0E16] border border-white/[0.08] relative overflow-hidden">
            <span className="text-[11px] font-mono uppercase text-[#929BAA] block mb-1">Total Leads</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-white">
              {stats ? stats.total : '—'}
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#929BAA]/60">All transmissions</div>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0E16] border border-white/[0.08] border-l-2 border-l-[#65F4E8] relative overflow-hidden">
            <span className="text-[11px] font-mono uppercase text-[#65F4E8] block mb-1">New Enquiries</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#65F4E8]">
              {stats ? stats.new : '—'}
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#929BAA]/60">Requires first response</div>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0E16] border border-white/[0.08] border-l-2 border-l-[#63B3FF] relative overflow-hidden">
            <span className="text-[11px] font-mono uppercase text-[#63B3FF] block mb-1">Contacted</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-[#63B3FF]">
              {stats ? stats.contacted : '—'}
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#929BAA]/60">In communication</div>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0E16] border border-white/[0.08] relative overflow-hidden">
            <span className="text-[11px] font-mono uppercase text-amber-300 block mb-1">In Progress</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-amber-300">
              {stats ? stats.inProgress : '—'}
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#929BAA]/60">Scoping or building</div>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0E16] border border-white/[0.08] relative overflow-hidden col-span-2 sm:col-span-1">
            <span className="text-[11px] font-mono uppercase text-emerald-400 block mb-1">Completed</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-emerald-400">
              {stats ? stats.completed : '—'}
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#929BAA]/60">Launched builds</div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0A0E16] border border-white/[0.08] p-4 rounded-xl">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-mono">
            {['all', 'new', 'contacted', 'in_progress', 'completed', 'archived'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap capitalize ${
                  statusFilter === status
                    ? 'bg-[#101723] text-white border border-white/20'
                    : 'text-[#929BAA] hover:text-white'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#929BAA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or ID..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#05070C] border border-white/10 text-xs text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF]"
            />
          </div>
        </section>

        {/* Enquiries List & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table / List Column */}
          <div className={`space-y-3 ${selectedEnquiry ? 'lg:col-span-6 xl:col-span-7' : 'lg:col-span-12'}`}>
            {isLoading && enquiries.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-[#929BAA] bg-[#0A0E16] rounded-xl border border-white/10">
                <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-[#63B3FF]" />
                <span>Querying customer database...</span>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="p-16 text-center rounded-2xl bg-[#0A0E16] border border-white/[0.08] space-y-3">
                <Inbox className="w-10 h-10 text-white/20 mx-auto" />
                <h4 className="font-display font-medium text-base text-white">No Enquiries Found</h4>
                <p className="text-xs text-[#929BAA] max-w-sm mx-auto">
                  {statusFilter !== 'all' || searchQuery
                    ? 'Try clearing the search filter to see other enquiries.'
                    : 'Customer submissions through the public contact form will appear here in real-time.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {enquiries.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEnquiry(item)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      selectedEnquiry?.id === item.id
                        ? 'bg-[#101723] border-[#63B3FF]'
                        : 'bg-[#0A0E16] hover:bg-[#0E1420] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-white truncate">
                          {item.customerName}
                        </span>
                        {item.businessName && (
                          <span className="text-xs text-[#929BAA] truncate">
                            ({item.businessName})
                          </span>
                        )}
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-[#929BAA] truncate">
                        <span>{item.customerEmail}</span>
                        <span>·</span>
                        <span className="text-[#63B3FF]">{item.projectType}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-right text-[11px] font-mono text-[#929BAA] shrink-0">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <div className="mt-1">{getNotificationBadge(item.notificationStatus)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Detail Drawer / Panel (when an enquiry is selected) */}
          {selectedEnquiry && (
            <div className="lg:col-span-6 xl:col-span-5 bg-[#0A0E16] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[#65F4E8]">{selectedEnquiry.id}</span>
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {selectedEnquiry.customerName}
                  </h3>
                  {selectedEnquiry.businessName && (
                    <p className="text-xs text-[#929BAA]">Brand: {selectedEnquiry.businessName}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 rounded text-[#929BAA] hover:text-white"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#929BAA] mb-2">
                  Update Pipeline Status
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {(['new', 'contacted', 'in_progress', 'completed', 'archived'] as EnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-3 py-1.5 rounded transition-colors capitalize ${
                        selectedEnquiry.status === st
                          ? 'bg-[#63B3FF] text-[#05070C] font-semibold'
                          : 'bg-[#101723] text-[#929BAA] hover:text-white border border-white/10'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <a
                  href={`mailto:${selectedEnquiry.customerEmail}?subject=Re:%20DBuilds%202.0%20Website%20Inquiry%20(${selectedEnquiry.id})`}
                  className="p-2.5 rounded-lg bg-[#101723] hover:bg-[#192438] text-white border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#63B3FF]" />
                  <span>Reply Email</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedEnquiry.customerEmail, 'email')}
                  className="p-2.5 rounded-lg bg-[#101723] hover:bg-[#192438] text-white border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-[#65F4E8]" />
                  <span>{copiedField === 'email' ? 'Copied Email!' : 'Copy Email'}</span>
                </button>
              </div>

              {/* Full Submitted Data Card */}
              <div className="space-y-4 bg-[#101723]/60 p-4 rounded-xl border border-white/[0.06] text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#929BAA] block">Project Scope</span>
                  <span className="text-white font-medium">{selectedEnquiry.projectType}</span>
                </div>

                {selectedEnquiry.budget && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#929BAA] block">Budget</span>
                    <span className="text-[#65F4E8] font-mono">{selectedEnquiry.budget}</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#929BAA] block mb-1">Project Brief</span>
                  <div className="p-3 rounded bg-[#05070C] border border-white/[0.04] text-[#E4E8F0] whitespace-pre-wrap leading-relaxed font-body text-xs">
                    {selectedEnquiry.description}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#929BAA]">
                  <span>Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `ENQUIRY: ${selectedEnquiry.id}\nNAME: ${selectedEnquiry.customerName}\nEMAIL: ${selectedEnquiry.customerEmail}\nBRAND: ${selectedEnquiry.businessName}\nSCOPE: ${selectedEnquiry.projectType}\nBUDGET: ${selectedEnquiry.budget}\nBRIEF:\n${selectedEnquiry.description}`,
                        'details'
                      )
                    }
                    className="text-[#63B3FF] hover:underline"
                  >
                    {copiedField === 'details' ? 'Details Copied!' : 'Copy All'}
                  </button>
                </div>
              </div>

              {/* Notification Status & Retry */}
              <div className="p-3 rounded-lg bg-[#05070C] border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#929BAA] block uppercase">Notification Dispatch</span>
                  <div className="mt-0.5">{getNotificationBadge(selectedEnquiry.notificationStatus)}</div>
                </div>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleRetryNotification}
                  className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-[#63B3FF]" />
                  <span>Retry Notification</span>
                </button>
              </div>

              {/* Internal Notes (Admin-only) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono uppercase text-[#929BAA] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#65F4E8]" />
                    <span>Private Admin Notes</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="text-[11px] font-mono text-[#65F4E8] hover:underline disabled:opacity-50"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Internal notes about quote, timeline, meeting date..."
                  className="w-full p-3 rounded-lg bg-[#05070C] border border-white/10 text-xs text-white placeholder:text-[#929BAA]/40 focus:outline-none focus:border-[#63B3FF]"
                />
              </div>

              {/* Delete Action with Confirmation */}
              <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center">
                {deleteConfirmOpen ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400 font-mono">Confirm delete?</span>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleDeleteEnquiry}
                      className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-mono"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="px-2.5 py-1 rounded bg-white/10 text-white text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}

                <span className="text-[10px] font-mono text-[#929BAA]/40">PERSISTENT DB</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Configuration & Environment Guide Modal */}
      {showConfigModal && configStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-xl w-full bg-[#0A0E16] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#65F4E8]" />
                <h3 className="font-display font-semibold text-lg text-white">System Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded text-[#929BAA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#101723] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[#929BAA] block text-[10px] uppercase">Owner Notification Email</span>
                  <span className="text-white font-semibold">{configStatus.ownerEmail}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px]">VERIFIED</span>
              </div>

              <div className="p-3 rounded-lg bg-[#101723] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[#929BAA] block text-[10px] uppercase">Resend Transactional Provider</span>
                  <span className="text-white">
                    {configStatus.emailConfigured ? 'Active & Ready' : 'Pending API Key in Secrets'}
                  </span>
                </div>
                {configStatus.emailConfigured ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px]">CONNECTED</span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px]">PENDING KEY</span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#05070C] border border-white/[0.04] space-y-2 text-[#929BAA] leading-relaxed">
                <span className="text-white font-semibold block">How to activate live email delivery:</span>
                <p>
                  1. Obtain a free API key at <strong className="text-[#63B3FF]">resend.com</strong> (free tier: 3,000 emails/month).
                </p>
                <p>
                  2. Add <code className="text-[#65F4E8]">RESEND_API_KEY</code> to your environment secrets.
                </p>
                <p>
                  3. Submissions will automatically send an email to <code className="text-white">{configStatus.ownerEmail}</code> with reply-to set to the customer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="w-full py-2.5 rounded bg-[#F4F6FA] hover:bg-white text-[#05070C] text-xs font-mono uppercase font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

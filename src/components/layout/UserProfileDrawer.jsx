// src/components/layout/UserProfileDrawer.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Database, Cloud, ShieldCheck, HeartHandshake, Palette, 
  Key, Eye, EyeOff, Check, AlertCircle, RefreshCw, Download, 
  Upload, Trash2, Sun, CloudRain, Moon, Sunset, Sunrise, Sparkles, Sliders
} from 'lucide-react';
import { 
  getVaultCredentials, 
  saveVaultCredentials, 
  clearVaultCredentials, 
  testSupabaseConnection, 
  isVaultConfigured 
} from '../../utils/supabaseClient';

export default function UserProfileDrawer({ 
  isOpen, 
  onClose, 
  theme = {}, 
  userProfile = {},
  initialTab = 'vault',
  themeEngine = {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'vault');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // 1. Cloud Credentials State
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudKey, setCloudKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { loading, ok, message }
  const [isCloudConfigured, setIsCloudConfigured] = useState(false);

  useEffect(() => {
    const creds = getVaultCredentials();
    setCloudUrl(creds.supabaseUrl || '');
    setCloudKey(creds.supabaseAnonKey || '');
    setIsCloudConfigured(isVaultConfigured());
  }, [isOpen]);

  const handleTestConnection = async () => {
    setTestStatus({ loading: true, ok: null, message: 'Testing Supabase cloud connection...' });
    const res = await testSupabaseConnection(cloudUrl, cloudKey);
    if (res.ok) {
      setTestStatus({ loading: false, ok: true, message: 'Connection successful! Cloud Vault reachable.' });
    } else {
      setTestStatus({ loading: false, ok: false, message: res.error || 'Connection failed' });
    }
  };

  const handleSaveCredentials = () => {
    if (!cloudUrl || !cloudKey) {
      alert('Please provide both Supabase URL and Anon Key.');
      return;
    }
    saveVaultCredentials(cloudUrl, cloudKey);
    setIsCloudConfigured(true);
    setTestStatus({ loading: false, ok: true, message: 'Vault credentials saved into encrypted device storage!' });
    alert('Cloud Vault credentials saved successfully!');
  };

  const handleDisconnectCloud = () => {
    if (window.confirm('Disconnect cloud? The app will operate exclusively in offline Local Vault mode.')) {
      clearVaultCredentials();
      setCloudUrl('');
      setCloudKey('');
      setIsCloudConfigured(false);
      setTestStatus(null);
    }
  };

  // 2. Local Drive Vault Operations
  const handleExportSnapshot = () => {
    try {
      const membersRaw = localStorage.getItem('graceos_vault_members') || '[]';
      const backupData = {
        app: 'GraceOS Mobile Vault',
        exportedAt: new Date().toISOString(),
        version: '2.0-acrylic',
        records: JSON.parse(membersRaw)
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `graceos_vault_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleImportSnapshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        if (json.records && Array.isArray(json.records)) {
          localStorage.setItem('graceos_vault_members', JSON.stringify(json.records));
          alert(`Successfully imported ${json.records.length} records into Local Vault!`);
          window.location.reload();
        } else {
          alert('Invalid backup format. Must contain a records array.');
        }
      } catch (err) {
        alert(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    if (window.confirm('Wipe local offline cache? Your cloud data in Supabase will remain intact.')) {
      localStorage.removeItem('graceos_vault_members');
      alert('Local cache reset.');
      window.location.reload();
    }
  };

  // 3. Staff PIN & Scope
  const [staffPin, setStaffPin] = useState(() => localStorage.getItem('grace_staff_terminal_pin') || '2026');
  const [selectedRoleScope, setSelectedRoleScope] = useState(() => localStorage.getItem('grace_staff_scope') || 'admin');

  const handleSavePin = () => {
    if (staffPin.length !== 4 || isNaN(Number(staffPin))) {
      alert('Terminal PIN must be a 4-digit number.');
      return;
    }
    localStorage.setItem('grace_staff_terminal_pin', staffPin);
    localStorage.setItem('grace_staff_scope', selectedRoleScope);
    alert('Staff terminal PIN and permission scope updated!');
  };

  // 4. Ministry Talents Manager
  const defaultTalents = [
    'Worship Team & Vocals',
    'Media, Sound & Live Broadcast',
    'Sunday School & Kids Ministry',
    'Intercession & Prayer Wall',
    'Ushering & Hospitality',
    'Outreach & Evangelism',
    "Men's Fellowship",
    "Women's Fellowship",
    'Youth Fellowship'
  ];
  const [talentsList, setTalentsList] = useState(() => {
    try {
      const saved = localStorage.getItem('grace_ministry_talents');
      return saved ? JSON.parse(saved) : defaultTalents;
    } catch {
      return defaultTalents;
    }
  });
  const [newTalentName, setNewTalentName] = useState('');

  const handleAddTalent = () => {
    const trimmed = newTalentName.trim();
    if (!trimmed) return;
    if (talentsList.includes(trimmed)) {
      alert('This ministry talent already exists.');
      return;
    }
    const updated = [...talentsList, trimmed];
    setTalentsList(updated);
    localStorage.setItem('grace_ministry_talents', JSON.stringify(updated));
    setNewTalentName('');
  };

  const handleRemoveTalent = (talent) => {
    const updated = talentsList.filter(t => t !== talent);
    setTalentsList(updated);
    localStorage.setItem('grace_ministry_talents', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-3 select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose} 
      />

      <div 
        className="relative z-10 w-full max-w-lg rounded-[32px] p-5 shadow-2xl max-h-[88vh] flex flex-col animate-in slide-in-from-top-6 fade-in duration-300"
        style={{ 
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: `blur(${themeEngine.blurDepth || 40}px)`,
          WebkitBackdropFilter: `blur(${themeEngine.blurDepth || 40}px)`,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
          color: theme?.textMain || '#ffffff'
        }}
      >
        {/* 1. Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md border border-white/20"
              style={{ background: theme?.accent || '#06b6d4' }}
            >
              RS
            </div>
            <div>
              <h3 className="text-sm font-black leading-tight">
                {userProfile?.name || 'Pastor Raja S'}
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">
                GraceOS Console • Lead Pastor
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* 2. Settings Sub-Tab Navigation Bar (5 Panels) */}
        <div className="flex gap-1.5 py-3 border-b border-white/10 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'vault', label: 'Local Vault', icon: Database },
            { id: 'cloud', label: 'Cloud Sync', icon: Cloud },
            { id: 'staff', label: 'Staff PIN', icon: Key },
            { id: 'ministry', label: 'Ministries', icon: HeartHandshake },
            { id: 'theme', label: 'Liquid Theme', icon: Palette }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                  isCurrent 
                    ? 'shadow-md border' 
                    : 'bg-white/5 opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
                style={{
                  background: isCurrent ? theme?.accent || '#06b6d4' : undefined,
                  color: isCurrent ? '#ffffff' : theme?.textMain,
                  borderColor: isCurrent ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
                }}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Panel Body Area */}
        <div className="overflow-y-auto pr-1 py-3.5 space-y-4 text-xs grow">
          
          {/* ========================================================= */}
          {/* PANEL 1: LOCAL DRIVE VAULT */}
          {/* ========================================================= */}
          {activeTab === 'vault' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Database size={14} className="text-cyan-400" />
                    Device Offline Vault Storage
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Offline First Active
                  </span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  All believers, families, check-ins, and financial records are stored securely in local device storage before cloud delta replication.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono opacity-80">
                  <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                    Storage Table: <strong className="text-white">graceos_vault_members</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                    Engine: <strong className="text-cyan-300">Indexed Local Vault</strong>
                  </div>
                </div>
              </div>

              {/* Snapshot Backup Actions */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
                <span className="font-bold block text-[11px] opacity-90 uppercase tracking-wider font-mono">
                  Offline Snapshot Backups
                </span>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleExportSnapshot}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer hover:bg-cyan-500/30"
                  >
                    <Download size={13} />
                    <span>Export Snapshot (JSON)</span>
                  </button>

                  <label className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer hover:bg-amber-500/30">
                    <Upload size={13} />
                    <span>Import Snapshot</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportSnapshot} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="w-full py-2 rounded-xl text-rose-400 border border-rose-500/30 bg-rose-500/10 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer hover:bg-rose-500/20"
                  >
                    <Trash2 size={13} />
                    <span>Clear Local Cache Safely</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PANEL 2: ADVANCED CLOUD BACKUP */}
          {/* ========================================================= */}
          {activeTab === 'cloud' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Cloud size={14} className="text-cyan-400" />
                    Supabase Cloud Sync Vault
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isCloudConfigured 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {isCloudConfigured ? 'Connected' : 'Vault Offline'}
                  </span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  Zero-Hardcode Security: Project credentials are encrypted locally in <code className="text-cyan-300">grace_mobile_vault_credentials</code> and decrypted on demand via the unified singleton.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                {/* Supabase URL */}
                <div>
                  <label className="text-[10px] font-bold block mb-1 opacity-80">
                    Supabase Project URL *
                  </label>
                  <input 
                    type="url"
                    placeholder="https://xyzproject.supabase.co"
                    value={cloudUrl}
                    onChange={(e) => setCloudUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-black/40 font-mono text-xs focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500"
                  />
                </div>

                {/* Supabase Anon Key */}
                <div>
                  <label className="text-[10px] font-bold block mb-1 opacity-80">
                    Supabase Anon Public Key *
                  </label>
                  <div className="relative">
                    <input 
                      type={showKey ? 'text' : 'password'}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={cloudKey}
                      onChange={(e) => setCloudKey(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 rounded-xl border border-white/15 bg-black/40 font-mono text-xs focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer text-white"
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Test Feedback Message */}
                {testStatus && (
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                    testStatus.ok
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : testStatus.ok === false
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  }`}>
                    {testStatus.loading && <RefreshCw size={13} className="animate-spin shrink-0" />}
                    {testStatus.ok && <Check size={13} className="shrink-0" />}
                    {testStatus.ok === false && <AlertCircle size={13} className="shrink-0" />}
                    <span>{testStatus.message}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus?.loading}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
                  >
                    <RefreshCw size={12} className={testStatus?.loading ? 'animate-spin' : ''} />
                    <span>Test Connection</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCredentials}
                    className="flex-1 py-2 px-3 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer shadow-md"
                    style={{ background: theme?.accent || '#06b6d4' }}
                  >
                    <Check size={13} />
                    <span>Save & Connect</span>
                  </button>
                </div>

                {isCloudConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnectCloud}
                    className="w-full mt-1 text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer text-center block pt-1"
                  >
                    Disconnect Cloud (Use Offline Vault Only)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PANEL 3: STAFF CREDENTIALS */}
          {/* ========================================================= */}
          {activeTab === 'staff' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-cyan-400" />
                  Terminal PIN & Role Permission Scopes
                </span>
                <p className="text-[11px] opacity-75">
                  Configure the 4-digit quick supervisor PIN for attendance scanners and financial ledger operations.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div>
                  <label className="text-[10px] font-bold block mb-1 opacity-80">
                    Terminal Supervisor PIN (4 Digits)
                  </label>
                  <input 
                    type="password"
                    maxLength={4}
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    className="w-36 px-3 py-2 rounded-xl border border-white/15 bg-black/40 font-mono text-center tracking-[0.5em] text-base font-bold focus:outline-none focus:border-cyan-400 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1 opacity-80">
                    Permission Scope (Active Role)
                  </label>
                  <select
                    value={selectedRoleScope}
                    onChange={(e) => setSelectedRoleScope(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-slate-900 text-xs font-semibold focus:outline-none text-white cursor-pointer"
                  >
                    <option value="admin">Lead Pastor & Senior Administrator (Full Access)</option>
                    <option value="pastoral">Pastoral Care & Member Visitor Staff</option>
                    <option value="finance">Finance Secretary (Ledger & Tithes)</option>
                    <option value="usher">Kiosk Usher (Attendance Scanner Only)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSavePin}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer mt-1"
                  style={{ background: theme?.accent || '#06b6d4' }}
                >
                  Update Staff Security Scope
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PANEL 4: MINISTRY & TALENTS */}
          {/* ========================================================= */}
          {activeTab === 'ministry' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <span className="font-bold flex items-center gap-1.5">
                  <HeartHandshake size={14} className="text-cyan-400" />
                  Ministry Talents & Department Categories
                </span>
                <p className="text-[11px] opacity-75">
                  Manage the available ministry talents that believers and cell group leaders can be assigned to.
                </p>
              </div>

              {/* Add Talent Input */}
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="New talent (e.g. Media Tech, Intercession)..."
                  value={newTalentName}
                  onChange={(e) => setNewTalentName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-white/15 bg-black/40 text-xs focus:outline-none focus:border-cyan-400 text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTalent}
                  className="px-3 py-2 rounded-xl text-white font-bold text-xs active:scale-95 transition cursor-pointer"
                  style={{ background: theme?.accent || '#06b6d4' }}
                >
                  Add Talent
                </button>
              </div>

              {/* Talents List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {talentsList.map((talent, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between"
                  >
                    <span className="font-medium text-xs">{talent}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTalent(talent)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PANEL 5: THEME & LIQUID POLISH */}
          {/* ========================================================= */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* 🌟 1. The 6 Premium Acrylic Palettes */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider block opacity-90 font-mono">
                  1. The 6 Premium Acrylic Palettes
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(themeEngine.palettes || {}).map((p) => {
                    const isSelected = themeEngine.isPaletteActive && themeEngine.selectedPaletteKey === p.key;
                    return (
                      <div
                        key={p.key}
                        onClick={() => themeEngine.handleSelectPalette(p.key)}
                        className={`p-3 rounded-2xl border flex flex-col justify-between h-20 cursor-pointer active:scale-95 transition ${
                          isSelected 
                            ? 'border-2 shadow-lg' 
                            : 'border-white/15 bg-white/[0.04] opacity-80 hover:opacity-100'
                        }`}
                        style={{
                          borderColor: isSelected ? p.accent : undefined,
                          background: isSelected ? `rgba(15, 23, 42, 0.85)` : undefined,
                          boxShadow: isSelected ? `0 8px 24px -4px ${p.glow}` : undefined
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" 
                              style={{ background: p.accent }}
                            />
                            <span className="font-bold text-xs leading-tight">{p.name}</span>
                          </div>
                          {isSelected && (
                            <div 
                              className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
                              style={{ background: p.accent }}
                            >
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] font-mono opacity-60">{p.accent} • {p.tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🌟 2. Acrylic Blur Depth Slider */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Sliders size={13} className="text-cyan-400" />
                    Acrylic Blur Depth
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{themeEngine.blurDepth || 40}px</span>
                </div>
                <input 
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={themeEngine.blurDepth || 40}
                  onChange={(e) => themeEngine.updateBlurDepth(e.target.value)}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono opacity-50">
                  <span>15px (Light Glass)</span>
                  <span>40px (Default Fluent)</span>
                  <span>60px (Deep Frost)</span>
                </div>
              </div>

              {/* 🌟 3. Circadian Rhythm Adaptation Engine (Solar & Lunar) */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl border border-white/15 bg-white/[0.04] flex items-center justify-between shadow-inner">
                  <div>
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <Sunrise size={14} className="text-amber-400" />
                      Circadian Rhythm Time Engine
                    </span>
                    <span className="text-[9px] block mt-0.5 opacity-70">
                      Automatic solar & lunar lighting evaluated locally
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => themeEngine.toggleTimeMode(!themeEngine.isTimeActive)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      themeEngine.isTimeActive ? 'bg-cyan-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      themeEngine.isTimeActive ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'golden_bloom', name: 'Golden Bloom', time: '06:00 – 11:00', icon: Sunrise, color: 'text-amber-400' },
                    { key: 'crisp_sky', name: 'Crisp Sky', time: '11:00 – 16:30', icon: Sun, color: 'text-cyan-400' },
                    { key: 'twilight_sunset', name: 'Twilight Sunset', time: '16:30 – 18:30', icon: Sunset, color: 'text-rose-400' },
                    { key: 'lunar_obsidian', name: 'Lunar Obsidian', time: '18:30 – 06:00', icon: Moon, color: 'text-indigo-400' }
                  ].map(slot => {
                    const Icon = slot.icon;
                    const isSelected = themeEngine.isTimeActive && themeEngine.selectedTimeKey === slot.key;
                    return (
                      <div
                        key={slot.key}
                        onClick={() => themeEngine.handleSelectTime(slot.key)}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between h-16 cursor-pointer active:scale-95 transition ${
                          isSelected 
                            ? 'border-cyan-400 bg-cyan-500/20 font-bold' 
                            : 'border-white/10 bg-white/[0.03] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon size={13} className={slot.color} />
                          <span className="text-[11px] font-bold">{slot.name}</span>
                        </div>
                        <span className="text-[8px] font-mono opacity-60">{slot.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🌟 4. Live Weather Adaptation Mode */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl border border-white/15 bg-white/[0.04] flex items-center justify-between shadow-inner">
                  <div>
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <CloudRain size={14} className="text-sky-400" />
                      Live Weather Mist Adaptation
                    </span>
                    <span className="text-[9px] block mt-0.5 opacity-70">
                      Animated subtle diagonal acrylic mist sweeps
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => themeEngine.toggleWeatherMode(!themeEngine.isWeatherActive)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      themeEngine.isWeatherActive ? 'bg-sky-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      themeEngine.isWeatherActive ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'rain', label: 'Rainy Mist', icon: CloudRain, color: 'text-sky-400' },
                    { key: 'overcast', label: 'Overcast Slate', icon: Sparkles, color: 'text-slate-300' },
                    { key: 'clear', label: 'Clear Sky', icon: Sun, color: 'text-amber-400' }
                  ].map(w => {
                    const Icon = w.icon;
                    const isSelected = themeEngine.isWeatherActive && themeEngine.selectedWeatherKey === w.key;
                    return (
                      <div
                        key={w.key}
                        onClick={() => themeEngine.handleSelectWeather(w.key)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center h-16 cursor-pointer active:scale-95 transition ${
                          isSelected 
                            ? 'border-sky-400 bg-sky-500/20 font-bold' 
                            : 'border-white/10 bg-white/[0.03] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <Icon size={14} className={w.color} />
                        <span className="text-[10px]">{w.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

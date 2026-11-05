// src/components/layout/SettingsDrawer.jsx
import { useState } from 'react';
import { 
  X, Database, Cloud, ShieldCheck, HeartHandshake, Palette, QrCode,
  Key, Eye, EyeOff, Check, AlertCircle, RefreshCw, Download, 
  Upload, Trash2, Sun, CloudRain, Moon, Sunset, Sunrise, Sparkles, Sliders,
  Boxes, Wallet, Building2, Users, UserPlus, ArrowLeftRight,
  ChevronRight, Bell, Languages, LockKeyhole
} from 'lucide-react';
import {
  getVaultCredentials,
  saveVaultCredentials,
  clearVaultCredentials,
  testSupabaseConnection,
  isVaultConfigured
} from '../../utils/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import { createPairingPayload } from '../../utils/supabaseClient';
import { isRestrictedSubTab, ROLES } from '../../utils/accessControl';
import { DEFAULT_CAMPUSES } from '../../constants/churchDefaults';
import { bidirectionalSyncMembers } from '../../services/syncEngine';
import { useTranslation } from '../../context/LanguageContext';

export default function SettingsDrawer({
  isOpen, 
  onClose, 
  theme = {}, 
  userProfile = {},
  initialTab = 'vault',
  themeEngine = {},
  onSignOut,
  onAddStaff,
  onSwitchAccount,
  campuses = DEFAULT_CAMPUSES,
  onCampusesChange,
  onOpenProfile,
  onOpenPassword
}) {
  const { t, currentLang, changeLanguage, availableLanguages } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab || 'vault');
  const [wasOpen, setWasOpen] = useState(isOpen);
  const [initialCredentials] = useState(() => getVaultCredentials());
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      return Number(localStorage.getItem('grace_unread_notification_count')) || 0;
    } catch {
      return 0;
    }
  });
  const [appearanceMode, setAppearanceMode] = useState(() => {
    try {
      return localStorage.getItem('grace_appearance_mode') || 'system';
    } catch {
      return 'system';
    }
  });
  const [lastSyncedTime, setLastSyncedTime] = useState(() => {
    try {
      return localStorage.getItem('grace_last_synced_time') || '';
    } catch {
      return '';
    }
  });

  // 1. Cloud Credentials State
  const [cloudUrl, setCloudUrl] = useState(initialCredentials.supabaseUrl || '');
  const [cloudKey, setCloudKey] = useState(initialCredentials.supabaseAnonKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { loading, ok, message }
  const [isCloudConfigured, setIsCloudConfigured] = useState(isVaultConfigured());
  const [isPairingQrVisible, setIsPairingQrVisible] = useState(false);
  const pairingPayload = createPairingPayload({ campus: 'Headquarters' });

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setActiveTab(initialTab || 'vault');
      const credentials = getVaultCredentials();
      setCloudUrl(credentials.supabaseUrl || '');
      setCloudKey(credentials.supabaseAnonKey || '');
      setIsCloudConfigured(isVaultConfigured());
    }
  }

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
  const [cellGroups, setCellGroups] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('grace_cell_groups') || '[]');
    } catch (error) {
      console.warn('[Settings] Unable to read saved cell groups:', error);
      return [];
    }
  });
  const [ministryRoles, setMinistryRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('grace_ministry_roles') || JSON.stringify(Object.values(ROLES)));
    } catch (error) {
      console.warn('[Settings] Unable to read ministry roles:', error);
      return Object.values(ROLES);
    }
  });
  const [newCellGroup, setNewCellGroup] = useState('');
  const [newCampusName, setNewCampusName] = useState('');
  const [inventory, setInventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('grace_assets_inventory') || '[]');
    } catch (error) {
      console.warn('[Settings] Unable to read saved inventory:', error);
      return [];
    }
  });
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetQuantity, setNewAssetQuantity] = useState('1');
  const [liquidity, setLiquidity] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('grace_finance_liquidity') || '{"cash":0,"bank":0,"mode":"cash"}');
    } catch (error) {
      console.warn('[Settings] Unable to read saved liquidity:', error);
      return { cash: 0, bank: 0, mode: 'cash' };
    }
  });
  const [manualSyncMessage, setManualSyncMessage] = useState('');

  const persistArray = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  const handleAddCellGroup = () => {
    const name = newCellGroup.trim();
    if (!name || cellGroups.includes(name)) return;
    const updated = [...cellGroups, name];
    setCellGroups(updated);
    persistArray('grace_cell_groups', updated);
    setNewCellGroup('');
  };
  const handleAddCampus = () => {
    const name = newCampusName.trim();
    if (!name || campuses.some(campus => campus.name.toLowerCase() === name.toLowerCase())) return;
    const updated = [...campuses, { id: `campus-${Date.now()}`, name, code: '', city: '', isHQ: false }];
    onCampusesChange?.(updated);
    setNewCampusName('');
  };
  const handleAddAsset = () => {
    const name = newAssetName.trim();
    const quantity = Number(newAssetQuantity);
    if (!name || !Number.isInteger(quantity) || quantity < 1) return;
    const updated = [...inventory, { id: `asset-${Date.now()}`, name, quantity }];
    setInventory(updated);
    persistArray('grace_assets_inventory', updated);
    setNewAssetName('');
    setNewAssetQuantity('1');
  };
  const updateLiquidity = updates => {
    setLiquidity(current => {
      const updated = { ...current, ...updates };
      localStorage.setItem('grace_finance_liquidity', JSON.stringify(updated));
      return updated;
    });
  };
  const handleManualSync = async () => {
    if (!isVaultConfigured() || !navigator.onLine) {
      setManualSyncMessage('Local Vault is ready. Connect to the internet and pair Supabase to sync.');
      return;
    }
    setManualSyncMessage('Synchronizing local and cloud members…');
    try {
      const result = await bidirectionalSyncMembers();
      setManualSyncMessage(`Sync complete: ${result.pushed} uploaded, ${result.pulled} downloaded, ${result.merged.length} total merged.`);
    } catch (error) {
      setManualSyncMessage(`Cloud sync failed: ${error.message}`);
      return;
    }
    const syncedAt = new Date().toISOString();
    const formattedTime = new Date(syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('grace_last_synced_time', formattedTime);
    setLastSyncedTime(formattedTime);
  };

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
    <div className="fixed inset-0 z-50 flex items-end select-none sm:justify-end">
      <button
        type="button"
        aria-label="Close settings"
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose} 
      />

      <div 
        role="dialog"
        aria-modal="true"
        aria-label={t('settings')}
        className="relative z-10 flex max-h-[94vh] w-full flex-col rounded-t-[30px] border p-4 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 sm:h-full sm:max-h-screen sm:max-w-md sm:rounded-none sm:rounded-l-[30px] sm:p-5 sm:animate-in sm:slide-in-from-right-10"
        style={{ 
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: `blur(${themeEngine.blurDepth || 40}px)`,
          WebkitBackdropFilter: `blur(${themeEngine.blurDepth || 40}px)`,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
          color: theme?.textMain || '#ffffff'
        }}
      >
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-lg font-black">{t('settings')}</h2>
            <p className="text-[10px] text-white/50">{t('settings_summary')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20 active:scale-90"
              aria-label={t('cancel')}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          <button type="button" onClick={onOpenProfile} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-left transition hover:bg-white/[0.09] active:scale-[0.99]">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-emerald-300/40 bg-emerald-400/15">
              {userProfile?.avatar
                ? <img src={userProfile.avatar} alt="" className="h-full w-full object-cover" />
                : <span className="flex h-full w-full items-center justify-center text-sm font-black text-emerald-200">{(userProfile?.name || 'Raja S').split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}</span>}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
            </div>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm">{userProfile?.name || 'Raja S'}</strong>
              <small className="mt-0.5 block truncate text-[10px] text-white/55">{userProfile?.title || t('pastor')} · {userProfile?.role || 'MEMBER'}</small>
              <span className="mt-1 inline-block text-[10px] font-bold text-emerald-200">{t('view_profile')} <span aria-hidden="true">›</span></span>
            </span>
            <ChevronRight size={16} className="text-white/40" />
          </button>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <h3 className="mb-2 px-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/40">{t('account')}</h3>
            <button type="button" onClick={() => {
              setIsNotificationsOpen(true);
              setUnreadCount(0);
              localStorage.setItem('grace_unread_notification_count', '0');
            }} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs hover:bg-white/5">
              <Bell size={14} className="text-amber-300" /><span className="flex-1">{t('notifications')}</span>
              {unreadCount > 0 && <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black">{unreadCount}</span>}
              <ChevronRight size={14} className="text-white/35" />
            </button>
            <button type="button" onClick={onOpenPassword} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs hover:bg-white/5">
              <LockKeyhole size={14} className="text-cyan-300" /><span className="flex-1">{t('change_password')}</span><ChevronRight size={14} className="text-white/35" />
            </button>
          </section>

          <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <h3 className="px-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/40">{t('preferences')}</h3>
            <button type="button" onClick={() => setIsLanguagePickerOpen(true)} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs hover:bg-white/5">
              <Languages size={14} className="text-violet-300" /><span className="flex-1">{t('language')}</span>
              <span className="text-white/55">{availableLanguages.find(language => language.code === currentLang)?.nativeName}</span><ChevronRight size={14} className="text-white/35" />
            </button>
            <div>
              <div className="mb-2 flex items-center gap-2 px-2 text-xs"><Palette size={14} className="text-rose-300" /><span>{t('appearance')}</span></div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  ['pure-dark', t('appearance_pure_dark')],
                  ['ink', t('appearance_ink')],
                  ['light', t('appearance_light')],
                  ['system', t('appearance_system')]
                ].map(([mode, label]) => (
                  <button key={mode} type="button" aria-pressed={appearanceMode === mode} onClick={() => {
                    setAppearanceMode(mode);
                    themeEngine.handleSelectAppearance?.(mode);
                  }} className={`rounded-lg border px-1 py-2 text-[9px] font-bold ${appearanceMode === mode ? 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>{label}</button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[10px] text-white/55">{t('accent_color')}</span>
                <div className="flex gap-2">
                  {[
                    ['Cyan', '#06b6d4'], ['Emerald', '#10b981'], ['Amber', '#f59e0b'],
                    ['Rose', '#f43f5e'], ['Violet', '#8b5cf6'], ['Slate', '#64748b']
                  ].map(([name, color]) => (
                    <button key={name} type="button" title={name} aria-label={`${name} accent`} aria-pressed={(themeEngine.selectedAccent || theme?.accent) === color} onClick={() => themeEngine.handleSelectAccent?.(color)} className={`h-5 w-5 rounded-full border transition active:scale-90 ${(themeEngine.selectedAccent || theme?.accent) === color ? 'border-white ring-2 ring-white/35' : 'border-white/20'}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <h3 className="mb-2 px-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/40">{t('ministry_and_branches')} · {t('stock_and_inventory')} · {t('liquid_funds_and_treasury')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['vault', t('data_and_sync'), Database],
                ['ministry', t('ministry_and_branches'), HeartHandshake],
                ['assets', t('stock_and_inventory'), Boxes],
                ['finance', t('liquid_funds_and_treasury'), Wallet]
              ].map(([tab, label, Icon]) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[9px] font-bold ${activeTab === tab ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-100' : 'border-white/10 text-white/65 hover:bg-white/5'}`}><Icon size={11} />{label}</button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-black/20 px-2.5 py-2 text-[10px]">
              <span className="flex min-w-0 items-center gap-1.5 text-white/65"><span className={`h-2 w-2 shrink-0 rounded-full ${isCloudConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />{isCloudConfigured ? t('supabase_connected') : t('local_vault')} · {lastSyncedTime || t('not_synced_yet')}</span>
              <button type="button" onClick={handleManualSync} className="shrink-0 rounded-lg bg-emerald-500/20 px-2 py-1 font-bold text-emerald-200 hover:bg-emerald-500/30">{t('sync_now')}</button>
            </div>
          </section>

          {isLanguagePickerOpen && (
            <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm sm:items-center">
              <section role="dialog" aria-modal="true" aria-label={t('language')} className="w-full max-w-sm rounded-3xl border border-white/15 bg-slate-900 p-4 shadow-2xl">
                <div className="mb-3 flex items-center justify-between"><h3 className="font-bold">{t('language')}</h3><button type="button" onClick={() => setIsLanguagePickerOpen(false)} aria-label={t('cancel')}><X size={17} /></button></div>
                <div className="space-y-1">
                  {availableLanguages.map(language => (
                    <button key={language.code} type="button" aria-pressed={currentLang === language.code} onClick={() => {
                      changeLanguage(language.code);
                      setIsLanguagePickerOpen(false);
                    }} className={`flex w-full items-center justify-between rounded-xl p-3 text-sm ${currentLang === language.code ? 'bg-emerald-500/20 text-emerald-100' : 'hover:bg-white/5'}`}><span>{language.nativeName}</span><span className="text-xs text-white/45">{language.name}</span></button>
                  ))}
                </div>
              </section>
            </div>
          )}
          {isNotificationsOpen && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm">
              <section role="dialog" aria-modal="true" aria-label={t('notifications')} className="w-full max-w-sm rounded-3xl border border-white/15 bg-slate-900 p-5 shadow-2xl">
                <div className="mb-3 flex items-center justify-between"><h3 className="font-bold">{t('notifications')}</h3><button type="button" onClick={() => setIsNotificationsOpen(false)} aria-label={t('cancel')}><X size={17} /></button></div>
                <p className="rounded-xl bg-white/[0.04] p-4 text-sm text-white/60">{t('notifications_empty')}</p>
              </section>
            </div>
          )}

          <div className="flex items-center justify-between px-2 text-[9px] text-white/35">
            <span>{t('app_version')} v4.6.0</span>
            {onSignOut && <button type="button" onClick={onSignOut} className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1.5 font-bold text-rose-300 hover:bg-rose-500/20">{t('sign_out')}</button>}
          </div>

        {/* Settings Sub-Tab Navigation Bar */}
        <div className="flex gap-1.5 border-b border-white/10 py-3 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'vault', label: t('data_and_sync'), icon: Database },
            { id: 'cloud', label: t('cloud_sync'), icon: Cloud },
            { id: 'staff', label: 'Staff PIN', icon: Key },
            { id: 'ministry', label: t('ministry_and_branches'), icon: HeartHandshake },
            { id: 'assets', label: t('stock_and_inventory'), icon: Boxes },
            { id: 'finance', label: t('liquid_funds_and_treasury'), icon: Wallet },
            { id: 'account', label: t('account'), icon: UserPlus },
            { id: 'theme', label: 'Liquid Theme', icon: Palette }
          ].filter(tab => !isRestrictedSubTab(userProfile?.role, tab.id)).map(tab => {
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
        <div className="pr-1 py-3.5 space-y-4 text-xs">
          
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
                <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-2">
                  <span className="text-[10px] opacity-70">Cloud: {isCloudConfigured ? 'Supabase paired' : 'Not paired'}</span>
                  <button type="button" onClick={handleManualSync} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-2.5 py-1.5 text-[10px] font-bold text-cyan-200 hover:bg-cyan-400/20">
                    <RefreshCw size={11} /> Sync Now
                  </button>
                </div>
                {manualSyncMessage && <p role="status" className="text-[10px] text-cyan-100/80">{manualSyncMessage}</p>}
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-500/[0.08] border border-cyan-400/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5"><QrCode size={14} className="text-cyan-300" /> Pair Mobile Device</span>
                  <span className="text-[9px] font-mono text-cyan-200/70">ZERO CONFIG</span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">Display a one-time QR code for the GraceOS mobile terminal. No manual API key entry is required.</p>
                <button type="button" onClick={() => setIsPairingQrVisible(value => !value)} className="w-full rounded-xl bg-cyan-400/20 px-3 py-2 text-xs font-bold text-cyan-200 border border-cyan-300/30 hover:bg-cyan-400/30">
                  {isPairingQrVisible ? 'Hide Pairing QR' : 'Show Pairing QR'}
                </button>
                {isPairingQrVisible && (
                  <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4">
                    <QRCodeSVG value={pairingPayload} size={190} level="M" includeMargin />
                    <span className="text-center text-[9px] text-slate-500">Scan this code from the mobile app camera</span>
                  </div>
                )}
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

              <section className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <h4 className="flex items-center gap-1.5 font-bold"><Users size={13} className="text-emerald-300" /> Ministry Roles & Cell Groups</h4>
                <p className="text-[10px] text-white/55">Choose roles available in the local ministry directory.</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(ROLES).map(roleName => (
                    <label key={roleName} className="flex items-center gap-2 rounded-lg bg-black/20 px-2.5 py-2 text-[10px]">
                      <input type="checkbox" checked={ministryRoles.includes(roleName)} onChange={event => {
                        const updated = event.target.checked
                          ? [...ministryRoles, roleName]
                          : ministryRoles.filter(item => item !== roleName);
                        setMinistryRoles(updated);
                        persistArray('grace_ministry_roles', updated);
                      }} className="accent-emerald-400" />
                      {roleName}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newCellGroup} onChange={event => setNewCellGroup(event.target.value)} placeholder="New cell group" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400" />
                  <button type="button" onClick={handleAddCellGroup} className="rounded-xl bg-cyan-500/80 px-3 text-xs font-bold text-white">Add</button>
                </div>
                <div className="space-y-1">
                  {cellGroups.length ? cellGroups.map(group => (
                    <div key={group} className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-2">
                      <span>{group}</span>
                      <button type="button" aria-label={`Remove ${group}`} onClick={() => {
                        const updated = cellGroups.filter(item => item !== group);
                        setCellGroups(updated);
                        persistArray('grace_cell_groups', updated);
                      }} className="text-rose-300 hover:text-rose-200"><Trash2 size={12} /></button>
                    </div>
                  )) : <p className="text-[10px] text-white/45">No cell groups added yet.</p>}
                </div>
              </section>

              <section className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <h4 className="flex items-center gap-1.5 font-bold"><Building2 size={13} className="text-amber-300" /> Campuses</h4>
                <div className="flex gap-2">
                  <input value={newCampusName} onChange={event => setNewCampusName(event.target.value)} placeholder="New campus name" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400" />
                  <button type="button" onClick={handleAddCampus} className="rounded-xl bg-cyan-500/80 px-3 text-xs font-bold text-white">Add</button>
                </div>
                <div className="space-y-1">
                  {campuses.map(campus => (
                    <div key={campus.id} className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-2">
                      <span>{campus.name}{campus.isHQ ? ' · HQ' : ''}</span>
                      {!campus.isHQ && <button type="button" aria-label={`Remove ${campus.name}`} onClick={() => onCampusesChange?.(campuses.filter(item => item.id !== campus.id))} className="text-rose-300 hover:text-rose-200"><Trash2 size={12} /></button>}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'assets' && (
            <section className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <h4 className="flex items-center gap-2 font-bold"><Boxes size={14} className="text-cyan-300" /> Stock & Equipment Inventory</h4>
                <p className="mt-1 text-[10px] text-white/55">Inventory entries are saved locally on this device.</p>
              </div>
              <div className="flex gap-2">
                <input value={newAssetName} onChange={event => setNewAssetName(event.target.value)} placeholder="Equipment or stock item" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400" />
                <input type="number" min="1" step="1" aria-label="Quantity" value={newAssetQuantity} onChange={event => setNewAssetQuantity(event.target.value)} className="w-16 rounded-xl border border-white/15 bg-black/30 px-2 py-2 text-xs text-white outline-none focus:border-cyan-400" />
                <button type="button" onClick={handleAddAsset} className="rounded-xl bg-cyan-500/80 px-3 text-xs font-bold text-white">Add</button>
              </div>
              <div className="space-y-1.5">
                {inventory.map(item => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <span>{item.name}</span><span className="flex items-center gap-3"><strong>× {item.quantity}</strong><button type="button" aria-label={`Remove ${item.name}`} onClick={() => {
                      const updated = inventory.filter(asset => asset.id !== item.id);
                      setInventory(updated);
                      persistArray('grace_assets_inventory', updated);
                    }} className="text-rose-300"><Trash2 size={13} /></button></span>
                  </div>
                ))}
                {!inventory.length && <p className="rounded-xl border border-dashed border-white/15 p-4 text-center text-white/45">No inventory items yet.</p>}
              </div>
            </section>
          )}

          {activeTab === 'finance' && (
            <section className="space-y-3">
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4">
                <h4 className="flex items-center gap-2 font-bold"><Wallet size={14} className="text-emerald-300" /> Liquid Funds Monitor</h4>
                <p className="mt-2 text-2xl font-black text-emerald-200">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(liquidity.cash || 0) + Number(liquidity.bank || 0))}</p>
                <p className="text-[10px] text-white/55">Combined cash-in-hand and bank balance • locally stored</p>
              </div>
              <label className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-semibold">Cash in hand
                <input type="number" min="0" value={liquidity.cash} onChange={event => updateLiquidity({ cash: Number(event.target.value) })} className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white" />
              </label>
              <label className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-semibold">Bank balance
                <input type="number" min="0" value={liquidity.bank} onChange={event => updateLiquidity({ bank: Number(event.target.value) })} className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white" />
              </label>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <span className="text-xs font-semibold">Primary liquidity view</span>
                <div className="flex rounded-lg bg-black/30 p-1">
                  {['cash', 'bank'].map(mode => <button key={mode} type="button" aria-pressed={liquidity.mode === mode} onClick={() => updateLiquidity({ mode })} className={`rounded-md px-3 py-1.5 text-[10px] font-bold capitalize ${liquidity.mode === mode ? 'bg-emerald-500/80 text-white' : 'text-white/60'}`}>{mode}</button>)}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'account' && (
            <section className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <h4 className="font-bold">{userProfile?.name || 'GraceOS User'}</h4>
                <p className="mt-1 text-[11px] text-white/55">{userProfile?.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-200">{userProfile?.role || 'MEMBER'}</span>
              </div>
              <button type="button" onClick={onAddStaff} className="flex w-full items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-left text-xs font-bold text-cyan-100 hover:bg-cyan-400/20"><UserPlus size={14} /> Add Staff Account</button>
              <button type="button" onClick={onSwitchAccount} className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left text-xs font-bold text-white/80 hover:bg-white/10"><ArrowLeftRight size={14} /> Sign In / Switch Account</button>
              {onSignOut && <button type="button" onClick={onSignOut} className="w-full rounded-xl border border-rose-300/20 bg-rose-400/10 p-3 text-left text-xs font-bold text-rose-200 hover:bg-rose-400/20">Sign Out</button>}
            </section>
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
    </div>
  );
}

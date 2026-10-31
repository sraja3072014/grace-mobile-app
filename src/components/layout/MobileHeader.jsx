// src/components/layout/MobileHeader.jsx
import React from 'react';
import { ChevronDown, Bell, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useSyncStatus } from '../../hooks/useSyncStatus';

export default function MobileHeader({
  selectedBranch,
  theme = {},
  setIsChurchModalOpen,
  setIsUserMenuOpen,
  onOpenSettings
}) {
  const textColor = theme?.textMain || '#ffffff';
  const mutedColor = theme?.textMuted || 'rgba(255, 255, 255, 0.7)';
  const accentColor = theme?.accent || '#06b6d4';

  const { mode, lastSyncedTime } = useSyncStatus();

  return (
    <header className="relative z-40 w-full pt-3 pb-1 select-none">
      <div className="max-w-lg mx-auto px-5 flex items-center justify-between">
        
        {/* 1. Branch Selector Capsule */}
        <div 
          onClick={() => setIsChurchModalOpen?.(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border backdrop-blur-md shadow-sm cursor-pointer active:scale-95 transition"
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            borderColor: theme?.cardBorder || 'rgba(255, 255, 255, 0.15)'
          }}
        >
          <div 
            className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs shrink-0 border border-white/20"
            style={{ background: accentColor }}
          >
            GC
          </div>
          <div className="text-left pr-1">
            <div className="flex items-center gap-1">
              <h1 className="text-xs font-black tracking-tight max-w-[120px] truncate leading-tight" style={{ color: textColor }}>
                {selectedBranch?.name || 'Grace Central Cathedral'}
              </h1>
              <ChevronDown size={13} className="shrink-0 opacity-80" style={{ color: textColor }} />
            </div>
            <span className="text-[9px] font-mono block leading-none mt-0.5" style={{ color: mutedColor }}>
              {selectedBranch?.city || 'Koduvai'} • {selectedBranch?.isHQ ? 'HQ' : 'Branch'}
            </span>
          </div>
        </div>

        {/* 2. Real-Time Status Widget & Profile Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Real-time Header Status Widget (🟢 Online / 🔴 Local Vault / 🔄 Syncing...) */}
          <div
            onClick={() => onOpenSettings ? onOpenSettings('cloud') : setIsUserMenuOpen?.(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md cursor-pointer active:scale-95 transition text-[10px] font-mono font-bold"
            style={{
              background: 'rgba(15, 23, 42, 0.70)',
              borderColor: mode === 'online' 
                ? 'rgba(16, 185, 129, 0.35)' 
                : mode === 'syncing' 
                ? 'rgba(6, 182, 212, 0.35)' 
                : 'rgba(244, 63, 94, 0.35)'
            }}
            title={mode === 'online' ? `Synced at ${lastSyncedTime}` : 'Tap to manage vault'}
          >
            {mode === 'online' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-emerald-400 hidden xs:inline">Online</span>
                <span className="text-emerald-300/80 text-[9px]">{lastSyncedTime || 'Live'}</span>
              </>
            )}

            {mode === 'syncing' && (
              <>
                <RefreshCw size={10} className="text-cyan-400 animate-spin shrink-0" />
                <span className="text-cyan-300">Syncing...</span>
              </>
            )}

            {mode === 'local' && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="text-rose-400">Local Vault</span>
              </>
            )}
          </div>

          {/* Notification Bell */}
          <button 
            type="button"
            onClick={() => alert("All notifications caught up")}
            className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer active:scale-90 transition backdrop-blur-md"
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              borderColor: theme?.cardBorder || 'rgba(255, 255, 255, 0.15)',
              color: textColor
            }}
          >
            <Bell size={13} style={{ color: textColor }} />
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setIsUserMenuOpen?.(true)}
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-[11px] text-white shadow-sm cursor-pointer active:scale-90 transition overflow-hidden"
            style={{ 
              background: accentColor,
              borderColor: accentColor
            }}
          >
            RS
          </div>
        </div>

      </div>
    </header>
  );
}

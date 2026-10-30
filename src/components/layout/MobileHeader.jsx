// src/components/layout/MobileHeader.jsx
import React from 'react';
import { ChevronDown, Bell } from 'lucide-react';

export default function MobileHeader({
  selectedBranch,
  theme = {},
  setIsChurchModalOpen,
  setIsUserMenuOpen
}) {
  const textColor = theme?.textMain || '#ffffff';
  const mutedColor = theme?.textMuted || 'rgba(255, 255, 255, 0.7)';
  const accentColor = theme?.accent || '#f59e0b';

  return (
    <header className="relative z-40 w-full pt-3 pb-1 select-none">
      <div className="max-w-lg mx-auto px-5 flex items-center justify-between">
        
        {/* 1. சர்ச் கேப்சூல் (வண்ணங்கள் தீமுக்கு ஏற்ப மாறும்) */}
        <div 
          onClick={() => setIsChurchModalOpen?.(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border backdrop-blur-md shadow-sm cursor-pointer active:scale-95 transition"
          style={{
            background: 'transparent',
            borderColor: theme?.cardBorder || 'rgba(255, 255, 255, 0.22)'
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
              <h1 className="text-xs font-black tracking-tight max-w-[135px] truncate leading-tight" style={{ color: textColor }}>
                {selectedBranch?.name || 'Grace Central Cathedral'}
              </h1>
              <ChevronDown size={13} className="shrink-0 opacity-80" style={{ color: textColor }} />
            </div>
            <span className="text-[9px] font-mono block leading-none mt-0.5" style={{ color: mutedColor }}>
              {selectedBranch?.city || 'Koduvai'} • {selectedBranch?.isHQ ? 'HQ' : 'Branch'}
            </span>
          </div>
        </div>

        {/* 2. பெல் மற்றும் அவதார் (தீம் நிறத்தில் மாறும்) */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            type="button"
            onClick={() => alert("அறிவிப்புகள் ஏதுமில்லை")}
            className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer active:scale-90 transition backdrop-blur-md"
            style={{
              background: 'transparent',
              borderColor: theme?.cardBorder || 'rgba(255, 255, 255, 0.22)',
              color: textColor
            }}
          >
            <Bell size={14} style={{ color: textColor }} />
          </button>

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
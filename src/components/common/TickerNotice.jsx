// src/components/common/TickerNotice.jsx
import React from 'react';
import { Flame } from 'lucide-react';

export default function TickerNotice({ theme = {} }) {
  const textColor = theme?.textMain || '#ffffff';
  const accentColor = theme?.accent || '#f59e0b';

  return (
    <div className="max-w-lg mx-auto px-5 pt-2 pb-1">
      <div 
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border backdrop-blur-md shadow-lg overflow-hidden select-none transition"
        style={{
          background: 'transparent',
          borderColor: theme?.cardBorder || 'rgba(255, 255, 255, 0.22)'
        }}
      >
        <div 
          className="flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shrink-0 shadow-sm border border-white/20"
          style={{ background: accentColor }}
        >
          <Flame size={12} className="animate-pulse" />
          <span>Notice</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap text-xs font-medium" style={{ color: textColor }}>
          <div className="inline-block animate-marquee tracking-wide text-[11px]">
            Sunday 1st Service begins at 08:30 AM • Annual General Body Meeting scheduled next week • Fasting prayer on Friday evening.
          </div>
        </div>
      </div>
    </div>
  );
}
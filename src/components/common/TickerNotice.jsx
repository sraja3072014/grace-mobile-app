// src/components/common/TickerNotice.jsx
import React from 'react';
import { Flame } from 'lucide-react';

export default function TickerNotice({ 
  theme, 
  noticeText = "Sunday 1st Service begins at 08:30 AM • Annual General Body Meeting scheduled next week • Fasting Prayer on Friday at 10:00 AM • Member Directory updated." 
}) {
  return (
    <div className="relative z-10 max-w-lg mx-auto px-5 pt-3">
      <div 
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border backdrop-blur-xl shadow-xs overflow-hidden"
        style={{ 
          background: theme.glassBg, 
          borderColor: theme.glassBorder 
        }}
      >
        {/* நிலையாக நிற்கும் NOTICE Badge */}
        <span 
          className="shrink-0 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-xs" 
          style={{ background: theme.accent }}
        >
          <Flame size={10} className="animate-pulse" /> NOTICE
        </span>

        {/* வலமிருந்து இடமாக ஓடும் எழுத்துக்கள் (Running Ticker) */}
        <div className="overflow-hidden whitespace-nowrap w-full flex relative">
          <div className="inline-block animate-marquee whitespace-nowrap text-[11px] font-medium opacity-90 pl-2">
            {noticeText} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {noticeText}
          </div>
        </div>
      </div>
    </div>
  );
}
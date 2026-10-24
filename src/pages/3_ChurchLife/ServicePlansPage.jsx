// src/pages/3_ChurchLife/ServicePlansPage.jsx
import React from 'react';
import { ClipboardList, Clock, Music, BookOpen, Mic, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function ServicePlansPage({ theme }) {
  const serviceItems = [
    { time: '08:30 AM', segment: 'Opening Prayer & Invocation', leader: 'Bro. Samuel Raj', icon: BookOpen, duration: '10 min' },
    { time: '08:40 AM', segment: 'Praise & Adoration Worship', leader: 'Bro. David Paulraj & Choir', icon: Music, duration: '35 min' },
    { time: '09:15 AM', segment: 'Tithes & Thanksgiving Offering', leader: 'Pastoral Deacon Desk', icon: ClipboardList, duration: '15 min' },
    { time: '09:30 AM', segment: 'Sermon: "Walking in Faith and Authority"', leader: 'Lead Pastor Raja S', icon: Mic, duration: '45 min' },
    { time: '10:15 AM', segment: 'Pastoral Blessing & Benediction', leader: 'Ps. Raja S', icon: CheckCircle2, duration: '10 min' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="px-1">
        <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
          <ClipboardList size={18} style={{ color: theme.accent }} />
          <span>Sunday Service Order of Flow</span>
        </h2>
        <span className="text-[11px] opacity-60 font-semibold">October 25, 2026 • 1st Morning Worship Flow</span>
      </div>

      {/* Service Order Timeline Cards */}
      <div className="space-y-2.5">
        {serviceItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <GlassCard key={idx} theme={theme} className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs shrink-0"
                  style={{ background: theme.glassBorder, color: theme.accent }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold opacity-60 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10 font-bold opacity-70">
                      {item.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold leading-tight mt-0.5">{item.segment}</h4>
                  <span className="text-[10px] opacity-70">Assigned: <strong className="opacity-90">{item.leader}</strong></span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
}
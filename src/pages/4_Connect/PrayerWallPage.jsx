// src/pages/4_Connect/PrayerWallPage.jsx
import React, { useState } from 'react';
import { HeartHandshake, Heart, Plus, Clock, ShieldCheck } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function PrayerWallPage({ theme }) {
  const [prayers, setPrayers] = useState([
    {
      id: 1,
      name: 'Bro. David Paulraj',
      request: 'Prayer for daughter’s higher education admissions and visa approval.',
      prayedCount: 38,
      time: '2 hours ago',
      isUrgent: false
    },
    {
      id: 2,
      name: 'Sister Sarah Jenkins',
      request: 'Urgent prayer for mother admitted in hospital for cardiac treatment.',
      prayedCount: 72,
      time: '4 hours ago',
      isUrgent: true
    },
    {
      id: 3,
      name: 'Anonymous Believer',
      request: 'Deliverance and peace for our family business relocation.',
      prayedCount: 25,
      time: 'Yesterday',
      isUrgent: false
    }
  ]);

  const handlePray = (id) => {
    setPrayers(prayers.map(p => p.id === id ? { ...p, prayedCount: p.prayedCount + 1 } : p));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <HeartHandshake size={18} style={{ color: theme.accent }} />
            <span>Community Prayer Wall</span>
          </h2>
          <span className="text-[11px] opacity-60 font-semibold">Intercession, Healing & Deliverance Chain</span>
        </div>
        <button
          type="button"
          onClick={() => alert("Submit Prayer Request Form opened")}
          className="p-2 rounded-2xl text-white shadow-md active:scale-95 transition cursor-pointer"
          style={{ background: theme.accent }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Prayers List */}
      <div className="space-y-2.5">
        {prayers.map((p) => (
          <GlassCard className="p-3.5 space-y-2" key={p.id} theme={theme}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold">{p.name}</h4>
                {p.isUrgent && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-500 border border-rose-500/30">
                    URGENT
                  </span>
                )}
              </div>
              <span className="text-[10px] opacity-60 font-mono">{p.time}</span>
            </div>

            <p className="text-xs leading-relaxed opacity-90">
              "{p.request}"
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
              <span className="text-[10px] opacity-60">
                <strong className="text-orange-500">{p.prayedCount}</strong> believers interceded
              </span>
              <button
                type="button"
                onClick={() => handlePray(p.id)}
                className="px-3 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
                style={{ borderColor: theme.glassBorder, color: theme.accent }}
              >
                <Heart className="fill-current" size={12} />
                <span>Prayed</span>
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}
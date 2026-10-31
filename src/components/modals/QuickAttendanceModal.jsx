// src/components/modals/QuickAttendanceModal.jsx
import React, { useState } from 'react';
import { CalendarCheck, Search, UserPlus } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function QuickAttendanceModal({
  isOpen,
  onClose,
  onMarkAttendance,
  onRegisterMember,
  theme = {}
}) {
  const [selectedService, setSelectedService] = useState('Sunday 1st Morning Service (08:30 AM)');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleBelievers = [
    { id: 'MBR-01', name: 'Bro. David Paulraj', phone: '+91 98401 23456', family: 'Paulraj Household' },
    { id: 'MBR-02', name: 'Sister Sarah Jenkins', phone: '+91 98765 11001', family: 'Jenkins Family' },
    { id: 'MBR-03', name: 'Bro. Samuel Raj', phone: '+91 98421 99002', family: 'Samuel Household' },
    { id: 'MBR-04', name: 'Pastor Johnraja', phone: '+91 84280 44555', family: 'Johnraja Household' }
  ];

  const handleGoToRegister = () => {
    onClose?.();
    onRegisterMember?.();
  };

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Congregation Check-in"
      icon={CalendarCheck}
      theme={theme}
    >
      <div className="space-y-3">
        {/* Service Selector */}
        <div className="p-3 rounded-2xl bg-black/20 border border-white/15 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
            Worship Service:
          </label>
          <select 
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer text-white"
          >
            <option>Sunday 1st Morning Service (08:30 AM)</option>
            <option>Sunday 2nd English Service (10:30 AM)</option>
            <option>Evening Youth Service (06:00 PM)</option>
            <option>Wednesday Midweek Bible Study (07:00 PM)</option>
          </select>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input 
            type="text" 
            placeholder="Search believer name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-black/30 text-xs focus:outline-none focus:border-cyan-400 text-white placeholder-slate-400"
          />
        </div>

        {/* Believers List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {sampleBelievers
            .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.phone.includes(searchQuery))
            .map((b) => (
              <div 
                key={b.id} 
                className="flex justify-between items-center p-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition"
              >
                <div>
                  <h4 className="font-bold text-xs">{b.name}</h4>
                  <span className="text-[10px] opacity-70 block">{b.family} • {b.phone}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    onMarkAttendance?.(b);
                    alert(`Checked-in: ${b.name}`);
                  }}
                  className="px-3 py-1.5 rounded-xl text-white font-bold text-[11px] shadow-xs active:scale-95 transition cursor-pointer"
                  style={{ background: theme.accent || '#06b6d4' }}
                >
                  Check In
                </button>
              </div>
            ))}
        </div>

        {/* 🌟 Direct Registration Route Bar */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Believer not found?</span>
          <button
            type="button"
            onClick={handleGoToRegister}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs active:scale-95 transition cursor-pointer hover:bg-cyan-500/20"
          >
            <UserPlus size={13} />
            <span>Register Member</span>
          </button>
        </div>

      </div>
    </CenterModal>
  );
}

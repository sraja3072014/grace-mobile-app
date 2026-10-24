// src/components/modals/QuickAttendanceModal.jsx
import React, { useState } from 'react';
import { CalendarCheck, Search } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function QuickAttendanceModal({
  isOpen,
  onClose,
  onMarkAttendance,
  theme
}) {
  const [selectedService, setSelectedService] = useState('Sunday 1st Morning Service (08:30 AM)');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleBelievers = [
    { id: 'MBR-01', name: 'Bro. David Paulraj', phone: '+91 98401 23456', family: 'Paulraj Household' },
    { id: 'MBR-02', name: 'Sister Sarah Jenkins', phone: '+91 98765 11001', family: 'Jenkins Family' },
    { id: 'MBR-03', name: 'Bro. Samuel Raj', phone: '+91 98421 99002', family: 'Samuel Household' }
  ];

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
        <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/40 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
            Worship Service:
          </label>
          <select 
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-white/70 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option>Sunday 1st Morning Service (08:30 AM)</option>
            <option>Sunday 2nd English Service (10:30 AM)</option>
            <option>Evening Youth Service (06:00 PM)</option>
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
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none"
          />
        </div>

        {/* Believers List */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {sampleBelievers
            .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.phone.includes(searchQuery))
            .map((b) => (
              <div 
                key={b.id} 
                className="flex justify-between items-center p-2.5 rounded-xl border border-white/40 bg-white/40 dark:bg-white/5"
              >
                <div>
                  <h4 className="font-bold">{b.name}</h4>
                  <span className="text-[10px] opacity-70">{b.family} • {b.phone}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    onMarkAttendance?.(b);
                    alert(`Marked Present: ${b.name}`);
                  }}
                  className="px-3 py-1.5 rounded-xl text-white font-bold text-[11px] shadow-xs active:scale-95 transition cursor-pointer"
                  style={{ background: theme.accent }}
                >
                  Check In
                </button>
              </div>
            ))}
        </div>
      </div>
    </CenterModal>
  );
}
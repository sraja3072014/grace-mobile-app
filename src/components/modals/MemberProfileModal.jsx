// src/components/modals/MemberProfileModal.jsx
import React from 'react';
import { UserPlus } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function MemberProfileModal({
  isOpen,
  onClose,
  profileForm,
  setProfileForm,
  onSave,
  theme
}) {
  const toggleMinistry = (m) => {
    setProfileForm(prev => ({
      ...prev,
      ministries: prev.ministries?.includes(m)
        ? prev.ministries.filter(x => x !== m)
        : [...(prev.ministries || []), m]
    }));
  };

  const ministriesList = ['Worship', 'Women', 'Evangelism', 'Intercession', 'Youth', 'Children', 'Men', 'Others'];

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Believer Profile & Intake"
      icon={UserPlus}
      theme={theme}
      maxHeight="max-h-[85vh]"
    >
      <form onSubmit={(e) => { e.preventDefault(); onSave?.(); onClose(); }} className="space-y-4">
        
        {/* Personal Information */}
        <span className="text-xs font-black uppercase tracking-wider block" style={{ color: theme.accent }}>
          Personal Information
        </span>
        
        <div>
          <label className="text-[10px] font-bold block mb-1">Full Name *</label>
          <input 
            type="text" 
            value={profileForm.name || ''} 
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-bold"
            required 
          />
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Contact Phone *</label>
          <input 
            type="text" 
            value={profileForm.phone || ''} 
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono"
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold block mb-1">City</label>
            <input 
              type="text" 
              value={profileForm.city || ''} 
              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold block mb-1">Address</label>
            <input 
              type="text" 
              value={profileForm.address || ''} 
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5" 
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {['Male', 'Female'].map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setProfileForm({ ...profileForm, gender: g })}
                className={`py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  profileForm.gender === g 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs' 
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Important Dates */}
        <span className="text-xs font-black uppercase tracking-wider block pt-2" style={{ color: theme.accent }}>
          Important Dates
        </span>
        
        <div>
          <label className="text-[10px] font-bold block mb-1">Since when attending church?</label>
          <input 
            type="text" 
            value={profileForm.attendingSince || ''} 
            onChange={(e) => setProfileForm({ ...profileForm, attendingSince: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono" 
          />
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Baptized?</label>
          <div className="grid grid-cols-2 gap-2">
            {['Yes', 'No'].map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setProfileForm({ ...profileForm, baptized: b })}
                className={`py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  profileForm.baptized === b 
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs' 
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Ministries & Roles */}
        <span className="text-xs font-black uppercase tracking-wider block pt-2" style={{ color: theme.accent }}>
          Church Ministries & Role
        </span>
        
        <div className="flex flex-wrap gap-2">
          {ministriesList.map((m) => {
            const isSelected = profileForm.ministries?.includes(m);
            return (
              <button
                type="button"
                key={m}
                onClick={() => toggleMinistry(m)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition cursor-pointer ${
                  isSelected 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs' 
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Title or Role</label>
          <input 
            type="text" 
            value={profileForm.role || ''} 
            onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-semibold" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 rounded-2xl text-white font-bold text-xs shadow-lg active:scale-95 transition mt-2 cursor-pointer"
          style={{ background: theme.accent }}
        >
          Save Believer Profile
        </button>
      </form>
    </CenterModal>
  );
}
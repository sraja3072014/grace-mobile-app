// src/pages/1_Overview/OverviewTab.jsx
import React from 'react';
import { 
  Calendar, Users, DollarSign, MessageSquare, 
  MapPin, Heart, HandHelping, Church, 
  Database, Cloud, UserPlus, Sparkles, ArrowRight
} from 'lucide-react';

// 🌟 Outer Border, Transparent Center, Bottom Glow Acrylic Glass Card
function MultiLayerGlassCard({ children, className = '', glowColor = 'rgba(6, 182, 212, 0.25)', onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`relative rounded-[28px] p-4 transition-all duration-300 overflow-hidden select-none border backdrop-blur-md ${
        onClick ? 'cursor-pointer active:scale-98 hover:shadow-xl' : ''
      } ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(0, 0, 0, 0.20) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.18)',
        boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 12px 30px -8px ${glowColor}`
      }}
    >
      <div 
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl pointer-events-none opacity-30"
        style={{ background: glowColor }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function OverviewTab({ 
  theme = {}, 
  userProfile = {}, 
  onOpenAttendance, 
  onOpenMembers, 
  onRegisterMember,
  onOpenFinance,
  onOpenSettings
}) {
  const textColor = theme?.textMain || '#ffffff';
  const mutedTextColor = theme?.textMuted || 'rgba(255, 255, 255, 0.7)';
  const accentColor = theme?.accent || '#06b6d4';

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-10 select-none">
      
      {/* ========================================================= */}
      {/* 🌟 1. System Preferences Shortcuts: Deep Linking Banner */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-2.5">
        <div 
          onClick={() => onOpenSettings?.('vault')}
          className="p-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md cursor-pointer active:scale-98 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Database size={15} className="text-cyan-400" />
            </div>
            <div>
              <span className="font-bold text-xs block leading-tight text-white">Local Vault</span>
              <span className="text-[9px] font-mono text-cyan-300/80">Device Storage & Backups</span>
            </div>
          </div>
          <ArrowRight size={13} className="text-cyan-400 opacity-70" />
        </div>

        <div 
          onClick={() => onOpenSettings?.('cloud')}
          className="p-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md cursor-pointer active:scale-98 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Cloud size={15} className="text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-xs block leading-tight text-white">Cloud Sync</span>
              <span className="text-[9px] font-mono text-indigo-300/80">Supabase Zero-Hardcode</span>
            </div>
          </div>
          <ArrowRight size={13} className="text-indigo-400 opacity-70" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🌟 2. Direct Member Registration Quick Route Bar */}
      {/* ========================================================= */}
      <div 
        onClick={() => onRegisterMember ? onRegisterMember() : onOpenMembers?.()}
        className="p-3.5 rounded-2xl border border-white/15 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-transparent backdrop-blur-md flex items-center justify-between cursor-pointer active:scale-98 transition shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: accentColor }}
          >
            <UserPlus size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white leading-tight">Register New Believer / Household</h4>
            <span className="text-[10px] opacity-70 block text-slate-300 mt-0.5">
              1-Tap registration flow with auto gender suggestions
            </span>
          </div>
        </div>
        <span 
          className="px-2.5 py-1 rounded-xl text-[10px] font-black text-white shrink-0"
          style={{ background: accentColor }}
        >
          + Add
        </span>
      </div>

      {/* ========================================================= */}
      {/* 🌟 3. Top Metrics Row (4 Glass Boxes) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2">
        {/* Upcoming */}
        <MultiLayerGlassCard glowColor="rgba(6, 182, 212, 0.3)" className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <Calendar size={13} className="text-cyan-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Upcoming</span>
          </div>
          <div className="text-base font-black flex items-center gap-0.5 leading-none" style={{ color: textColor }}>
            <span className="text-cyan-400 text-xs">▲</span> 4
          </div>
        </MultiLayerGlassCard>

        {/* Attendance */}
        <MultiLayerGlassCard glowColor="rgba(16, 185, 129, 0.3)" onClick={onOpenAttendance} className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <Users size={13} className="text-emerald-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Attend</span>
          </div>
          <div className="text-base font-black leading-none" style={{ color: textColor }}>
            142
          </div>
        </MultiLayerGlassCard>

        {/* Donations */}
        <MultiLayerGlassCard glowColor="rgba(245, 158, 11, 0.3)" onClick={onOpenFinance} className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <DollarSign size={13} className="text-amber-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Tithe</span>
          </div>
          <div className="text-sm font-black leading-none font-mono" style={{ color: textColor }}>
            $2,850
          </div>
        </MultiLayerGlassCard>

        {/* Messages */}
        <MultiLayerGlassCard glowColor="rgba(139, 92, 246, 0.3)" className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <MessageSquare size={13} className="text-purple-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Prayers</span>
          </div>
          <div className="text-base font-black leading-none" style={{ color: textColor }}>
            12
          </div>
        </MultiLayerGlassCard>
      </div>

      {/* ========================================================= */}
      {/* 🌟 4. Upcoming Events & Announcements */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* Events */}
        <MultiLayerGlassCard glowColor="rgba(245, 158, 11, 0.25)" className="p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-black" style={{ color: textColor }}>Sanctuary Events</h3>
              <span className="text-[9px] text-amber-400 font-bold flex items-center">View →</span>
            </div>

            <div className="space-y-2 mt-2.5">
              <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2 hover:bg-white/[0.08] transition">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Church size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold leading-tight" style={{ color: textColor }}>Sunday Service</div>
                  <div className="text-[9px] opacity-70 mt-0.5" style={{ color: mutedTextColor }}>08:30 AM & 10:30 AM</div>
                </div>
              </div>

              <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2 hover:bg-white/[0.08] transition">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold leading-tight" style={{ color: textColor }}>Midweek Study</div>
                  <div className="text-[9px] opacity-70 mt-0.5" style={{ color: mutedTextColor }}>Wed • 07:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </MultiLayerGlassCard>

        {/* Announcements */}
        <MultiLayerGlassCard glowColor="rgba(6, 182, 212, 0.25)" className="p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-black" style={{ color: textColor }}>Notice Board</h3>
              <span className="text-[9px] text-cyan-400 font-bold flex items-center">Live →</span>
            </div>

            <div className="space-y-2.5 mt-2.5 text-[10px]">
              <div className="flex items-start gap-1.5 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                <span style={{ color: textColor }}>Easter Outreach This Saturday at Central Park</span>
              </div>
              <div className="flex items-start gap-1.5 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1" />
                <span style={{ color: textColor }}>Youth Worship Night Registration Open</span>
              </div>
            </div>
          </div>
          <div className="pt-2 text-right">
            <span className="text-[8px] font-mono opacity-50 uppercase">Updated live</span>
          </div>
        </MultiLayerGlassCard>
      </div>

      {/* ========================================================= */}
      {/* 🌟 5. Quick Touch Buttons */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2">
        <button 
          type="button"
          onClick={onOpenAttendance}
          className="p-3 rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
        >
          <MapPin size={18} className="text-white" />
          <span className="text-[10px] font-black text-white">Check-In</span>
        </button>

        <button 
          type="button"
          onClick={onOpenFinance}
          className="p-3 rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
        >
          <Heart size={18} className="text-white fill-white/20" />
          <span className="text-[10px] font-black text-white">Tithe / Give</span>
        </button>

        <button 
          type="button"
          onClick={onOpenMembers}
          className="p-3 rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <Users size={18} className="text-white" />
          <span className="text-[10px] font-black text-white">Directory</span>
        </button>

        <button 
          type="button"
          onClick={() => onOpenSettings?.('theme')}
          className="p-3 rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' }}
        >
          <Sparkles size={18} className="text-white" />
          <span className="text-[9px] font-black text-white leading-tight">Theme Polish</span>
        </button>
      </div>

    </div>
  );
}

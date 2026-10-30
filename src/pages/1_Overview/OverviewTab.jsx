// src/pages/1_Overview/OverviewTab.jsx
import React from 'react';
import { 
  Calendar, Users, DollarSign, MessageSquare, 
  MapPin, Heart, HandHelping, Church, 
  ChevronRight, ArrowUpRight, CheckCircle2, Clock
} from 'lucide-react';

// 🌟 Outer Border, Transparent Center, Bottom Glow கொண்ட பல அடுக்கு கிளாஸ் கார்டு
function MultiLayerGlassCard({ children, className = '', glowColor = 'rgba(244, 63, 94, 0.25)', onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`relative rounded-[28px] p-4 transition-all duration-300 overflow-hidden select-none border backdrop-blur-md ${
        onClick ? 'cursor-pointer active:scale-98 hover:shadow-xl' : ''
      } ${className}`}
      style={{
        // Center: 100% தூய ஒளிபுகும் கண்ணாடி
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(0, 0, 0, 0.15) 100%)',
        // Outer Layer: மல்டி கலர் விளிம்பு
        borderColor: 'rgba(255, 255, 255, 0.28)',
        boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 12px 30px -8px ${glowColor}`
      }}
    >
      {/* Bottom Layer Glow (அடிப்புறத்தில் மட்டும் ஒளிரும் வண்ண நிழல்) */}
      <div 
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl pointer-events-none opacity-40"
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
  onOpenFinance 
}) {
  const textColor = theme?.textMain || '#ffffff';
  const mutedTextColor = theme?.textMuted || 'rgba(255, 255, 255, 0.7)';
  const accentColor = theme?.accent || '#f59e0b';

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-10">
      
      {/* ========================================================= */}
      {/* 🌟 1. முதல் வரிசை: 4 மெட்ரிக் பாக்ஸ்கள் (படத்தின் மேற்பகுதி) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2">
        {/* Upcoming */}
        <MultiLayerGlassCard glowColor="rgba(56, 189, 248, 0.3)" className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <Calendar size={13} className="text-sky-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Upcoming</span>
          </div>
          <div className="text-base font-black flex items-center gap-0.5 leading-none" style={{ color: textColor }}>
            <span className="text-sky-400 text-xs">▲</span> 4
          </div>
        </MultiLayerGlassCard>

        {/* Attendance */}
        <MultiLayerGlassCard glowColor="rgba(52, 211, 153, 0.3)" onClick={onOpenAttendance} className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <Users size={13} className="text-emerald-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Attend</span>
          </div>
          <div className="text-base font-black leading-none" style={{ color: textColor }}>
            125
          </div>
        </MultiLayerGlassCard>

        {/* Donations */}
        <MultiLayerGlassCard glowColor="rgba(251, 146, 60, 0.3)" onClick={onOpenFinance} className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <DollarSign size={13} className="text-amber-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Donations</span>
          </div>
          <div className="text-sm font-black leading-none font-mono" style={{ color: textColor }}>
            $2,450
          </div>
        </MultiLayerGlassCard>

        {/* Messages */}
        <MultiLayerGlassCard glowColor="rgba(168, 85, 247, 0.3)" className="p-2.5 flex flex-col justify-between h-20 text-center items-center">
          <div className="flex items-center gap-1 opacity-80">
            <MessageSquare size={13} className="text-purple-400" />
            <span className="text-[9px] font-bold" style={{ color: mutedTextColor }}>Messages</span>
          </div>
          <div className="text-base font-black leading-none" style={{ color: textColor }}>
            8
          </div>
        </MultiLayerGlassCard>
      </div>

      {/* ========================================================= */}
      {/* 🌟 2. இரண்டாம் வரிசை: Upcoming Events & Announcements */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* இடதுபுற பாக்ஸ்: Upcoming Events */}
        <MultiLayerGlassCard glowColor="rgba(249, 115, 22, 0.25)" className="p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-black" style={{ color: textColor }}>Upcoming Events</h3>
              <span className="text-[9px] text-amber-400 font-bold flex items-center">View All →</span>
            </div>

            <div className="space-y-2 mt-2.5">
              {/* Event 1: Sunday Service */}
              <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2 hover:bg-white/[0.08] transition">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Church size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold leading-tight" style={{ color: textColor }}>Sunday Service</div>
                  <div className="text-[9px] opacity-70 mt-0.5" style={{ color: mutedTextColor }}>10:00 AM | Apr 25</div>
                </div>
              </div>

              {/* Event 2: Bible Study */}
              <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2 hover:bg-white/[0.08] transition">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-sky-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold leading-tight" style={{ color: textColor }}>Bible Study</div>
                  <div className="text-[9px] opacity-70 mt-0.5" style={{ color: mutedTextColor }}>Wed | Apr 27</div>
                </div>
              </div>
            </div>
          </div>
        </MultiLayerGlassCard>

        {/* வலதுபுற பாக்ஸ்: Announcements */}
        <MultiLayerGlassCard glowColor="rgba(14, 165, 233, 0.25)" className="p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-black" style={{ color: textColor }}>Announcements</h3>
              <span className="text-[9px] text-sky-400 font-bold flex items-center">See More →</span>
            </div>

            <div className="space-y-2.5 mt-2.5 text-[10px]">
              <div className="flex items-start gap-1.5 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                <span style={{ color: textColor }}>Easter Outreach This Saturday at Central Park</span>
              </div>
              <div className="flex items-start gap-1.5 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1" />
                <span style={{ color: textColor }}>Youth Retreat Registration Open (Limited Seats)</span>
              </div>
            </div>
          </div>
          <div className="pt-2 text-right">
            <span className="text-[8px] font-mono opacity-50 uppercase">Updated 10m ago</span>
          </div>
        </MultiLayerGlassCard>

      </div>

      {/* ========================================================= */}
      {/* 🌟 3. மூன்றாம் வரிசை: 4 வண்ண ஆக்ஷன் பட்டன்கள் */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2">
        {/* Check-In (Orange Gold Gradient) */}
        <button 
          type="button"
          onClick={onOpenAttendance}
          className="p-3 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
        >
          <MapPin size={18} className="text-white" />
          <span className="text-[10px] font-black text-white">Check-In</span>
        </button>

        {/* Give (Red-Pink Gradient) */}
        <button 
          type="button"
          onClick={onOpenFinance}
          className="p-3 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
        >
          <Heart size={18} className="text-white fill-white/20" />
          <span className="text-[10px] font-black text-white">Give</span>
        </button>

        {/* Volunteer (Emerald-Green Gradient) */}
        <button 
          type="button"
          className="p-3 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <HandHelping size={18} className="text-white" />
          <span className="text-[10px] font-black text-white">Volunteer</span>
        </button>

        {/* Prayer Request (Cyan-Blue Gradient) */}
        <button 
          type="button"
          className="p-3 rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-1 shadow-lg cursor-pointer active:scale-95 transition"
          style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
        >
          <Church size={18} className="text-white" />
          <span className="text-[9px] font-black text-white leading-tight">Prayer Req</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 🌟 4. நான்காம் வரிசை: Community Feed (போட்டோ & பதிவுகள்) */}
      {/* ========================================================= */}
      <MultiLayerGlassCard glowColor="rgba(168, 85, 247, 0.25)" className="p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-xs font-black tracking-wider uppercase" style={{ color: textColor }}>Community Feed</span>
          <span className="text-[10px] text-purple-400 font-bold">2 New Posts</span>
        </div>

        {/* Feed Post 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/30 border border-rose-400/50 flex items-center justify-center font-bold text-xs text-white">
              SM
            </div>
            <div>
              <div className="text-xs font-bold leading-tight" style={{ color: textColor }}>Sarah M.</div>
              <div className="text-[9px] opacity-60 font-mono" style={{ color: mutedTextColor }}>Just Now • Kids Church</div>
            </div>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: textColor }}>
            Wonderful time at the Kids Art Workshop! 🎨✨ The children crafted beautiful memory verses today.
          </p>

          {/* Feed Grid Preview */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-28 rounded-2xl bg-amber-500/10 border border-white/10 flex items-center justify-center overflow-hidden relative">
              <span className="text-[10px] font-mono opacity-60">Workshop Photo 1</span>
            </div>
            <div className="h-28 rounded-2xl bg-purple-500/10 border border-white/10 flex items-center justify-center overflow-hidden relative">
              <span className="text-[10px] font-mono opacity-60">Sanctuary Photo 2</span>
            </div>
          </div>
        </div>
      </MultiLayerGlassCard>

    </div>
  );
}
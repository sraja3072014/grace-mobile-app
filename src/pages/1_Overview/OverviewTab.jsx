// src/pages/1_Overview/OverviewTab.jsx
import React from 'react';
import { 
  Users, Building2, DollarSign, CalendarCheck, 
  HeartHandshake, AlertCircle, Landmark, Phone 
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function OverviewTab({
  theme,
  userProfile,
  totalCongregation = 1245,
  totalHouseholds = 384,
  monthGiving = 322000,
  liveCheckins = 128,
  onOpenAttendance,
  onOpenMembers,
  onOpenFinance
}) {
  const visitorPipeline = [
    { stage: '1st Visit', count: 18, desc: 'New Seekers', color: 'text-amber-500' },
    { stage: 'Pastoral Call', count: 9, desc: 'Under Care', color: 'text-sky-500' },
    { stage: 'Home Visit', count: 6, desc: 'Cell Groups', color: 'text-indigo-500' },
    { stage: 'Full Member', count: 4, desc: 'Ready to Add', color: 'text-emerald-500' }
  ];

  const criticalCareList = [
    { name: 'Bro. Sarah Jenkins', missed: 'Missed 4 Services (Last seen 1 mo ago)', phone: '+91 98765 11001' },
    { name: 'Bro. David Miller', missed: 'Missed 3 Services (Calling Pending)', phone: '+91 98765 11002' },
    { name: 'Sister Marcus Thompson', missed: 'Missed 5 Services (Home Visit Needed)', phone: '+91 98765 11003' }
  ];

  const treasuryBranches = [
    { name: 'Main Cathedral Treasury (SBI)', tithe: '65%', offering: '25%', building: '10%', total: '₹ 1,85,000' },
    { name: 'North Campus Building (HDFC)', tithe: '40%', offering: '40%', building: '20%', total: '₹ 95,000' },
    { name: 'Mission & Outreach (ICICI)', tithe: '70%', offering: '15%', building: '15%', total: '₹ 42,000' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Verse Card */}
      <GlassCard theme={theme} className="relative overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>Good Morning,</span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.4)', borderColor: theme.glassBorder }}>
            ✨ Daily Verse
          </span>
        </div>
        <h2 className="text-xl font-extrabold mt-0.5">{userProfile?.name || 'Raja S'}</h2>
        <p className="mt-2 text-xs italic font-medium leading-relaxed">
          "For where two or three gather in my name, there am I with them."
        </p>
        <span className="text-[11px] font-bold block text-right mt-1" style={{ color: theme.accent }}>
          – Matthew 18:20
        </span>
      </GlassCard>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard theme={theme} clickable onClick={onOpenMembers} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: theme.glassBorder, color: theme.accent }}>
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-base font-extrabold leading-none">{totalCongregation.toLocaleString()}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 block" style={{ color: theme.textMuted }}>Believers</span>
          </div>
        </GlassCard>

        <GlassCard theme={theme} clickable onClick={onOpenMembers} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner text-amber-500" style={{ background: theme.glassBorder }}>
            <Building2 size={18} />
          </div>
          <div>
            <h4 className="text-base font-extrabold leading-none">{totalHouseholds}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 block" style={{ color: theme.textMuted }}>Households</span>
          </div>
        </GlassCard>

        <GlassCard theme={theme} clickable onClick={onOpenFinance} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner text-emerald-500" style={{ background: theme.glassBorder }}>
            <DollarSign size={18} />
          </div>
          <div>
            <h4 className="text-base font-extrabold leading-none">₹ {monthGiving.toLocaleString()}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 block" style={{ color: theme.textMuted }}>Month Giving</span>
          </div>
        </GlassCard>

        <GlassCard theme={theme} clickable onClick={onOpenAttendance} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner text-sky-500" style={{ background: theme.glassBorder }}>
            <CalendarCheck size={18} />
          </div>
          <div>
            <h4 className="text-base font-extrabold leading-none">{liveCheckins}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 block" style={{ color: theme.textMuted }}>Live Check-ins</span>
          </div>
        </GlassCard>
      </div>

      {/* Visitor Pipeline */}
      <GlassCard theme={theme} className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-black/5 dark:border-white/5">
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.accent }}>
            <HeartHandshake size={14} /> Visitor Pipeline
          </span>
          <span className="text-[10px] font-mono font-bold opacity-70">37 Seekers Active</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {visitorPipeline.map((v, i) => (
            <div key={i} className="p-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 text-center">
              <span className="text-[9px] uppercase font-bold opacity-60 block truncate">{v.stage}</span>
              <span className={`text-base font-black ${v.color}`}>{v.count}</span>
              <span className="text-[8px] opacity-70 block truncate">{v.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Critical Care Alerts */}
      <GlassCard theme={theme} className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-rose-500">
            <AlertCircle size={14} /> Critical Care Alerts
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-bold">Action Needed</span>
        </div>
        <div className="space-y-2">
          {criticalCareList.map((person, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 flex items-center justify-between">
              <div className="overflow-hidden pr-2">
                <div className="text-xs font-bold truncate">{person.name}</div>
                <div className="text-[10px] text-rose-500 font-medium truncate">{person.missed}</div>
              </div>
              <button 
                type="button"
                onClick={() => alert(`Calling ${person.name}...`)}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition cursor-pointer"
              >
                <Phone size={13} />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Campus Treasury Split */}
      <GlassCard theme={theme} className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
            <Landmark size={14} /> Campus Treasury Split
          </span>
          <span className="text-[10px] font-mono text-emerald-500 font-bold">Live Ledger</span>
        </div>
        <div className="space-y-2">
          {treasuryBranches.map((b, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[11px] truncate">{b.name}</span>
                <span className="font-mono text-emerald-500 font-extrabold">{b.total}</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-black/10 dark:bg-white/10">
                <div className="bg-amber-400 h-full" style={{ width: b.tithe }} />
                <div className="bg-rose-500 h-full" style={{ width: b.offering }} />
                <div className="bg-emerald-400 h-full" style={{ width: b.building }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Upcoming Events Carousel */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-sm font-extrabold">Upcoming Events</h3>
          <span className="text-xs font-bold cursor-pointer" style={{ color: theme.accent }}>View All</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {[
            { m: 'Apr', d: '25', title: 'Sunday Worship Service', time: '08:30 AM • Main Sanctuary', img: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=400&q=80' },
            { m: 'Apr', d: '27', title: 'Youth Bible Study', time: '06:00 PM • Room 4', img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=400&q=80' },
            { m: 'May', d: '02', title: 'Kids Sunday Workshop', time: '04:00 PM • Fellowship Hall', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' }
          ].map((evt, idx) => (
            <div 
              key={idx}
              className="min-w-[240px] p-3.5 rounded-[24px] border backdrop-blur-xl snap-start relative flex flex-col justify-between shadow-sm cursor-pointer"
              style={{
                background: theme.glassBg,
                borderColor: theme.glassBorder
              }}
            >
              <div 
                className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-lg text-center border backdrop-blur-md"
                style={{ background: 'rgba(255, 255, 255, 0.4)', borderColor: theme.glassBorder }}
              >
                <span className="text-[9px] font-bold uppercase block" style={{ color: theme.accent }}>{evt.m}</span>
                <span className="text-xs font-extrabold leading-none">{evt.d}</span>
              </div>
              <div className="w-full h-24 rounded-2xl mb-2.5 bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${evt.img})` }} />
              <div>
                <h4 className="text-xs font-extrabold">{evt.title}</h4>
                <p className="text-[11px] mt-0.5" style={{ color: theme.textMuted }}>{evt.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
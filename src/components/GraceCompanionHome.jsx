import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare, 
  ChevronRight, 
  MapPin, 
  Heart, 
  Hand, 
  Sparkles, 
  MessageCircle, 
  Home, 
  Radio, 
  Settings,
  Bell,
  CloudSun
} from 'lucide-react';

export default function GraceCompanionHome() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11161d] via-[#0b0e13] to-[#06070a] text-stone-100 pb-28 relative overflow-x-hidden font-sans">
      
      {/* Dynamic Background Warm Glow Spheres */}
    <div className="absolute -top-24 -left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-96 -right-20 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      {/* Main Container */}
      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 space-y-4">
        
        {/* 1. HEADER & TODAY'S VERSE HERO CARD */}
        <header className="rounded-3xl p-5 border border-orange-500/25 bg-white/[0.04] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-semibold text-orange-400 tracking-wider uppercase">GraceOS Companion</span>
              <h1 className="text-xl font-extrabold text-white">Good Morning, Raja,</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300">
                <CloudSun size={14} /> 32°C
              </span>
              <button className="p-2 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white">
                <Bell size={16} />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold text-orange-400/90 uppercase tracking-wide block">Today's Verse:</span>
            <p className="text-xs text-stone-200 mt-1 italic font-medium leading-relaxed">
              "For where two or three gather in my name, there am I with them."
            </p>
            <span className="text-[11px] text-orange-400 font-semibold block text-right mt-1">
              – Matthew 18:20
            </span>
          </div>
        </header>

        {/* 2. 4 QUICK METRIC STAT CARDS */}
        <div className="grid grid-cols-4 gap-2">
          {/* Upcoming */}
          <div className="p-2.5 rounded-2xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-lg flex flex-col items-center text-center shadow-lg">
            <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400 mb-1">
              <Calendar size={16} />
            </div>
            <span className="text-[10px] text-stone-400 font-medium leading-tight">Upcoming</span>
            <span className="text-sm font-extrabold text-white mt-0.5">▲ 4</span>
          </div>

          {/* Attendance */}
          <div className="p-2.5 rounded-2xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-lg flex flex-col items-center text-center shadow-lg">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 mb-1">
              <Users size={16} />
            </div>
            <span className="text-[10px] text-stone-400 font-medium leading-tight">Attendance</span>
            <span className="text-sm font-extrabold text-white mt-0.5">125</span>
          </div>

          {/* Donations */}
          <div className="p-2.5 rounded-2xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-lg flex flex-col items-center text-center shadow-lg">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 mb-1">
              <DollarSign size={16} />
            </div>
            <span className="text-[10px] text-stone-400 font-medium leading-tight">Donations</span>
            <span className="text-sm font-extrabold text-white mt-0.5">$2,450</span>
          </div>

          {/* Messages */}
          <div className="p-2.5 rounded-2xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-lg flex flex-col items-center text-center shadow-lg">
            <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 mb-1">
              <MessageSquare size={16} />
            </div>
            <span className="text-[10px] text-stone-400 font-medium leading-tight">Messages</span>
            <span className="text-sm font-extrabold text-white mt-0.5">8</span>
          </div>
        </div>

        {/* 3. UPCOMING EVENTS & ANNOUNCEMENTS (Side-by-Side Grid) */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Upcoming Events Card */}
          <div className="p-3.5 rounded-2xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5">Upcoming Events</h3>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-black/30 border border-white/5 flex gap-2 items-center">
                  <div className="w-9 h-9 rounded-lg bg-[url('https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=150&q=80')] bg-cover shrink-0" />
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-bold text-stone-200 truncate">Sunday Service</h4>
                    <p className="text-[9px] text-stone-400">10:00AM | Apr 25</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-black/30 border border-white/5 flex gap-2 items-center">
                  <div className="w-9 h-9 rounded-lg bg-[url('https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=150&q=80')] bg-cover shrink-0" />
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-bold text-stone-200 truncate">Bible Study</h4>
                    <p className="text-[9px] text-stone-400">Wed | Apr 27</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 mt-3 pt-2 border-t border-white/5 w-full">
              View All <ChevronRight size={12} />
            </button>
          </div>

          {/* Announcements Card */}
          <div className="p-3.5 rounded-2xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5">Announcements</h3>
              <div className="space-y-2.5 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                  <p className="text-stone-300 font-medium leading-tight">Easter Outreach This Saturday</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                  <p className="text-stone-300 font-medium leading-tight">Youth Retreat Registration Open</p>
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 mt-3 pt-2 border-t border-white/5 w-full">
              See More <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* 4. 4 QUICK ACTION GLASS TILES (Check-In, Give, Volunteer, Prayer Request) */}
        <div className="grid grid-cols-4 gap-2">
          {/* Check-In */}
          <button className="p-3 rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-500/20 to-orange-500/5 backdrop-blur-xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
              <MapPin size={16} />
            </div>
            <span className="text-[10px] font-bold text-white">Check-In</span>
          </button>

          {/* Give */}
          <button className="p-3 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-500/20 to-rose-500/5 backdrop-blur-xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart size={16} />
            </div>
            <span className="text-[10px] font-bold text-white">Give</span>
          </button>

          {/* Volunteer */}
          <button className="p-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 backdrop-blur-xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Hand size={16} />
            </div>
            <span className="text-[10px] font-bold text-white">Volunteer</span>
          </button>

          {/* Prayer Request */}
          <button className="p-3 rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-500/20 to-sky-500/5 backdrop-blur-xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Sparkles size={16} />
            </div>
            <span className="text-[10px] font-bold text-white">Prayer</span>
          </button>
        </div>

        {/* 5. COMMUNITY FEED */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-stone-300 tracking-wider uppercase">Community Feed</h3>
            <span className="text-[11px] text-orange-400 font-semibold cursor-pointer">Live Updates</span>
          </div>

          <div className="p-4 rounded-3xl border border-orange-500/20 bg-white/[0.03] backdrop-blur-xl shadow-2xl space-y-3">
            {/* User Details */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[url('https://randomuser.me/api/portraits/women/44.jpg')] bg-cover border border-orange-400/40" />
              <div>
                <h4 className="text-xs font-bold text-white">Sarah M.</h4>
                <p className="text-[10px] text-stone-400">Just Now</p>
              </div>
            </div>

            {/* Post Description */}
            <p className="text-xs text-stone-200 font-medium">
              Wonderful time at the Kids Art Workshop! 🎨✨
            </p>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-28 rounded-2xl bg-[url('https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center border border-white/5" />
              <div className="h-28 rounded-2xl bg-[url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center border border-white/5" />
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <Heart size={15} className="fill-rose-400" />
                <span>24</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-stone-300">
                <MessageCircle size={15} />
                <span>5</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 6. ADAPTED FLOATING GLASS NAVIGATION BAR */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30">
        <div className="rounded-full px-5 py-2.5 flex items-center justify-between border border-orange-500/25 bg-[#140e0b]/85 backdrop-blur-2xl shadow-2xl">
          
          <button 
            onClick={() => setActiveNav('home')}
            className={`p-2 rounded-full transition ${activeNav === 'home' ? 'text-orange-400' : 'text-stone-400'}`}
          >
            <Home size={20} />
          </button>

          <button 
            onClick={() => setActiveNav('events')}
            className={`p-2 rounded-full transition ${activeNav === 'events' ? 'text-orange-400' : 'text-stone-400'}`}
          >
            <Calendar size={20} />
          </button>

          {/* Central Quick Action Trigger */}
          <button 
            onClick={() => alert("Check-In / Quick Give")}
            className="w-12 h-12 -mt-6 rounded-full flex items-center justify-center text-white shadow-xl transition active:scale-95 border-2 border-[#140e0b] bg-gradient-to-tr from-orange-600 to-amber-500"
          >
            <Heart size={20} className="fill-white" />
          </button>

          <button 
            onClick={() => setActiveNav('live')}
            className={`p-2 rounded-full transition ${activeNav === 'live' ? 'text-orange-400' : 'text-stone-400'}`}
          >
            <Radio size={20} />
          </button>

          <button 
            onClick={() => setActiveNav('settings')}
            className={`p-2 rounded-full transition ${activeNav === 'settings' ? 'text-orange-400' : 'text-stone-400'}`}
          >
            <Settings size={20} />
          </button>

        </div>
      </nav>

    </div>
  );
}
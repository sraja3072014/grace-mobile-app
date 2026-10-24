// src/pages/4_Connect/LiveStreamPage.jsx
import React from 'react';
import { Video, Radio, Users, Play, Clock, Share2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function LiveStreamPage({ theme }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <Radio className="text-rose-500 animate-pulse" size="{18}"/>
            <span>Live Stream Sanctuary Desk</span>
          </h2>
          <span className="text-[11px] opacity-60 font-semibold">Stage Broadcast & Online Fellowship</span>
        </div>
      </div>

      {/* Main Video Stream Player Card */}
      <GlassCard className="p-3.5 space-y-3 overflow-hidden" theme="{theme}">
        <div className="w-full h-44 rounded-2xl bg-black relative flex flex-col justify-between p-3 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/30 via-slate-900 to-black pointer-events-none" />
          
          {/* Top Live Badges */}
          <div className="flex justify-between items-center z-10">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE ON AIR
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold">
              <Users className="text-sky-400" size="{11}"/> 1,480 Online
            </span>
          </div>

          {/* Center Play Icon Placeholder */}
          <div className="flex items-center justify-center z-10 my-auto">
            <button 
              type="button"
              onClick={() => alert("Connecting to Sanctuary HD Feed...")}
              className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl transition active:scale-95 cursor-pointer"
            >
              <Play className="fill-white translate-x-0.5" size="{24}"/>
            </button>
          </div>

          {/* Bottom Title Bar */}
          <div className="z-10 bg-black/60 backdrop-blur-md p-2 rounded-xl flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <h4 className="text-xs font-bold text-white truncate">Sunday Morning Worship Service</h4>
              <p className="text-[9px] text-slate-300">1080p 60fps • Grace City Media Hub</p>
            </div>
            <button 
              type="button"
              onClick={() => alert("Stream link copied!")}
              className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition cursor-pointer shrink-0"
            >
              <Share2 size="{13}"/>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Stream Controls & Upcoming Sessions */}
      <GlassCard className="p-3.5 space-y-2.5" theme="{theme}">
        <h4 className="text-xs font-extrabold pb-1 border-b border-black/5 dark:border-white/10">
          Upcoming Broadcast Schedule
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
            <div>
              <div className="font-bold">Evening Youth Alive Service</div>
              <span className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5">
                <Clock size="{10}"/> Today at 06:00 PM
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-500 font-mono">Scheduled</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
            <div>
              <div className="font-bold">Wednesday Midweek Bible Study</div>
              <span className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5">
                <Clock size="{10}"/> Wed at 07:00 PM
              </span>
            </div>
            <span className="text-[10px] font-bold text-sky-500 font-mono">Upcoming</span>
          </div>
        </div>
      </GlassCard>

    </div>
  );
}
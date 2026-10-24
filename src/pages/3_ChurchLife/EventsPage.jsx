// src/pages/3_ChurchLife/EventsPage.jsx
import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function EventsPage({ theme }) {
  const events = [
    {
      id: 'EVT-01',
      month: 'OCT',
      day: '25',
      title: 'Sunday Worship Service',
      time: '08:30 AM - 11:00 AM',
      location: 'Main Cathedral Sanctuary',
      speaker: 'Ps. Raja S',
      category: 'Worship',
      banner: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'EVT-02',
      month: 'OCT',
      day: '30',
      title: 'Chain Fasting & Miracle Prayer',
      time: '10:00 AM - 01:30 PM',
      location: 'Prayer Hall (Ground Floor)',
      speaker: 'Intercessory Team',
      category: 'Prayer',
      banner: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'EVT-03',
      month: 'NOV',
      day: '01',
      title: 'First Day Communion & Blessing Meet',
      time: '05:30 AM - 07:00 AM',
      location: 'All Campuses Live',
      speaker: 'Pastoral Council',
      category: 'Special',
      banner: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <CalendarIcon size={18} style={{ color: theme.accent }} />
            <span>Events & Gathering Hub</span>
          </h2>
          <span className="text-[11px] opacity-60 font-semibold">Scheduled Sanctuary & Fellowship Meetings</span>
        </div>
        <button
          type="button"
          onClick={() => alert('New Event Creation Form opened')}
          className="p-2 rounded-2xl text-white shadow-md active:scale-95 transition cursor-pointer"
          style={{ background: theme.accent }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((evt) => (
          <GlassCard key={evt.id} theme={theme} className="p-3.5 space-y-3 overflow-hidden">
            <div className="w-full h-32 rounded-2xl bg-cover bg-center relative shadow-sm" style={{ backgroundImage: `url(${evt.banner})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl" />
              <div 
                className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-center border backdrop-blur-md"
                style={{ background: 'rgba(255, 255, 255, 0.3)', borderColor: theme.glassBorder }}
              >
                <span className="text-[9px] font-black uppercase text-amber-300 block">{evt.month}</span>
                <span className="text-sm font-black text-white leading-none">{evt.day}</span>
              </div>
              <div className="absolute bottom-2.5 left-3 right-3">
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-orange-500/80 text-white">
                  {evt.category}
                </span>
                <h3 className="text-sm font-extrabold text-white mt-1 leading-tight">{evt.title}</h3>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] opacity-80">
              <div className="flex items-center gap-2">
                <Clock size={13} style={{ color: theme.accent }} />
                <span>{evt.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-rose-400" />
                <span>{evt.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={13} className="text-sky-400" />
                <span>Leader: <strong>{evt.speaker}</strong></span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}
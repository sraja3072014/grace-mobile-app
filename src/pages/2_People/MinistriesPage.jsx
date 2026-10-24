// src/pages/2_People/MinistriesPage.jsx
import React, { useState } from 'react';
import { 
  Users, Home, Calendar, Award, Baby, Flame, Heart, 
  Shield, MapPin, Navigation, Clock, CheckCircle2, 
  KeyRound, MessageSquare, Plus, QrCode, Search, Printer, ChevronRight 
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function MinistriesPage({ theme }) {
  // 5 முதன்மைத் தொகுதிகளுக்கான டேப்
  const [activeTab, setActiveTab] = useState('fellowships'); // 'fellowships' | 'cottage' | 'roster' | 'attendance' | 'ordinances'
  const [activeFellowshipSub, setActiveFellowshipSub] = useState('SUNDAY_SCHOOL');

  // --- 1. துறைசார் ஊழியங்கள் தரவு (Fellowships Data) ---
  const [kidsList, setKidsList] = useState([
    { id: 'KID-101', name: 'Sharon David', classGroup: 'Primary (Age 6-8)', parent: 'Bro. David Paul', phone: '+919840122334', passToken: 'PASS-8841', status: 'CHECKED_IN' },
    { id: 'KID-102', name: 'Jason Stephen', classGroup: 'Juniors (Age 9-11)', parent: 'Bro. Stephen Victor', phone: '+919876543210', passToken: 'PASS-3920', status: 'PICKED_UP' }
  ]);

  const youthList = [
    { id: 'YTH-01', name: 'Bro. Joshua Raj', role: 'Youth Leader', talent: 'Keyboard / Worship', attendance: '94%', phone: '+919840111223' },
    { id: 'YTH-02', name: 'Sis. Blessy Grace', role: 'Member', talent: 'Media & Projection', attendance: '88%', phone: '+919840144556' }
  ];

  const womenList = [
    { id: 'WMN-01', name: 'Sis. Hepzibah Stephen', role: 'President', task: 'Fasting Prayer Coordinator', phone: '+919840188990' },
    { id: 'WMN-02', name: 'Sis. Esther Rani', role: 'Coordinator', task: 'Hospitality & Care Desk', phone: '+919840199001' }
  ];

  const menList = [
    { id: 'MEN-01', name: 'Bro. Samuel Raj', role: 'Coordinator', task: 'Morning Intercession & Protocol', phone: '+919840133445' },
    { id: 'MEN-02', name: 'Bro. Andrew Selvam', role: 'Security Lead', task: 'Campus Logistics', phone: '+919840166778' }
  ];

  // --- 2. காட்டேஜ் பிரேயர் தரவு (Cottage Prayer Data) ---
  const [cottageVisits, setCottageVisits] = useState([
    {
      id: 'CP-101',
      familyName: 'Stephen Victor Household',
      timeSlot: '06:30 PM',
      area: 'City Center',
      address: '12, New Housing Unit, Koduvai',
      phone: '+91 98765 43210',
      mapLink: 'https://maps.google.com/?q=10.9822,77.3411',
      leadPastor: 'Senior Pastor Raja S',
      status: 'SCHEDULED'
    },
    {
      id: 'CP-102',
      familyName: 'David Paulraj Household',
      timeSlot: '07:30 PM',
      area: 'RS Puram',
      address: '45, Cathedral Road, Coimbatore',
      phone: '+91 98401 23456',
      mapLink: 'https://maps.google.com/?q=11.0168,76.9558',
      leadPastor: 'Elder Thomas',
      status: 'COMPLETED'
    }
  ]);

  // --- 3. சண்டே ரோஸ்டர் தரவு (Sunday Roster Data) ---
  const currentRoster = {
    service: '1st Morning Divine Service (08:30 AM)',
    preacher: 'Rev. Raja S (Lead Pastor)',
    worshipLead: 'Bro. David Paulraj & Choir',
    scripture: 'Sis. Mary Stephen (Psalm 91)',
    offeringPrayer: 'Elder Paul Raj',
    soundTech: 'Bro. Samuel (FOH Sound)',
    mediaLive: 'Bro. Alex (Live Stream Team)',
    usherLead: 'Deacon Victor Protocol Desk'
  };

  // --- 4. திருவருட்சாதனங்கள் தரவு (Ordinances Data) ---
  const baptismSample = [
    { id: 'BAP-01', regNo: 'GCC/BAP/2026/042', name: 'Joshua Stephen', date: 'Oct 15, 2026', minister: 'Rev. Raja S' }
  ];

  // Sunday School குழந்தையை விடுவிக்கும் பாதுகாப்பு சரிபார்ப்பு[cite: 9]
  const handleVerifyChildPickup = (kid) => {
    const inputToken = window.prompt(`Enter Parent Security Pickup Pass for ${kid.name}:`);
    if (!inputToken) return;

    if (inputToken.trim().toUpperCase() === kid.passToken) {
      setKidsList(kidsList.map(k => k.id === kid.id ? { ...k, status: 'PICKED_UP' } : k));
      alert(`Security Check Passed! ${kid.name} safely released to parents.`);
    } else {
      alert('Security Pass Mismatch! Child cannot be released.');
    }
  };

  // WhatsApp துறைசார் அறிவிப்பு[cite: 9]
  const handleSendFellowshipNotice = (phone, title, name) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const formatted = clean.length === 10 ? `91${clean}` : clean;
    const msg = `🕊️ *${title} Fellowship Notice* 🕊️\nDear ${name},\nYou are warmly invited to attend our upcoming fellowship meeting.\n\nGrace Cathedral Ministries.`;
    window.open(`https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="px-1">
        <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
          <Baby size={18} style={{ color: theme.accent }} />
          <span>Ministries & Liturgy Operations</span>
        </h2>
        <span className="text-[11px] opacity-60 font-semibold">Cottage Visits, Fellowships, Rosters & Ordinances</span>
      </div>

      {/* Top 4 Modular Navigation Pills[cite: 9] */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'fellowships', label: 'Fellowships & Kids', icon: Users },
          { id: 'cottage', label: 'Cottage Visits', icon: Home },
          { id: 'roster', label: 'Sunday Roster', icon: Calendar },
          { id: 'ordinances', label: 'Sacred Ordinances', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                isActive ? 'shadow-md' : 'opacity-70'
              }`}
              style={{
                background: isActive ? theme.accent : theme.glassBg,
                color: isActive ? '#ffffff' : theme.textMain,
                borderColor: theme.glassBorder
              }}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. FELLOWSHIPS & SUNDAY SCHOOL SUB-MODULE[cite: 9] */}
      {/* ========================================================= */}
      {activeTab === 'fellowships' && (
        <div className="space-y-3">
          {/* Sub-departments Switcher[cite: 9] */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/20 text-[10px] font-bold">
            {[
              { id: 'SUNDAY_SCHOOL', label: 'Kids', icon: Baby },
              { id: 'YOUTH', label: 'Youth', icon: Flame },
              { id: 'WOMEN', label: 'Women', icon: Heart },
              { id: 'MEN', label: 'Men', icon: Shield }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFellowshipSub(f.id)}
                className={`py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
                  activeFellowshipSub === f.id ? 'bg-orange-500 text-white shadow-xs' : 'opacity-60'
                }`}
              >
                <f.icon size={11} /> {f.label}
              </button>
            ))}
          </div>

          {/* Sunday School with Safety Pass Checkout[cite: 9] */}
          {activeFellowshipSub === 'SUNDAY_SCHOOL' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-bold text-amber-500">
                <span className="flex items-center gap-1.5"><Shield size={14} /> Child Security Pass Protocol</span>
                <span className="text-[10px] font-mono">{kidsList.length} Enrolled</span>
              </div>

              {kidsList.map((kid) => (
                <GlassCard key={kid.id} theme={theme} className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold">{kid.name}</h4>
                      <span className="text-[10px] opacity-60 font-mono block">{kid.classGroup}</span>
                      <span className="text-[10px] opacity-70">Parent: <strong>{kid.parent}</strong></span>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      kid.status === 'CHECKED_IN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {kid.status === 'CHECKED_IN' ? 'In Classroom' : 'Picked Up'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10 text-xs">
                    <span className="text-[10px] font-mono opacity-70">Pass: <strong className="text-amber-500">{kid.passToken}</strong></span>
                    {kid.status === 'CHECKED_IN' ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyChildPickup(kid)}
                        className="px-3 py-1 bg-emerald-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
                      >
                        <KeyRound size={11} /> Verify & Release
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Released to Parent
                      </span>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Youth Department[cite: 9] */}
          {activeFellowshipSub === 'YOUTH' && (
            <div className="space-y-2.5">
              {youthList.map((y) => (
                <GlassCard key={y.id} theme={theme} className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold">{y.name}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-400">{y.role}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-500 block mt-0.5">{y.talent}</span>
                    <span className="text-[9px] opacity-60">Attendance: {y.attendance}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendFellowshipNotice(y.phone, 'Youth Alive', y.name)}
                    className="p-2 rounded-xl border flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    style={{ borderColor: theme.glassBorder, color: theme.accent }}
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </button>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Women Department[cite: 9] */}
          {activeFellowshipSub === 'WOMEN' && (
            <div className="space-y-2.5">
              {womenList.map((w) => (
                <GlassCard key={w.id} theme={theme} className="p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold">{w.name}</h4>
                    <span className="text-[10px] opacity-70 block">{w.task}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendFellowshipNotice(w.phone, "Women's Ministry", w.name)}
                    className="p-2 rounded-xl border flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    style={{ borderColor: theme.glassBorder, color: theme.accent }}
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </button>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Men Department[cite: 9] */}
          {activeFellowshipSub === 'MEN' && (
            <div className="space-y-2.5">
              {menList.map((m) => (
                <GlassCard key={m.id} theme={theme} className="p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold">{m.name}</h4>
                    <span className="text-[10px] opacity-70 block">{m.task}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendFellowshipNotice(m.phone, "Men's Fellowship", m.name)}
                    className="p-2 rounded-xl border flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    style={{ borderColor: theme.glassBorder, color: theme.accent }}
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </button>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. COTTAGE PRAYER VISITATION SUB-MODULE[cite: 8] */}
      {/* ========================================================= */}
      {activeTab === 'cottage' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold opacity-70">Scheduled Home Visits</span>
            <button
              type="button"
              onClick={() => alert('New Cottage Visit Form')}
              className="px-2.5 py-1 rounded-xl text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              style={{ background: theme.accent }}
            >
              <Plus size={11} /> + Schedule
            </button>
          </div>

          {cottageVisits.map((visit) => (
            <GlassCard key={visit.id} theme={theme} className="p-3.5 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold">{visit.familyName}</h4>
                    <span className="text-[9px] font-mono font-bold text-amber-500">{visit.timeSlot}</span>
                  </div>
                  <span className="text-[10px] opacity-70 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-rose-500 shrink-0" /> {visit.address}
                  </span>
                  <span className="text-[10px] opacity-60 block">Pastor: {visit.leadPastor}</span>
                </div>

                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  visit.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-sky-500/15 text-sky-400'
                }`}>
                  {visit.status}
                </span>
              </div>

              {/* GPS Navigation & Mark Completed[cite: 8] */}
              <div className="flex items-center justify-between pt-1.5 border-t border-black/5 dark:border-white/10 text-xs">
                {visit.mapLink ? (
                  <a
                    href={visit.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 active:scale-95 transition"
                  >
                    <Navigation size={11} />
                    <span>Navigate GPS</span>
                  </a>
                ) : <span />}

                {visit.status === 'SCHEDULED' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCottageVisits(cottageVisits.map(v => v.id === visit.id ? { ...v, status: 'COMPLETED' } : v));
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white/10 text-[10px] font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 size={11} /> Mark Done
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SUNDAY WORSHIP ROSTER SUB-MODULE[cite: 12] */}
      {/* ========================================================= */}
      {activeTab === 'roster' && (
        <GlassCard theme={theme} className="p-4 space-y-3">
          <div className="border-b border-black/5 dark:border-white/10 pb-2">
            <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block">
              Sunday Order of Service
            </span>
            <h3 className="text-xs font-black mt-0.5">{currentRoster.service}</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
              <span className="text-[9px] opacity-60 block uppercase">Preacher</span>
              <strong className="text-xs mt-0.5 block truncate">{currentRoster.preacher}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
              <span className="text-[9px] opacity-60 block uppercase">Worship Band</span>
              <strong className="text-xs text-sky-400 mt-0.5 block truncate">{currentRoster.worshipLead}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
              <span className="text-[9px] opacity-60 block uppercase">Scripture Reading</span>
              <span className="text-[10px] mt-0.5 block truncate">{currentRoster.scripture}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
              <span className="text-[9px] opacity-60 block uppercase">Offertory Prayer</span>
              <span className="text-[10px] mt-0.5 block truncate">{currentRoster.offeringPrayer}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
              <span className="text-[9px] opacity-60 block uppercase">Sound Engineer</span>
              <span className="text-[10px] mt-0.5 block truncate">{currentRoster.soundTech}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
              <span className="text-[9px] opacity-60 block uppercase">Media & Live</span>
              <span className="text-[10px] mt-0.5 block truncate">{currentRoster.mediaLive}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
            <span className="opacity-70">Protocol Lead:</span>
            <strong>{currentRoster.usherLead}</strong>
          </div>
        </GlassCard>
      )}

      {/* ========================================================= */}
      {/* 4. SACRED ORDINANCES (BAPTISM & MATRIMONY)[cite: 11] */}
      {/* ========================================================= */}
      {activeTab === 'ordinances' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold opacity-70">Baptism & Matrimony Registry</span>
            <button
              type="button"
              onClick={() => alert('New Ordinance Registry Entry')}
              className="px-2.5 py-1 rounded-xl text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              style={{ background: theme.accent }}
            >
              <Plus size={11} /> + New Record
            </button>
          </div>

          {baptismSample.map((b) => (
            <GlassCard key={b.id} theme={theme} className="p-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold">{b.name}</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-400">{b.regNo}</span>
                </div>
                <span className="text-[10px] opacity-60 font-mono block mt-0.5">
                  Baptized: {b.date} • Minister: {b.minister}
                </span>
              </div>
              <button
                type="button"
                onClick={() => alert(`Certificate of Holy Baptism for ${b.name}`)}
                className="p-2 rounded-xl border flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                style={{ borderColor: theme.glassBorder, color: theme.accent }}
              >
                <Printer size={12} />
                <span>Certificate</span>
              </button>
            </GlassCard>
          ))}
        </div>
      )}

    </div>
  );
}
// src/pages/2_People/VisitorsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, UserPlus, Phone, PhoneCall, MessageSquare, 
  MapPin, Clock, ArrowRight, UserCheck, Sparkles, Search, CheckCircle2 
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import { upsertMember } from '../../services/memberService';
import { sanitizeMemberPayload } from '../../utils/schemaSanitizer';

export default function VisitorsPage({ theme }) {
  const [activeSubTab, setActiveSubTab] = useState('pipeline'); // 'pipeline' | 'register'
  const [activeStageFilter, setActiveStageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // ஆரம்பநிலை மாதிரி விருந்தினர்கள் பட்டியல் (Vault வடிவம்)
  const [visitors, setVisitors] = useState([
    {
      id: 'VIS-2601',
      name: 'Bro. Daniel Raj',
      phone: '+919840166778',
      area: 'Koduvai Town',
      invitedBy: 'Bro. David Paul',
      stage: 'FIRST_VISIT',
      visitDate: '2026-09-06',
      notes: 'Looking for youth fellowship and music ministry.'
    },
    {
      id: 'VIS-2602',
      name: 'Sis. Mercy Priya',
      phone: '+919840199887',
      area: 'Tiruppur Road',
      invitedBy: 'Sister Sarah',
      stage: 'CONTACTED',
      visitDate: '2026-08-30',
      notes: 'Requested pastoral prayer for family business peace.'
    },
    {
      id: 'VIS-2603',
      name: 'Bro. Stephen Joseph',
      phone: '+919940088771',
      area: 'Coimbatore South',
      invitedBy: 'Ps. Raja S',
      stage: 'PRAYER_MEET',
      visitDate: '2026-08-15',
      notes: 'Attending Friday cottage prayer regularly.'
    },
    {
      id: 'VIS-2604',
      name: 'Bro. Samuel Sundaram',
      phone: '+919842266334',
      area: 'Kangeyam',
      invitedBy: 'Bro. Victor',
      stage: 'COMMITTED',
      visitDate: '2026-08-01',
      notes: 'Completed believer intake. Ready to convert to Member.'
    }
  ]);

  // புதிய விருந்தினர் பதிவு படிவ ஸ்டேட்
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    area: '',
    invitedBy: '',
    notes: ''
  });

  const stagesList = [
    { id: 'FIRST_VISIT', label: '1. New Seeker', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'CONTACTED', label: '2. Pastoral Call', badge: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    { id: 'PRAYER_MEET', label: '3. Cottage Meet', badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'COMMITTED', label: '4. Member Ready', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'CONVERTED', label: '5. Converted', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. WhatsApp Welcome Message அனுப்புதல்
  const handleSendWelcomeWhatsApp = (visitor) => {
    const cleanPhone = visitor.phone.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = 
`🕊️ *Welcome to Grace Cathedral Church!* 🕊️\nDear ${visitor.name},\nThank you for worshipping the Lord with us! We are overjoyed to have you in our fellowship.\n\n_"The Lord bless you and keep you; the Lord make His face shine on you."_\n\nWith Love,\n*Pastoral Team & Grace Family*`;

    window.open(`https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // 2. அடுத்த கட்ட பைப்லைனுக்கு நகர்த்துதல் (Advance Stage)
  const handleAdvanceStage = (visitorId) => {
    const stageKeys = ['FIRST_VISIT', 'CONTACTED', 'PRAYER_MEET', 'COMMITTED'];
    const updated = visitors.map(v => {
      if (v.id === visitorId) {
        const currIdx = stageKeys.indexOf(v.stage);
        const nextStage = currIdx < stageKeys.length - 1 ? stageKeys[currIdx + 1] : v.stage;
        return { ...v, stage: nextStage };
      }
      return v;
    });
    setVisitors(updated);
    showToast('Soul Care Stage advanced successfully!');
  };

  // 3. விசிட்டரை நிரந்தர உறுப்பினராக மாற்றுதல் (Convert to Member)
  const handleConvertToMember = async (visitor) => {
    const confirmConvert = window.confirm(`${visitor.name}-ஐ சபையின் நிரந்தர உறுப்பினராக (Full Member) சேர்க்க விரும்புகிறீர்களா?`);
    if (!confirmConvert) return;

    try {
      const generatedMemberId = `GCC-MBR-${Date.now().toString().slice(-4)}`;
      const generatedFamilyId = `FAM-${Date.now().toString().slice(-4)}`;
      const memberRecord = sanitizeMemberPayload({
        id: generatedMemberId,
        family_id: generatedFamilyId,
        name: visitor.name,
        phone: visitor.phone,
        area: visitor.area || 'Koduvai',
        household_role: 'Head of Family',
        status: 'Active',
        campus: 'Main Sanctuary',
        ministry_talents: ['Prayer Team']
      });

      await upsertMember(memberRecord);

      try {
        const cached = localStorage.getItem('graceos_vault_members');
        const members = cached ? JSON.parse(cached) : [];
        members.unshift(memberRecord);
        localStorage.setItem('graceos_vault_members', JSON.stringify(members));
      } catch (e) {
        console.warn('Failed to update local member cache:', e);
      }

      const updated = visitors.map(v => 
        v.id === visitor.id ? { ...v, stage: 'CONVERTED' } : v
      );
      setVisitors(updated);
      showToast(`வெற்றி! ${visitor.name} சபையின் உறுப்பினராக சேர்க்கப்பட்டார் (${generatedMemberId}).`);
    } catch (err) {
      console.error('Failed to convert visitor to member:', err);
      showToast('Error converting visitor to member. Please try again.');
    }
  };

  // 4. புதிய விருந்தினரைச் சேமித்தல்
  const handleSaveVisitor = (e) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.phone.trim()) return;

    const newEntry = {
      id: `VIS-${Date.now().toString().slice(-4)}`,
      name: regForm.name.trim(),
      phone: regForm.phone.trim(),
      area: regForm.area.trim() || 'Koduvai',
      invitedBy: regForm.invitedBy.trim() || 'Self Walk-in',
      stage: 'FIRST_VISIT',
      visitDate: new Date().toISOString().slice(0, 10),
      notes: regForm.notes.trim() || 'First time visitor.'
    };

    setVisitors([newEntry, ...visitors]);
    setRegForm({ name: '', phone: '', area: '', invitedBy: '', notes: '' });
    setActiveSubTab('pipeline');
    showToast(`${newEntry.name} பைப்லைனில் சேர்க்கப்பட்டார்!`);
  };

  // Search & Filter
  const filteredVisitors = visitors.filter(v => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = v.name.toLowerCase().includes(q) || v.phone.includes(q) || v.area.toLowerCase().includes(q);
    const matchesStage = activeStageFilter === 'ALL' || v.stage === activeStageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 backdrop-blur-xl shadow-2xl z-50 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <HeartHandshake size={18} style={{ color: theme.accent }} />
            <span>Visitors & Soul Care</span>
          </h2>
          <span className="text-[11px] opacity-60 font-semibold">{visitors.length} Seekers Under Assimilation</span>
        </div>

        {/* Top Segment Toggle */}
        <div className="flex rounded-xl p-0.5 border backdrop-blur-md" style={{ background: theme.glassBg, borderColor: theme.glassBorder }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'pipeline' ? 'text-white shadow-xs' : 'opacity-60'
            }`}
            style={{ background: activeSubTab === 'pipeline' ? theme.accent : 'transparent' }}
          >
            Pipeline
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('register')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'register' ? 'text-white shadow-xs' : 'opacity-60'
            }`}
            style={{ background: activeSubTab === 'register' ? theme.accent : 'transparent' }}
          >
            + Register
          </button>
        </div>
      </div>

      {/* VIEW 1: REGISTER GUEST FORM */}
      {activeSubTab === 'register' ? (
        <GlassCard theme={theme} className="p-4 space-y-3">
          <div className="border-b border-black/5 dark:border-white/10 pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.accent }}>
              <UserPlus size={14} /> New Seeker Intake
            </h3>
            <span className="text-[10px] opacity-60">Log first-time guests directly into Stage 1 (New Seeker)</span>
          </div>

          <form onSubmit={handleSaveVisitor} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold block mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Bro. Daniel Raj"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs font-bold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold block mb-1">Mobile Phone *</label>
              <input
                type="text"
                placeholder="+91 98401 00000"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs font-mono focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1">Area / Locality</label>
                <input
                  type="text"
                  placeholder="e.g. Koduvai"
                  value={regForm.area}
                  onChange={(e) => setRegForm({ ...regForm, area: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Invited By</label>
                <input
                  type="text"
                  placeholder="e.g. Bro. David"
                  value={regForm.invitedBy}
                  onChange={(e) => setRegForm({ ...regForm, invitedBy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold block mb-1">Prayer Request / Care Notes</label>
              <textarea
                rows="2"
                placeholder="Family peace, healing, job search..."
                value={regForm.notes}
                onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer"
              style={{ background: theme.accent }}
            >
              Save Seeker Record
            </button>
          </form>
        </GlassCard>
      ) : (
        /* VIEW 2: PIPELINE TRACKER & ACTION CARDS */
        <div className="space-y-3">
          
          {/* Search Box */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-2xl border backdrop-blur-xl shadow-xs"
            style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
          >
            <Search size={15} className="opacity-50 shrink-0" />
            <input 
              type="text" 
              placeholder="Search seeker name, phone, or area..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full font-medium"
            />
          </div>

          {/* Stage Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveStageFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border transition active:scale-95 cursor-pointer ${
                activeStageFilter === 'ALL' ? 'shadow-xs' : 'opacity-60'
              }`}
              style={{
                background: activeStageFilter === 'ALL' ? theme.accent : theme.glassBg,
                color: activeStageFilter === 'ALL' ? '#ffffff' : theme.textMain,
                borderColor: theme.glassBorder
              }}
            >
              All ({visitors.length})
            </button>
            {stagesList.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStageFilter(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border transition active:scale-95 cursor-pointer ${
                  activeStageFilter === s.id ? 'shadow-xs' : 'opacity-60'
                }`}
                style={{
                  background: activeStageFilter === s.id ? theme.accent : theme.glassBg,
                  color: activeStageFilter === s.id ? '#ffffff' : theme.textMain,
                  borderColor: theme.glassBorder
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Seeker List Cards */}
          <div className="space-y-2.5">
            {filteredVisitors.map((v) => {
              const currentStageObj = stagesList.find(s => s.id === v.stage) || stagesList[0];

              return (
                <GlassCard key={v.id} theme={theme} className="p-3.5 space-y-2.5">
                  
                  {/* Top: Name, ID, Stage Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold">{v.name}</h4>
                        <span className="text-[9px] font-mono opacity-60">({v.id})</span>
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5">
                        <MapPin size={10} className="inline mr-0.5 text-rose-500" />
                        <span>{v.area} • Brought by: <strong>{v.invitedBy}</strong></span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${currentStageObj.badge}`}>
                      {currentStageObj.label}
                    </span>
                  </div>

                  {/* Prayer Request Notes */}
                  {v.notes && (
                    <p className="text-[11px] opacity-80 italic bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-white/20">
                      "{v.notes}"
                    </p>
                  )}

                  {/* Action Controls: WhatsApp, Phone Call & Advance */}
                  <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp Welcome Button */}
                      <button
                        type="button"
                        onClick={() => handleSendWelcomeWhatsApp(v)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
                        title="Send WhatsApp Welcome"
                      >
                        <MessageSquare size={11} />
                        <span>WA Welcome</span>
                      </button>

                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${v.phone}`}
                        className="p-1.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center active:scale-95 transition cursor-pointer"
                        title="Call Seeker"
                      >
                        <PhoneCall size={12} />
                      </a>
                    </div>

                    {/* Stage 4: Make Member or Advance Stage or Already Converted */}
                    {v.stage === 'COMMITTED' ? (
                      <button
                        type="button"
                        onClick={() => handleConvertToMember(v)}
                        className="px-3 py-1 rounded-xl bg-emerald-500 text-white text-[11px] font-black flex items-center gap-1 shadow-md active:scale-95 transition cursor-pointer"
                      >
                        <UserCheck size={13} />
                        <span>Make Member</span>
                      </button>
                    ) : v.stage === 'CONVERTED' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>Converted</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(v.id)}
                        className="px-2.5 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1 active:scale-95 transition cursor-pointer"
                        style={{ borderColor: theme.glassBorder, color: theme.accent }}
                      >
                        <span>Advance Stage</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>

                </GlassCard>
              );
            })}

            {filteredVisitors.length === 0 && (
              <div className="text-center py-10 opacity-60 text-xs">
                No seekers found in this stage.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
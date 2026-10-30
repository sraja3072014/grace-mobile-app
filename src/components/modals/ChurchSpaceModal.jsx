// src/components/modals/ChurchSpaceModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Users, HeartHandshake, BookOpen, Flame, 
  Sparkles, Shield, Check, Plus, X, ChevronDown, MapPin, 
  Info, ShieldCheck, Phone
} from 'lucide-react';

export default function ChurchSpaceModal({ 
  isOpen, 
  onClose, 
  theme, 
  branches = [], 
  selectedBranch, 
  onSelectBranch, 
  onCreateBranch 
}) {
  const [expandedItem, setExpandedItem] = useState(null);
  const dialogRef = useRef(null);

  const toggleItem = (id) => {
    setExpandedItem((prev) => (prev === id ? null : id));
  };

  const defaultCampuses = branches && branches.length > 0 ? branches : [
    { id: 'hq', name: 'Grace Central Cathedral', city: 'Koduvai', isHQ: true },
    { id: 'north', name: 'North Campus Sanctuary', city: 'North Campus', isHQ: false },
    { id: 'fellowship', name: 'Grace Fellowship Center', city: 'Koduvai', isHQ: false }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* 🌟 பின்னணி லேசான கண்ணாடி மங்கலாக்கல் (பின்னணி மறைக்கப்படாது) */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose} 
      />

      {/* 🌟 தூய கிரிஸ்டல் கிளாஸ் விண்டோ (Pure Liquid Crystal Glass Container) */}
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-[32px] p-5 shadow-2xl max-h-[82vh] overflow-y-auto animate-in slide-in-from-top-6 fade-in duration-300"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(255, 255, 255, 0.1)',
          color: '#ffffff'
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-lg border border-white/30 shrink-0"
              style={{ background: theme?.accent || '#f59e0b' }}
            >
              GC
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-tight">Grace Central Cathedral</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Administrator / Lead Pastor
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition cursor-pointer border border-white/10"
          >
            <X size={15} />
          </button>
        </div>

        {/* 1. Settings & Admin */}
        <div className="pt-4 space-y-2">
          <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase px-1">
            Settings & Admin · நிர்வாகம்
          </span>

          {/* Information */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('info')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <Info size={15} className="text-cyan-400" />
                <span>Information (சபை விவரங்கள் & தொடர்பு)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'info' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'info' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-xs space-y-1.5 bg-black/15 animate-in fade-in duration-200">
                <p className="opacity-90 leading-relaxed text-[11px]">
                  Grace Central Cathedral • Headquarters
                </p>
                <div className="flex items-center gap-2 text-[10px] opacity-80">
                  <MapPin size={11} className="text-rose-400" /> Main Road, Koduvai, Tiruppur
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-80">
                  <Phone size={11} className="text-emerald-400" /> +91 84280 44555
                </div>
              </div>
            )}
          </div>

          {/* Users and Access */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('users')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <ShieldCheck size={15} className="text-amber-400" />
                <span>Users and Access (அனுமதிகள் & கட்டுப்பாடுகள்)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'users' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'users' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-[11px] space-y-1.5 bg-black/15 animate-in fade-in duration-200">
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="font-bold">Raja S (You)</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">Super Admin</span>
                </div>
                <p className="text-[10px] opacity-75 leading-relaxed">
                  சபையின் அனைத்து மெம்பர்ஷிப், பாஸ்டரல் கேர் மற்றும் நிதி நிர்வாகத்தைக் கையாளும் முழு அதிகாரம் உங்களுக்கு வழங்கப்பட்டுள்ளது.
                </p>
              </div>
            )}
          </div>

          {/* Care Team */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('care')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <HeartHandshake size={15} className="text-rose-400" />
                <span>Care Team (விசிட்டிங் & போதக ஆலோசனைக் குழு)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'care' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'care' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-[11px] space-y-1.5 bg-black/15 animate-in fade-in duration-200">
                <p className="opacity-85 text-[10px] leading-relaxed">
                  விசுவாசிகளை நேரில் சென்று சந்திப்பது, தொலைபேசி நலம் விசாரிப்புகள் மற்றும் அந்தரங்க ஜெபக் குறிப்புகளை ஒருங்கிணைக்கும் பிரிவு.
                </p>
                <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-[10px] flex justify-between items-center">
                  <span>விசிட்டிங் ஒருங்கிணைப்பாளர்</span>
                  <span className="text-cyan-300 font-bold">Active</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Groups & Fellowship */}
        <div className="pt-4 space-y-2">
          <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase px-1">
            Groups & Fellowships · சபைக் கூட்டங்கள்
          </span>

          {/* Sunday School */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('sunday_school')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <BookOpen size={15} className="text-emerald-400" />
                <span>Sunday School (சிறார் வகுப்பு & ஆசிரியர்கள்)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'sunday_school' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'sunday_school' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-[11px] space-y-1 bg-black/15 animate-in fade-in duration-200">
                <p className="opacity-80 text-[10px]">வகுப்புகள்: Nursery, Preschool, Elementary, Middle School</p>
                <div className="text-[10px] text-emerald-300 font-mono">ஞாயிறு காலை 09:00 AM • 4 Classes Active</div>
              </div>
            )}
          </div>

          {/* Youth Fellowship */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('youth')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <Flame size={15} className="text-orange-400" />
                <span>Youth Fellowship (வாலிபர் ஐக்கியம்)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'youth' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'youth' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-[11px] space-y-1 bg-black/15 animate-in fade-in duration-200">
                <p className="opacity-80 text-[10px]">வாலிபர் கூடுகை, இசை மற்றும் வேத தியானப் பயிற்சிகள்.</p>
              </div>
            )}
          </div>

          {/* Women's Fellowship */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('women')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <Sparkles size={15} className="text-pink-400" />
                <span>Women's Fellowship (மகளிர் ஐக்கியம்)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'women' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'women' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-[11px] space-y-1 bg-black/15 animate-in fade-in duration-200">
                <p className="opacity-80 text-[10px]">மாதாந்திர உபவாச ஜெபங்கள் மற்றும் இல்லச் சந்திப்புகள்.</p>
              </div>
            )}
          </div>

          {/* Men's Fellowship */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-inner">
            <div 
              onClick={() => toggleItem('men')}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/[0.08] active:scale-98 transition"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs">
                <Shield size={15} className="text-indigo-400" />
                <span>Men's Fellowship (சகோதரர் ஐக்கியம்)</span>
              </div>
              <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${expandedItem === 'men' ? 'rotate-180' : ''}`} />
            </div>

            {expandedItem === 'men' && (
              <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-[11px] space-y-1 bg-black/15 animate-in fade-in duration-200">
                <p className="opacity-80 text-[10px]">சபை முன்னேற்றப் பணிகள் மற்றும் காலை ஜெப ஐக்கியம்.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. My Branches */}
        <div className="pt-4 space-y-2">
          <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase px-1">
            My Branches · கிளைச் சபைகள்
          </span>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {defaultCampuses.map((camp) => {
              const isSelected = (typeof selectedBranch === 'string' && selectedBranch === camp.name) ||
                                 (selectedBranch?.id === camp.id) ||
                                 (!selectedBranch && camp.isHQ);

              return (
                <div 
                  key={camp.id}
                  onClick={() => {
                    onSelectBranch?.(camp);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer active:scale-98 transition ${
                    isSelected 
                      ? 'bg-emerald-400/20 border-emerald-400/50 text-emerald-200 font-bold shadow-sm' 
                      : 'bg-white/[0.04] border-white/15 opacity-85 hover:opacity-100 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 size={15} className={isSelected ? 'text-emerald-300' : 'text-cyan-400'} />
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {camp.isHQ ? `${camp.name} (HQ)` : camp.name}
                      </div>
                      <div className="text-[9px] opacity-75 font-mono flex items-center gap-1 mt-0.5">
                        <MapPin size={9} /> {camp.city || 'Koduvai'} • {camp.isHQ ? 'Main Sanctuary' : 'Extension Campus'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-emerald-300 shrink-0" strokeWidth={3} />}
                </div>
              );
            })}

            <button 
              type="button"
              onClick={onCreateBranch}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl border border-dashed border-white/25 text-xs font-bold opacity-85 hover:opacity-100 cursor-pointer mt-1 active:scale-98 transition bg-white/[0.02]"
            >
              <Plus size={13} />
              <span>Create or join another campus / branch</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
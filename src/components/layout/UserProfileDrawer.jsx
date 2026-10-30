// src/components/layout/UserProfileDrawer.jsx
import React, { useState } from 'react';
import { 
  Settings, Check, Clock, X,
  ChevronDown, Sun, Cloud, CloudRain, Moon, Bell, LogOut, Sparkles, Sunset, Sunrise
} from 'lucide-react';

export default function UserProfileDrawer({ 
  isOpen, 
  onClose, 
  theme = {}, 
  userProfile,
  isWeatherActive,
  isTimeActive,
  toggleWeatherMode,
  toggleTimeMode,
  selectedWeatherKey,
  handleSelectWeather,
  selectedTimeKey,
  handleSelectTime
}) {
  const [openSection, setOpenSection] = useState('settings');

  // 1. Live Weather Themes (வானிலை சார்ந்த 4 தீம்கள்)
  const weatherThemes = [
    { key: 'peach', label: 'Bright Peach (வெயில்)', desc: 'சாஃப்ட் பேஸ்டல் பிங்க்', icon: Sun, color: 'text-rose-500' },
    { key: 'muted', label: 'Soft Muted (மேகம்)', desc: 'மேகமூட்ட டார்க் ஸ்லேட்', icon: Cloud, color: 'text-slate-300' },
    { key: 'rain', label: 'Rain Mood (மழை)', desc: 'காற்றில் சாயும் மழைத்துளி', icon: CloudRain, color: 'text-cyan-400' },
    { key: 'midnight', label: 'Midnight (இரவு)', desc: 'மின்னும் நட்சத்திரம் & நிலா', icon: Moon, color: 'text-purple-400' }
  ];

  // 2. Live Time Themes (சூரிய & நிலா சுழற்சி சார்ந்த 4 தீம்கள்)
  const timeThemes = [
    { key: 'dawn', label: 'Dawn Sunrise (உதயம்)', desc: '05:00 - 12:00 (தங்கக் கதிர்)', icon: Sunrise, color: 'text-amber-400' },
    { key: 'noon', label: 'Zenith Noon (நண்பகல்)', desc: '12:00 - 18:00 (அஸூர் ப்ளூ)', icon: Sun, color: 'text-sky-400' },
    { key: 'sunset', label: 'Dusk Sunset (அந்திமாலை)', desc: '18:00 - 21:00 (செவ்வானம்)', icon: Sunset, color: 'text-rose-400' },
    { key: 'lunar', label: 'Midnight Lunar (சந்திரன்)', desc: '21:00 - 05:00 (சந்திர வெளிச்சம்)', icon: Moon, color: 'text-indigo-400' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose} 
      />

      <div 
        className="relative z-10 w-full max-w-lg rounded-[32px] p-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-6 fade-in duration-300"
        style={{ 
          background: theme?.isDark 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.70) 100%)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
          color: theme?.textMain || '#ffffff'
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/10 dark:border-white/15">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full border-2 border-emerald-400/80 flex items-center justify-center font-black text-white text-sm shadow-sm"
              style={{ background: theme?.accent || '#f59e0b' }}
            >
              RS
            </div>
            <div>
              <h3 className="text-sm font-black leading-tight" style={{ color: theme?.textMain }}>
                {userProfile?.name || 'Raja S'}
              </h3>
              <span className="text-[10px] text-cyan-500 font-bold block mt-0.5">Administrator / Lead Pastor</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-90 transition cursor-pointer border border-black/10 dark:border-white/10"
          >
            <X size={15} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="pt-3.5 space-y-3 text-xs">
          
          <div className="rounded-2xl border border-black/10 dark:border-white/20 overflow-hidden backdrop-blur-md bg-transparent">
            <div 
              onClick={() => setOpenSection(openSection === 'settings' ? null : 'settings')}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/[0.08]"
            >
              <div className="flex items-center gap-2.5 font-bold">
                <Settings size={16} className="text-cyan-500" />
                <div>
                  <span className="text-xs" style={{ color: theme?.textMain }}>Settings & Themes</span>
                  <span className="text-[10px] block opacity-70" style={{ color: theme?.textMuted }}>வெதர் மற்றும் டைம் அடாப்டிவ் தீம்கள்</span>
                </div>
              </div>
              <ChevronDown size={15} className={`transition-transform duration-200 ${openSection === 'settings' ? 'rotate-180' : ''}`} style={{ color: theme?.textMain }} />
            </div>

            {openSection === 'settings' && (
              <div className="p-3 border-t border-black/10 dark:border-white/15 space-y-4 bg-black/5 dark:bg-black/15 animate-in fade-in duration-200">
                
                {/* ========================================================= */}
                {/* 🌟 1. LIVE WEATHER ADAPTIVE (Switch + 4 Cards) */}
                {/* ========================================================= */}
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl border border-black/10 dark:border-white/15 bg-white/40 dark:bg-white/[0.04] flex items-center justify-between shadow-inner">
                    <div className="pr-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: theme?.textMain }}>
                        <Sparkles size={14} className="text-amber-500" />
                        <span>1. Live Weather Adaptive</span>
                      </div>
                      <span className="text-[9px] block mt-0.5 opacity-75" style={{ color: theme?.textMuted }}>
                        வானிலை அட்மாஸ்பியரிக் மூட்ஸ் (மழை, மேகம், வெயில், நிலா)
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleWeatherMode(!isWeatherActive)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 shrink-0 ${
                        isWeatherActive ? 'bg-emerald-500' : 'bg-black/20 dark:bg-white/20'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          isWeatherActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Weather 4 Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {weatherThemes.map((t) => {
                      const Icon = t.icon;
                      const isSelected = isWeatherActive && selectedWeatherKey === t.key;

                      return (
                        <div
                          key={t.key}
                          onClick={() => handleSelectWeather(t.key)}
                          className={`p-3 rounded-2xl border flex flex-col justify-between h-20 cursor-pointer active:scale-95 transition ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/20 shadow-md font-bold'
                              : 'border-black/10 dark:border-white/15 bg-white/40 dark:bg-white/[0.04] opacity-85 hover:opacity-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <Icon size={14} className={t.color} />
                              <span className="font-bold text-[11px] leading-tight" style={{ color: theme?.textMain }}>{t.label}</span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-mono opacity-70" style={{ color: theme?.textMuted }}>{t.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-black/10 dark:border-white/10 my-2" />

                {/* ========================================================= */}
                {/* 🌟 2. LIVE TIME ADAPTIVE (Switch + 4 Solar Cycle Cards) */}
                {/* ========================================================= */}
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl border border-black/10 dark:border-white/15 bg-white/40 dark:bg-white/[0.04] flex items-center justify-between shadow-inner">
                    <div className="pr-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: theme?.textMain }}>
                        <Clock size={14} className="text-cyan-500" />
                        <span>2. Live Time Adaptive (சூரிய & நிலா சுழற்சி)</span>
                      </div>
                      <span className="text-[9px] block mt-0.5 opacity-75 leading-relaxed" style={{ color: theme?.textMuted }}>
                        கடிகார நேரத்திற்கு ஏற்ப தானாக மாறும் சோலார் சுழற்சி
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleTimeMode(!isTimeActive)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 shrink-0 ${
                        isTimeActive ? 'bg-cyan-500' : 'bg-black/20 dark:bg-white/20'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          isTimeActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Time 4 Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {timeThemes.map((t) => {
                      const Icon = t.icon;
                      const isSelected = isTimeActive && selectedTimeKey === t.key;

                      return (
                        <div
                          key={t.key}
                          onClick={() => handleSelectTime(t.key)}
                          className={`p-3 rounded-2xl border flex flex-col justify-between h-20 cursor-pointer active:scale-95 transition ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500/20 shadow-md font-bold'
                              : 'border-black/10 dark:border-white/15 bg-white/40 dark:bg-white/[0.04] opacity-85 hover:opacity-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <Icon size={14} className={t.color} />
                              <span className="font-bold text-[11px] leading-tight" style={{ color: theme?.textMain }}>{t.label}</span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-white shrink-0">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-mono opacity-70" style={{ color: theme?.textMuted }}>{t.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-black/10 dark:border-white/20 overflow-hidden backdrop-blur-md bg-transparent">
            <div className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/[0.08]">
              <div className="flex items-center gap-2.5 font-bold">
                <Bell size={16} className="text-amber-500" />
                <span style={{ color: theme?.textMain }}>Notifications</span>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div 
            onClick={() => {
              if (window.confirm("நிச்சயமாக வெளியேற விரும்புகிறீர்களா?")) {
                alert("Signed out successfully");
                onClose();
              }
            }}
            className="p-3 rounded-2xl border border-rose-500/30 text-rose-500 flex items-center gap-2.5 font-bold cursor-pointer active:scale-98 transition backdrop-blur-md"
            style={{ background: 'transparent' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </div>

        </div>

      </div>
    </div>
  );
}
// src/components/modals/SettingsModal.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Globe, Sparkles, Check, RefreshCw, ArrowLeft } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function SettingsModal({
  isOpen,
  onClose,
  isLiveAdaptive,
  setIsLiveAdaptive,
  activeThemeKey,
  setActiveThemeKey,
  isSyncingWeather,
  refreshWeather,
  theme
}) {
  const [tab, setTab] = useState('menu'); // 'menu' | 'appearance' | 'language'

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={() => { setTab('menu'); onClose(); }}
      title={tab === 'menu' ? 'System Settings' : tab === 'appearance' ? 'Appearance (Theme)' : 'Language'}
      icon={SettingsIcon}
      theme={theme}
    >
      <div className="space-y-3">
        {/* Back navigation when inside submenu */}
        {tab !== 'menu' && (
          <button 
            type="button" 
            onClick={() => setTab('menu')}
            className="flex items-center gap-1.5 text-xs font-bold opacity-70 hover:opacity-100 transition cursor-pointer mb-2"
          >
            <ArrowLeft size={14} /> Back to Settings
          </button>
        )}

        {/* 1. Main Settings Menu */}
        {tab === 'menu' && (
          <div className="space-y-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('appearance')}
              className="w-full p-3.5 rounded-2xl border flex items-center justify-between hover:scale-[0.98] transition cursor-pointer"
              style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
            >
              <div className="flex items-center gap-3">
                <Palette size={18} style={{ color: theme.accent }} />
                <div className="text-left">
                  <div>Appearance (Theme)</div>
                  <span className="text-[10px] opacity-60 font-normal">வானிலை & வண்ண அமைப்புகள்</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTab('language')}
              className="w-full p-3.5 rounded-2xl border flex items-center justify-between hover:scale-[0.98] transition cursor-pointer"
              style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
            >
              <div className="flex items-center gap-3">
                <Globe size={18} style={{ color: theme.accent }} />
                <div className="text-left">
                  <div>Language (மொழி)</div>
                  <span className="text-[10px] opacity-60 font-normal">தமிழ் / English</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* 2. Appearance & Invisible Weather */}
        {tab === 'appearance' && (
          <div className="space-y-4 text-xs">
            {/* Live Weather Adaptive Toggle */}
            <div 
              className="p-3.5 rounded-2xl border flex items-center justify-between"
              style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
            >
              <div className="space-y-0.5">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Sparkles size={14} style={{ color: theme.accent }} />
                  <span>Live Weather Adaptive</span>
                </div>
                <p className="text-[10px] opacity-70">
                  நேரடி வானிலைக்கு ஏற்ப பின்னணி தானாக மாறும்
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !isLiveAdaptive;
                  setIsLiveAdaptive(next);
                  if (next) refreshWeather?.();
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  isLiveAdaptive ? 'bg-emerald-500' : 'bg-black/20 dark:bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isLiveAdaptive ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Manual Themes */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider block mb-2 opacity-70">
                Atmospheric Themes
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'sunny_bright', name: 'Bright Peach (வெயில்)', color: '#ff9a9e' },
                  { key: 'cloudy_muted', name: 'Soft Muted (மேகம்)', color: '#d8c2c8' },
                  { key: 'rainy', name: 'Rain Mood (மழை)', color: '#2a5298' },
                  { key: 'night', name: 'Midnight (இரவு)', color: '#1f1135' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setIsLiveAdaptive(false);
                      setActiveThemeKey(item.key);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer active:scale-95 ${
                      activeThemeKey === item.key && !isLiveAdaptive ? 'ring-2 ring-orange-500 shadow-md' : 'opacity-80'
                    }`}
                    style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border shadow-xs" style={{ background: item.color }} />
                      <span className="font-bold text-[11px]">{item.name}</span>
                    </div>
                    {activeThemeKey === item.key && !isLiveAdaptive && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {isSyncingWeather && (
              <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-500 font-bold">
                <RefreshCw size={12} className="animate-spin" />
                <span>வானிலையுடன் பின்னணி ஒத்திசைக்கப்படுகிறது...</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Language Selector */}
        {tab === 'language' && (
          <div className="space-y-2 text-xs font-bold">
            <div className="p-3.5 rounded-2xl border flex justify-between items-center cursor-pointer" style={{ background: theme.glassBg, borderColor: theme.glassBorder }}>
              <span>தமிழ் (Tamil)</span>
              <Check size={16} style={{ color: theme.accent }} />
            </div>
            <div className="p-3.5 rounded-2xl border flex justify-between items-center opacity-60 cursor-pointer" style={{ background: theme.glassBg, borderColor: theme.glassBorder }}>
              <span>English</span>
            </div>
          </div>
        )}

      </div>
    </CenterModal>
  );
}
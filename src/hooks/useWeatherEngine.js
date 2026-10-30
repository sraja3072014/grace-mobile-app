// src/hooks/useWeatherEngine.js
import { useState, useEffect, useMemo, useCallback } from 'react';

// 🌟 1. Live Weather Adaptive Presets (வீடியோவில் உள்ள அதே 4 அட்மாஸ்பியரிக் மூட்ஸ்)
export const WEATHER_PRESETS = {
  peach: {
    key: 'peach',
    name: 'Bright Peach (வெயில்)',
    particleType: 'sunbeams',
    accent: '#f43f5e',
    // வீடியோவில் உள்ள அதே சாஃப்ட் பேஸ்டல் பிங்க் சாய்வு
    bgGrad: 'linear-gradient(135deg, #fce7f3 0%, #ffd1dc 45%, #fed7aa 100%)',
    isDark: false,
    textMain: '#1e293b',
    textMuted: '#64748b',
    cardBg: 'rgba(255, 255, 255, 0.65)',
    cardBorder: 'rgba(255, 255, 255, 0.80)',
    cardShadow: '0 12px 32px -4px rgba(244, 63, 94, 0.12)'
  },
  muted: {
    key: 'muted',
    name: 'Soft Muted (மேகம்)',
    particleType: 'mist',
    accent: '#0d9488',
    bgGrad: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e1b4b 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.18)',
    cardShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.4)'
  },
  rain: {
    key: 'rain',
    name: 'Rain Mood (மழை)',
    particleType: 'rain',
    accent: '#06b6d4',
    // வீடியோ 00:04-ல் உள்ள ஆழ்கடல் நீல மழை பின்னணி
    bgGrad: 'linear-gradient(135deg, #09131d 0%, #0c2d48 50%, #0f172a 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: '#93c5fd',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.18)',
    cardShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.4)'
  },
  midnight: {
    key: 'midnight',
    name: 'Midnight (இரவு)',
    particleType: 'stars',
    accent: '#a855f7',
    // வீடியோ 00:06-ல் உள்ள ஆழ்ந்த கருநீல இரவு
    bgGrad: 'linear-gradient(135deg, #030712 0%, #0b0f19 50%, #030712 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.16)',
    cardShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.5)'
  }
};

// 🌟 2. Live Time Adaptive Presets (சூரிய & நிலா சுழற்சி - Solar Day Cycle)
export const SOLAR_CYCLE_PRESETS = {
  dawn: {
    key: 'dawn',
    name: 'Dawn Sunrise (05:00 - 12:00)',
    timeSlot: '05:00 - 12:00',
    particleType: 'sunrise',
    accent: '#f59e0b',
    // மென்மையான இளஞ்சிவப்பு-தங்கக் கதிர் சாய்வு (சூரிய உதயம்)
    bgGrad: 'linear-gradient(135deg, #2b1828 0%, #4a1f33 50%, #26111e 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: '#fed7aa',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(245, 158, 11, 0.25)',
    cardShadow: '0 12px 32px -4px rgba(245, 158, 11, 0.15)'
  },
  noon: {
    key: 'noon',
    name: 'Zenith Noon (12:00 - 18:00)',
    timeSlot: '12:00 - 18:00',
    particleType: 'sunbeams',
    accent: '#0284c7',
    // கண்களைக் கூசாத அமைதியான அஸூர் ஸ்கை ப்ளூ (நண்பகல் வெளிச்சம்)
    bgGrad: 'linear-gradient(135deg, #0b1e33 0%, #102a45 50%, #081626 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: '#bae6fd',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(2, 132, 199, 0.25)',
    cardShadow: '0 12px 32px -4px rgba(2, 132, 199, 0.15)'
  },
  sunset: {
    key: 'sunset',
    name: 'Dusk Sunset (18:00 - 21:00)',
    timeSlot: '18:00 - 21:00',
    particleType: 'sunset',
    accent: '#f43f5e',
    // ஆழ்ந்த செவ்வானம் மற்றும் ஊதா நிற அந்திமாலை (சன்செட்)
    bgGrad: 'linear-gradient(135deg, #240c1d 0%, #40102b 50%, #1b0a21 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: '#fecdd3',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(244, 63, 94, 0.25)',
    cardShadow: '0 12px 32px -4px rgba(244, 63, 94, 0.15)'
  },
  lunar: {
    key: 'lunar',
    name: 'Midnight Lunar (21:00 - 05:00)',
    timeSlot: '21:00 - 05:00',
    particleType: 'lunar',
    accent: '#6366f1',
    // கரும்பச்சை கலந்த ஆழ்ந்த இரவு மற்றும் சந்திர வெளிச்சம்
    bgGrad: 'linear-gradient(135deg, #03080e 0%, #07151a 50%, #02060b 100%)',
    isDark: true,
    textMain: '#ffffff',
    textMuted: '#c7d2fe',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(99, 102, 241, 0.25)',
    cardShadow: '0 12px 32px -4px rgba(99, 102, 241, 0.15)'
  }
};

export function useWeatherEngine() {
  // Mode selection: 'weather' or 'time'
  const [activeEngineMode, setActiveEngineMode] = useState('weather'); // 'weather' | 'time'

  // Keys
  const [selectedWeatherKey, setSelectedWeatherKey] = useState('peach');
  const [selectedTimeKey, setSelectedTimeKey] = useState('dawn');

  // கடிகார நேரத்தைக் கொண்டு தற்போதைய சோலார் தீமைக் கணிப்பது
  const getSolarSlotKey = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'dawn';
    if (hour >= 12 && hour < 18) return 'noon';
    if (hour >= 18 && hour < 21) return 'sunset';
    return 'lunar';
  }, []);

  // Time Adaptive இயங்கும் போது 1 நிமிடத்திற்கு ஒருமுறை நேரத்தைச் சோதித்தல்
  useEffect(() => {
    if (activeEngineMode === 'time') {
      const update = () => setSelectedTimeKey(getSolarSlotKey());
      update();
      const interval = setInterval(update, 60000);
      return () => clearInterval(interval);
    }
  }, [activeEngineMode, getSolarSlotKey]);

  // Weather switch toggle
  const toggleWeatherMode = (enabled) => {
    if (enabled) {
      setActiveEngineMode('weather');
    } else {
      setActiveEngineMode('time');
      setSelectedTimeKey(getSolarSlotKey());
    }
  };

  // Time switch toggle
  const toggleTimeMode = (enabled) => {
    if (enabled) {
      setActiveEngineMode('time');
      setSelectedTimeKey(getSolarSlotKey());
    } else {
      setActiveEngineMode('weather');
    }
  };

  // Card select functions
  const handleSelectWeather = (key) => {
    setSelectedWeatherKey(key);
    setActiveEngineMode('weather');
  };

  const handleSelectTime = (key) => {
    setSelectedTimeKey(key);
    setActiveEngineMode('time');
  };

  // தற்போதைய தீம் ஆப்ஜெக்ட்
  const currentTheme = useMemo(() => {
    if (activeEngineMode === 'time') {
      return SOLAR_CYCLE_PRESETS[selectedTimeKey] || SOLAR_CYCLE_PRESETS.dawn;
    }
    return WEATHER_PRESETS[selectedWeatherKey] || WEATHER_PRESETS.peach;
  }, [activeEngineMode, selectedTimeKey, selectedWeatherKey]);

  return {
    activeEngineMode,
    isWeatherActive: activeEngineMode === 'weather',
    isTimeActive: activeEngineMode === 'time',
    toggleWeatherMode,
    toggleTimeMode,
    selectedWeatherKey,
    handleSelectWeather,
    selectedTimeKey,
    handleSelectTime,
    currentTheme
  };
}
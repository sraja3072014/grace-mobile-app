// src/hooks/useWeatherEngine.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ACRYLIC_PALETTES, 
  CIRCADIAN_SLOTS, 
  WEATHER_MODES, 
  getCircadianSlotKey 
} from '../theme/acrylicPalettes';

const STORAGE_PALETTE_KEY = 'grace_active_palette';
const STORAGE_ENGINE_MODE = 'grace_engine_mode';
const STORAGE_BLUR_DEPTH = 'grace_blur_depth';
const STORAGE_ACCENT = 'grace_accent_color';
const STORAGE_APPEARANCE = 'grace_appearance_mode';

export function useWeatherEngine() {
  // Modes: 'palette' (Manual Acrylic Palette) | 'time' (Circadian Rhythm) | 'weather' (Live Weather)
  const [activeEngineMode, setActiveEngineMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_ENGINE_MODE) || 'palette';
    } catch {
      return 'palette';
    }
  });

  // Selected Acrylic Palette (Default: Obsidian Cyan)
  const [selectedPaletteKey, setSelectedPaletteKey] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_PALETTE_KEY) || 'obsidian_cyan';
    } catch {
      return 'obsidian_cyan';
    }
  });
  const [selectedAccent, setSelectedAccent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_ACCENT) || '';
    } catch {
      return '';
    }
  });
  const [appearanceMode, setAppearanceMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_APPEARANCE) || 'system';
    } catch {
      return 'system';
    }
  });
  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    typeof window === 'undefined' || !window.matchMedia
      ? true
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Selected Weather Mode (Default: rain)
  const [selectedWeatherKey, setSelectedWeatherKey] = useState('rain');

  // Circadian slot (evaluated dynamically)
  const [currentCircadianKey, setCurrentCircadianKey] = useState(() => getCircadianSlotKey());

  // Acrylic Blur Depth in px (Default: 40px)
  const [blurDepth, setBlurDepth] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BLUR_DEPTH);
      return saved ? parseInt(saved, 10) : 40;
    } catch {
      return 40;
    }
  });

  // Update Circadian Rhythm every 30 seconds
  useEffect(() => {
    const updateCircadian = () => {
      setCurrentCircadianKey(getCircadianSlotKey());
    };
    updateCircadian();
    const interval = setInterval(updateCircadian, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updatePreference = event => setSystemPrefersDark(event.matches);
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  const handleSelectAccent = useCallback(color => {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    setSelectedAccent(color);
    try {
      localStorage.setItem(STORAGE_ACCENT, color);
    } catch (error) {
      console.warn('[Theme] Unable to save accent color:', error);
    }
  }, []);

  const handleSelectAppearance = useCallback(mode => {
    if (!['pure-dark', 'ink', 'light', 'system'].includes(mode)) return;
    setAppearanceMode(mode);
    try {
      localStorage.setItem(STORAGE_APPEARANCE, mode);
    } catch (error) {
      console.warn('[Theme] Unable to save appearance mode:', error);
    }
  }, []);

  // Save changes to localStorage
  const handleSelectPalette = useCallback((key) => {
    if (ACRYLIC_PALETTES[key]) {
      setSelectedPaletteKey(key);
      setActiveEngineMode('palette');
      try {
        localStorage.setItem(STORAGE_PALETTE_KEY, key);
        localStorage.setItem(STORAGE_ENGINE_MODE, 'palette');
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSelectWeather = useCallback((key) => {
    if (WEATHER_MODES[key]) {
      setSelectedWeatherKey(key);
      setActiveEngineMode('weather');
      try {
        localStorage.setItem(STORAGE_ENGINE_MODE, 'weather');
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSelectTime = useCallback((key) => {
    if (CIRCADIAN_SLOTS[key]) {
      setCurrentCircadianKey(key);
      setActiveEngineMode('time');
      try {
        localStorage.setItem(STORAGE_ENGINE_MODE, 'time');
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleWeatherMode = useCallback((enabled) => {
    const nextMode = enabled ? 'weather' : 'palette';
    setActiveEngineMode(nextMode);
    try {
      localStorage.setItem(STORAGE_ENGINE_MODE, nextMode);
    } catch {
      // ignore
    }
  }, []);

  const toggleTimeMode = useCallback((enabled) => {
    const nextMode = enabled ? 'time' : 'palette';
    setActiveEngineMode(nextMode);
    try {
      localStorage.setItem(STORAGE_ENGINE_MODE, nextMode);
    } catch {
      // ignore
    }
  }, []);

  const updateBlurDepth = useCallback((depth) => {
    const val = Math.max(10, Math.min(60, Number(depth) || 40));
    setBlurDepth(val);
    try {
      localStorage.setItem(STORAGE_BLUR_DEPTH, String(val));
    } catch {
      // ignore
    }
  }, []);

  // Current unified theme object
  const currentTheme = useMemo(() => {
    let baseTheme;
    if (activeEngineMode === 'time') {
      baseTheme = CIRCADIAN_SLOTS[currentCircadianKey] || CIRCADIAN_SLOTS.golden_bloom;
    } else if (activeEngineMode === 'weather') {
      baseTheme = WEATHER_MODES[selectedWeatherKey] || WEATHER_MODES.rain;
    } else {
      baseTheme = ACRYLIC_PALETTES[selectedPaletteKey] || ACRYLIC_PALETTES.obsidian_cyan;
    }

    const theme = {
      ...baseTheme,
      blurDepth,
      activeEngineMode,
      selectedPaletteKey,
      selectedWeatherKey,
      currentCircadianKey,
      appearanceMode,
      accent: selectedAccent || baseTheme.accent
    };
    const effectiveMode = appearanceMode === 'system'
      ? (systemPrefersDark ? 'pure-dark' : 'light')
      : appearanceMode;
    if (effectiveMode === 'pure-dark') {
      theme.bgGrad = 'linear-gradient(135deg, #000000 0%, #050505 55%, #0a0a0a 100%)';
      theme.cardBg = 'rgba(10, 10, 10, 0.88)';
      theme.textMain = '#ffffff';
      theme.textMuted = '#a1a1aa';
      theme.isDark = true;
    } else if (effectiveMode === 'ink') {
      theme.bgGrad = 'linear-gradient(135deg, #09090b 0%, #111113 55%, #18181b 100%)';
      theme.cardBg = 'rgba(24, 24, 27, 0.82)';
      theme.textMain = '#f4f4f5';
      theme.textMuted = '#a1a1aa';
      theme.isDark = true;
    } else if (effectiveMode === 'light') {
      theme.bgGrad = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
      theme.cardBg = 'rgba(255, 255, 255, 0.82)';
      theme.cardBorder = 'rgba(15, 23, 42, 0.14)';
      theme.textMain = '#0f172a';
      theme.textMuted = '#475569';
      theme.isDark = false;
    }
    return theme;
  }, [activeEngineMode, appearanceMode, currentCircadianKey, selectedAccent, selectedWeatherKey, selectedPaletteKey, systemPrefersDark, blurDepth]);

  return {
    activeEngineMode,
    isWeatherActive: activeEngineMode === 'weather',
    isTimeActive: activeEngineMode === 'time',
    isPaletteActive: activeEngineMode === 'palette',
    toggleWeatherMode,
    toggleTimeMode,
    selectedPaletteKey,
    handleSelectPalette,
    selectedAccent,
    handleSelectAccent,
    appearanceMode,
    handleSelectAppearance,
    selectedWeatherKey,
    handleSelectWeather,
    selectedTimeKey: currentCircadianKey,
    handleSelectTime,
    blurDepth,
    updateBlurDepth,
    palettes: ACRYLIC_PALETTES,
    circadianSlots: CIRCADIAN_SLOTS,
    weatherModes: WEATHER_MODES,
    currentTheme
  };
}

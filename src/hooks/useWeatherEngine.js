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

  // Save changes to localStorage
  const handleSelectPalette = useCallback((key) => {
    if (ACRYLIC_PALETTES[key]) {
      setSelectedPaletteKey(key);
      setActiveEngineMode('palette');
      try {
        localStorage.setItem(STORAGE_PALETTE_KEY, key);
        localStorage.setItem(STORAGE_ENGINE_MODE, 'palette');
      } catch (e) {
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
      } catch (e) {
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
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const toggleWeatherMode = useCallback((enabled) => {
    const nextMode = enabled ? 'weather' : 'palette';
    setActiveEngineMode(nextMode);
    try {
      localStorage.setItem(STORAGE_ENGINE_MODE, nextMode);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTimeMode = useCallback((enabled) => {
    const nextMode = enabled ? 'time' : 'palette';
    setActiveEngineMode(nextMode);
    try {
      localStorage.setItem(STORAGE_ENGINE_MODE, nextMode);
    } catch (e) {
      // ignore
    }
  }, []);

  const updateBlurDepth = useCallback((depth) => {
    const val = Math.max(10, Math.min(60, Number(depth) || 40));
    setBlurDepth(val);
    try {
      localStorage.setItem(STORAGE_BLUR_DEPTH, String(val));
    } catch (e) {
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

    return {
      ...baseTheme,
      blurDepth,
      activeEngineMode,
      selectedPaletteKey,
      selectedWeatherKey,
      currentCircadianKey
    };
  }, [activeEngineMode, currentCircadianKey, selectedWeatherKey, selectedPaletteKey, blurDepth]);

  return {
    activeEngineMode,
    isWeatherActive: activeEngineMode === 'weather',
    isTimeActive: activeEngineMode === 'time',
    isPaletteActive: activeEngineMode === 'palette',
    toggleWeatherMode,
    toggleTimeMode,
    selectedPaletteKey,
    handleSelectPalette,
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

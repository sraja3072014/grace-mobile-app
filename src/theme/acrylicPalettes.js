// src/theme/acrylicPalettes.js

/**
 * 🌟 The 6 Premium Acrylic Palettes (GraceOS Design System)
 * Deep Obsidian / Slate 950 Base Surfaces with Fluent Acrylic Accents
 */
export const ACRYLIC_PALETTES = {
  obsidian_cyan: {
    key: 'obsidian_cyan',
    name: 'Obsidian Cyan',
    tag: 'Default',
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.20)',
    border: 'rgba(6, 182, 212, 0.35)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #0a0f1d 50%, #082f49 100%)',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(6, 182, 212, 0.35)',
    cardShadow: '0 12px 32px -4px rgba(6, 182, 212, 0.25)',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
    particleType: 'stars',
    isDark: true
  },
  midnight_royal: {
    key: 'midnight_royal',
    name: 'Midnight Royal',
    tag: 'Royal',
    accent: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.20)',
    border: 'rgba(139, 92, 246, 0.35)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #0f0a1e 50%, #1e103a 100%)',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(139, 92, 246, 0.35)',
    cardShadow: '0 12px 32px -4px rgba(139, 92, 246, 0.25)',
    textMain: '#ffffff',
    textMuted: '#c4b5fd',
    particleType: 'lunar',
    isDark: true
  },
  emerald_sanctuary: {
    key: 'emerald_sanctuary',
    name: 'Emerald Sanctuary',
    tag: 'Sanctuary',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.20)',
    border: 'rgba(16, 185, 129, 0.35)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #061e14 50%, #022c22 100%)',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(16, 185, 129, 0.35)',
    cardShadow: '0 12px 32px -4px rgba(16, 185, 129, 0.25)',
    textMain: '#ffffff',
    textMuted: '#a7f3d0',
    particleType: 'sunbeams',
    isDark: true
  },
  celestial_sapphire: {
    key: 'celestial_sapphire',
    name: 'Celestial Sapphire',
    tag: 'Celestial',
    accent: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.20)',
    border: 'rgba(59, 130, 246, 0.35)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #081a36 50%, #172554 100%)',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(59, 130, 246, 0.35)',
    cardShadow: '0 12px 32px -4px rgba(59, 130, 246, 0.25)',
    textMain: '#ffffff',
    textMuted: '#bfdbfe',
    particleType: 'stars',
    isDark: true
  },
  imperial_gold: {
    key: 'imperial_gold',
    name: 'Imperial Gold / Amber',
    tag: 'Liturgical',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.20)',
    border: 'rgba(245, 158, 11, 0.35)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #1c1304 50%, #2e1e05 100%)',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(245, 158, 11, 0.35)',
    cardShadow: '0 12px 32px -4px rgba(245, 158, 11, 0.25)',
    textMain: '#ffffff',
    textMuted: '#fde68a',
    particleType: 'sunrise',
    isDark: true
  },
  rose_velvet: {
    key: 'rose_velvet',
    name: 'Rose Velvet',
    tag: 'Velvet',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.20)',
    border: 'rgba(244, 63, 94, 0.35)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #1e0912 50%, #350c1b 100%)',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    cardBorder: 'rgba(244, 63, 94, 0.35)',
    cardShadow: '0 12px 32px -4px rgba(244, 63, 94, 0.25)',
    textMain: '#ffffff',
    textMuted: '#fecdd3',
    particleType: 'sunset',
    isDark: true
  }
};

/**
 * 🌅 Circadian Rhythm Adaptation Engine (Solar & Lunar Time)
 * 1. Solar Golden Bloom (06:00 – 11:00): Top-right radial amber/gold warmth (#f59e0b)
 * 2. Daylight Crisp Sky (11:00 – 16:30): High-clarity cyan/blue illumination (#06b6d4)
 * 3. Twilight Sunset (16:30 – 18:30): Horizon rose-violet dusk shift (#f43f5e & #8b5cf6)
 * 4. Lunar Obsidian (18:30 – 06:00): Top-left indigo/blue-violet cool moonlit aura (#6366f1)
 */
export const CIRCADIAN_SLOTS = {
  golden_bloom: {
    key: 'golden_bloom',
    name: 'Solar Golden Bloom',
    timeSlot: '06:00 – 11:00',
    accent: '#f59e0b',
    auraGlow: 'rgba(245, 158, 11, 0.28)',
    auraPosition: 'top-right',
    particleType: 'sunrise',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #1c1404 45%, #2a1b05 100%)',
    cardBg: 'rgba(15, 23, 42, 0.78)',
    cardBorder: 'rgba(245, 158, 11, 0.32)',
    cardShadow: '0 12px 32px -4px rgba(245, 158, 11, 0.22)',
    textMain: '#ffffff',
    textMuted: '#fef3c7',
    isDark: true
  },
  crisp_sky: {
    key: 'crisp_sky',
    name: 'Daylight Crisp Sky',
    timeSlot: '11:00 – 16:30',
    accent: '#06b6d4',
    auraGlow: 'rgba(6, 182, 212, 0.28)',
    auraPosition: 'top-center',
    particleType: 'sunbeams',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #06192a 50%, #0b253a 100%)',
    cardBg: 'rgba(15, 23, 42, 0.78)',
    cardBorder: 'rgba(6, 182, 212, 0.32)',
    cardShadow: '0 12px 32px -4px rgba(6, 182, 212, 0.22)',
    textMain: '#ffffff',
    textMuted: '#bae6fd',
    isDark: true
  },
  twilight_sunset: {
    key: 'twilight_sunset',
    name: 'Twilight Sunset',
    timeSlot: '16:30 – 18:30',
    accent: '#f43f5e',
    secondaryAccent: '#8b5cf6',
    auraGlow: 'rgba(244, 63, 94, 0.26)',
    auraPosition: 'horizon',
    particleType: 'sunset',
    bgGrad: 'linear-gradient(135deg, #0a0614 0%, #200d1e 50%, #2d1022 100%)',
    cardBg: 'rgba(15, 23, 42, 0.78)',
    cardBorder: 'rgba(244, 63, 94, 0.32)',
    cardShadow: '0 12px 32px -4px rgba(244, 63, 94, 0.22)',
    textMain: '#ffffff',
    textMuted: '#fecdd3',
    isDark: true
  },
  lunar_obsidian: {
    key: 'lunar_obsidian',
    name: 'Lunar Obsidian',
    timeSlot: '18:30 – 06:00',
    accent: '#6366f1',
    auraGlow: 'rgba(99, 102, 241, 0.28)',
    auraPosition: 'top-left',
    particleType: 'lunar',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #080d24 50%, #030712 100%)',
    cardBg: 'rgba(15, 23, 42, 0.78)',
    cardBorder: 'rgba(99, 102, 241, 0.32)',
    cardShadow: '0 12px 32px -4px rgba(99, 102, 241, 0.22)',
    textMain: '#ffffff',
    textMuted: '#c7d2fe',
    isDark: true
  }
};

/**
 * 🌧️ Live Weather Adaptation Presets
 */
export const WEATHER_MODES = {
  rain: {
    key: 'rain',
    name: 'Rainy Mist Mode',
    accent: '#38bdf8',
    particleType: 'rain',
    auraGlow: 'rgba(56, 189, 248, 0.25)',
    bgGrad: 'linear-gradient(135deg, #030a14 0%, #0c233c 50%, #081a2c 100%)',
    cardBg: 'rgba(15, 23, 42, 0.80)',
    cardBorder: 'rgba(56, 189, 248, 0.30)',
    cardShadow: '0 12px 32px -4px rgba(56, 189, 248, 0.20)',
    textMain: '#ffffff',
    textMuted: '#bae6fd',
    isDark: true
  },
  overcast: {
    key: 'overcast',
    name: 'Overcast Slate',
    accent: '#94a3b8',
    particleType: 'mist',
    auraGlow: 'rgba(148, 163, 184, 0.20)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #1e293b 50%, #0f172a 100%)',
    cardBg: 'rgba(15, 23, 42, 0.80)',
    cardBorder: 'rgba(148, 163, 184, 0.25)',
    cardShadow: '0 12px 32px -4px rgba(148, 163, 184, 0.15)',
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
    isDark: true
  },
  clear: {
    key: 'clear',
    name: 'Clear Radiant Aura',
    accent: '#06b6d4',
    particleType: 'sunbeams',
    auraGlow: 'rgba(6, 182, 212, 0.25)',
    bgGrad: 'linear-gradient(135deg, #020617 0%, #08283e 50%, #031525 100%)',
    cardBg: 'rgba(15, 23, 42, 0.80)',
    cardBorder: 'rgba(6, 182, 212, 0.30)',
    cardShadow: '0 12px 32px -4px rgba(6, 182, 212, 0.20)',
    textMain: '#ffffff',
    textMuted: '#a5f3fc',
    isDark: true
  }
};

/**
 * Returns current Circadian key based on local device time
 */
export function getCircadianSlotKey(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  
  // 06:00 (360m) to 11:00 (660m): Solar Golden Bloom
  if (minutes >= 360 && minutes < 660) {
    return 'golden_bloom';
  }
  // 11:00 (660m) to 16:30 (990m): Daylight Crisp Sky
  if (minutes >= 660 && minutes < 990) {
    return 'crisp_sky';
  }
  // 16:30 (990m) to 18:30 (1110m): Twilight Sunset
  if (minutes >= 990 && minutes < 1110) {
    return 'twilight_sunset';
  }
  // 18:30 to 06:00: Lunar Obsidian
  return 'lunar_obsidian';
}


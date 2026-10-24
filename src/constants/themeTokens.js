// src/constants/themeTokens.js

export const THEME_PALETTES = {
  sunny_bright: {
    key: 'sunny_bright',
    name: 'Sunny Vibrant (வெயில்)',
    bgGrad: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 60%, #ffd1dc 100%)',
    textMain: '#2d3748',
    textMuted: '#718096',
    glassBg: 'rgba(255, 255, 255, 0.55)',
    glassBorder: 'rgba(255, 255, 255, 0.75)',
    accent: '#ff6b6b',
    navBg: 'rgba(255, 255, 255, 0.88)',
    particleType: 'sun',
    isDark: false
  },
  cloudy_muted: {
    key: 'cloudy_muted',
    name: 'Overcast (மேகமூட்டம்)',
    bgGrad: 'linear-gradient(135deg, #e2d4d8 0%, #d8c2c8 50%, #c5b4be 100%)',
    textMain: '#2b2d42',
    textMuted: '#6c757d',
    glassBg: 'rgba(255, 255, 255, 0.45)',
    glassBorder: 'rgba(255, 255, 255, 0.60)',
    accent: '#d9777f',
    navBg: 'rgba(255, 255, 255, 0.82)',
    particleType: 'none',
    isDark: false
  },
  rainy: {
    key: 'rainy',
    name: 'Rain Atmosphere (மழை)',
    bgGrad: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
    glassBg: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.25)',
    accent: '#63b3ed',
    navBg: 'rgba(25, 40, 65, 0.88)',
    particleType: 'rain',
    isDark: true
  },
  night: {
    key: 'night',
    name: 'Midnight Serenity (இரவு)',
    bgGrad: 'linear-gradient(135deg, #1f1135 0%, #120a22 60%, #080410 100%)',
    textMain: '#ffffff',
    textMuted: '#cbd5e1',
    glassBg: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
    accent: '#a78bfa',
    navBg: 'rgba(18, 12, 30, 0.92)',
    particleType: 'star',
    isDark: true
  }
};

export const NEUMORPHIC_SHADOWS = {
  lightCard: '6px 6px 16px rgba(0, 0, 0, 0.08), -3px -3px 12px rgba(255, 255, 255, 0.6)',
  darkCard: '8px 8px 24px rgba(0, 0, 0, 0.45), -4px -4px 14px rgba(255, 255, 255, 0.05)',
  dockIsland: '0 12px 36px rgba(0, 0, 0, 0.25)',
  buttonPressed: 'inset 3px 3px 6px rgba(0, 0, 0, 0.2), inset -2px -2px 6px rgba(255, 255, 255, 0.2)'
};
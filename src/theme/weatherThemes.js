export const WEATHER_THEMES = {
  cool: {
    name: 'Cool Dawn',
    minTemp: -Infinity,
    maxTemp: 22,
    gradient: 'from-[#141b24] via-[#0d1217] to-[#07090b]',
    glowPrimary: 'rgba(56, 189, 248, 0.15)', // Light Cyan/Sky
    glowSecondary: 'rgba(251, 146, 60, 0.10)',
    panelBg: 'rgba(20, 27, 36, 0.60)',
    panelBorder: 'rgba(56, 189, 248, 0.20)',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-500/20',
    badgeBorder: 'border-sky-500/30'
  },
  warm: {
    name: 'Warm Daylight',
    minTemp: 23,
    maxTemp: 29,
    gradient: 'from-[#1c140d] via-[#120c08] to-[#080503]',
    glowPrimary: 'rgba(251, 146, 60, 0.18)', // Soft Amber
    glowSecondary: 'rgba(245, 158, 11, 0.12)',
    panelBg: 'rgba(32, 22, 14, 0.60)',
    panelBorder: 'rgba(251, 146, 60, 0.22)',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/30'
  },
  hot: {
    name: 'Hot Amber',
    minTemp: 30,
    maxTemp: 35,
    gradient: 'from-[#27130b] via-[#160a05] to-[#0b0402]',
    glowPrimary: 'rgba(249, 115, 22, 0.22)', // Deep Orange
    glowSecondary: 'rgba(234, 88, 12, 0.15)',
    panelBg: 'rgba(40, 19, 11, 0.65)',
    panelBorder: 'rgba(249, 115, 22, 0.28)',
    accentText: 'text-orange-400',
    accentBg: 'bg-orange-500/25',
    badgeBorder: 'border-orange-500/35'
  },
  heatwave: {
    name: 'Heatwave Sunset',
    minTemp: 36,
    maxTemp: Infinity,
    gradient: 'from-[#2e0e0a] via-[#1a0705] to-[#0c0302]',
    glowPrimary: 'rgba(239, 68, 68, 0.24)', // Crimson Sunset
    glowSecondary: 'rgba(249, 115, 22, 0.18)',
    panelBg: 'rgba(46, 14, 10, 0.70)',
    panelBorder: 'rgba(239, 68, 68, 0.32)',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-500/25',
    badgeBorder: 'border-rose-500/40'
  }
};

export function getThemeByTemperature(temp) {
  if (temp <= WEATHER_THEMES.cool.maxTemp) return WEATHER_THEMES.cool;
  if (temp <= WEATHER_THEMES.warm.maxTemp) return WEATHER_THEMES.warm;
  if (temp <= WEATHER_THEMES.hot.maxTemp) return WEATHER_THEMES.hot;
  return WEATHER_THEMES.heatwave;
}
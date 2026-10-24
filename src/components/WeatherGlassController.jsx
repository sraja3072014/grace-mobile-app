import { CloudSun, Flame, Snowflake, RotateCw } from 'lucide-react';
import { useWeatherAdaptiveTheme } from '../theme/useWeatherAdaptiveTheme';

export default function WeatherGlassController() {
  const {
    temperature,
    theme,
    loading,
    locationName,
    manualOverride,
    setManualTemp,
    resetToLive
  } = useWeatherAdaptiveTheme();

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${theme.gradient} text-white p-5 transition-colors duration-700 relative overflow-hidden`}
      style={{
        '--dynamic-panel-bg': theme.panelBg,
        '--dynamic-panel-border': theme.panelBorder,
        '--dynamic-glow-1': theme.glowPrimary,
        '--dynamic-glow-2': theme.glowSecondary
      }}
    >
      {/* Dynamic Background Glow Spheres */}
      <div 
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: 'var(--dynamic-glow-1)' }}
      />
      <div 
        className="absolute top-1/2 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: 'var(--dynamic-glow-2)' }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between pt-4 pb-6">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase opacity-75">
            GraceOS Mobile Adaptive Engine
          </span>
          <h1 className="text-xl font-bold">Weather Glass UI</h1>
        </div>
        <button 
          onClick={resetToLive} 
          disabled={loading}
          className="p-2.5 rounded-full border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition"
          title="Sync Live Weather"
        >
          <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Main Adaptive Glass Hero Card */}
      <div 
        className="relative z-10 rounded-3xl p-5 mb-5 backdrop-blur-xl border transition-all duration-700 shadow-2xl"
        style={{
          backgroundColor: 'var(--dynamic-panel-bg)',
          borderColor: 'var(--dynamic-panel-border)'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${theme.accentBg} ${theme.badgeBorder} border`}>
              {temperature <= 22 ? (
                <Snowflake size={28} className={theme.accentText} />
              ) : temperature <= 32 ? (
                <CloudSun size={28} className={theme.accentText} />
              ) : (
                <Flame size={28} className={theme.accentText} />
              )}
            </div>
            <div>
              <div className="text-xs text-stone-300 flex items-center gap-2">
                <span>{locationName}</span>
                {manualOverride && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-stone-300">
                    Manual
                  </span>
                )}
              </div>
              <div className="text-2xl font-black tracking-tight mt-0.5">
                {temperature}°C
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${theme.accentBg} ${theme.badgeBorder} ${theme.accentText}`}>
              {theme.name}
            </span>
          </div>
        </div>

        {/* Realtime Glass Metrics */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
            <span className="text-stone-400 block text-[11px]">Blur Strength</span>
            <span className="font-semibold text-stone-200">18px Dual-Pass</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
            <span className="text-stone-400 block text-[11px]">Panel Tint</span>
            <span className="font-semibold font-mono text-[11px] text-stone-200 truncate block">
              {theme.panelBg}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Temperature Simulation Slider */}
      <div 
        className="relative z-10 rounded-2xl p-4 backdrop-blur-md border transition-all duration-700"
        style={{
          backgroundColor: 'var(--dynamic-panel-bg)',
          borderColor: 'var(--dynamic-panel-border)'
        }}
      >
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-medium text-stone-300">வெப்பநிலை சோதனை ஸ்லைடர்</span>
          <span className={`font-bold ${theme.accentText}`}>{temperature}°C</span>
        </div>
        <input 
          type="range" 
          min="15" 
          max="42" 
          value={temperature} 
          onChange={(e) => setManualTemp(Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-stone-400 mt-2">
          <span>15°C (Cool)</span>
          <span>26°C (Warm)</span>
          <span>33°C (Hot)</span>
          <span>42°C (Heatwave)</span>
        </div>
      </div>
    </div>
  );
}
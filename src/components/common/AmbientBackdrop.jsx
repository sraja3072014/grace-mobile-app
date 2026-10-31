// src/components/common/AmbientBackdrop.jsx
import React from 'react';
import ParticleCanvas from './ParticleCanvas';

export default function AmbientBackdrop({ theme }) {
  const mode = theme?.activeEngineMode || 'palette';
  const circadianKey = theme?.currentCircadianKey || 'golden_bloom';
  const weatherKey = theme?.selectedWeatherKey || 'rain';
  const accent = theme?.accent || '#06b6d4';
  const glow = theme?.glow || 'rgba(6, 182, 212, 0.20)';

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        backgroundColor: '#020617',
        backgroundImage: theme?.bgGrad || 'linear-gradient(135deg, #020617 0%, #0a0f1d 50%, #082f49 100%)',
        transition: 'background-image 1s ease-in-out, background-color 1s ease-in-out'
      }}
    >
      {/* 🌟 1. GPU-Accelerated Dynamic Ambient Aura Layers */}
      
      {/* A. CIRCADIAN TIME MODE */}
      {mode === 'time' && circadianKey === 'golden_bloom' && (
        // Solar Golden Bloom (06:00 – 11:00): Top-right radial amber/gold warmth (#f59e0b)
        <div 
          className="absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full blur-[80px] opacity-75 transform-gpu animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.20) 60%, transparent 100%)',
            willChange: 'transform, opacity'
          }}
        />
      )}

      {mode === 'time' && circadianKey === 'crisp_sky' && (
        // Daylight Crisp Sky (11:00 – 16:30): High-clarity cyan/blue illumination (#06b6d4)
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[460px] h-[360px] rounded-full blur-[90px] opacity-80 transform-gpu"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(6, 182, 212, 0.40) 0%, rgba(59, 130, 246, 0.20) 55%, transparent 100%)',
            willChange: 'transform, opacity'
          }}
        />
      )}

      {mode === 'time' && circadianKey === 'twilight_sunset' && (
        // Twilight Sunset (16:30 – 18:30): Horizon rose-violet dusk shift (#f43f5e & #8b5cf6)
        <>
          <div 
            className="absolute bottom-16 -left-20 w-[420px] h-[260px] rounded-full blur-[85px] opacity-75 transform-gpu"
            style={{
              background: 'radial-gradient(ellipse, rgba(244, 63, 94, 0.40) 0%, rgba(139, 92, 246, 0.25) 60%, transparent 100%)',
              willChange: 'transform, opacity'
            }}
          />
          <div 
            className="absolute top-1/3 -right-20 w-[300px] h-[300px] rounded-full blur-[75px] opacity-60 transform-gpu"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
              willChange: 'transform, opacity'
            }}
          />
        </>
      )}

      {mode === 'time' && circadianKey === 'lunar_obsidian' && (
        // Lunar Obsidian (18:30 – 06:00): Top-left indigo/blue-violet cool moonlit aura (#6366f1)
        <div 
          className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full blur-[85px] opacity-70 transform-gpu"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.40) 0%, rgba(79, 70, 229, 0.18) 60%, transparent 100%)',
            willChange: 'transform, opacity'
          }}
        />
      )}

      {/* B. LIVE WEATHER MODE */}
      {mode === 'weather' && weatherKey === 'rain' && (
        // Rainy Mode: Animated subtle diagonal acrylic mist sweeps, cool steel-blue tint (#38bdf8)
        <>
          <div 
            className="absolute inset-0 opacity-40 transform-gpu"
            style={{
              background: 'linear-gradient(115deg, rgba(56, 189, 248, 0.12) 0%, transparent 40%, rgba(56, 189, 248, 0.08) 80%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: 'ambientMistSweep 14s ease-in-out infinite alternate',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)'
            }}
          />
          <div 
            className="absolute top-1/4 -right-16 w-80 h-80 rounded-full blur-[70px] opacity-40"
            style={{ background: 'rgba(56, 189, 248, 0.30)' }}
          />
        </>
      )}

      {mode === 'weather' && weatherKey === 'overcast' && (
        // Overcast Mode: Soft neutral slate glow (#94a3b8)
        <div 
          className="absolute inset-x-0 top-0 h-96 blur-[80px] opacity-50 transform-gpu"
          style={{
            background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.25) 0%, rgba(100, 116, 139, 0.10) 70%, transparent 100%)'
          }}
        />
      )}

      {mode === 'weather' && weatherKey === 'clear' && (
        // Clear Sky: Standard solar radiant aura
        <div 
          className="absolute -top-20 right-1/4 w-[360px] h-[360px] rounded-full blur-[80px] opacity-65 transform-gpu"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(14, 165, 233, 0.15) 60%, transparent 100%)'
          }}
        />
      )}

      {/* C. MANUAL ACRYLIC PALETTE MODE */}
      {mode === 'palette' && (
        <>
          <div 
            className="absolute -top-24 right-0 w-[340px] h-[340px] rounded-full blur-[85px] opacity-70 transform-gpu"
            style={{
              background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
              willChange: 'transform, opacity'
            }}
          />
          <div 
            className="absolute bottom-20 -left-20 w-[300px] h-[300px] rounded-full blur-[75px] opacity-50 transform-gpu"
            style={{
              background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
              willChange: 'transform, opacity'
            }}
          />
        </>
      )}

      {/* 🌟 2. Micro-Particle Canvas Overlay */}
      <ParticleCanvas particleType={theme?.particleType || 'stars'} />

      {/* CSS Animation Keyframes for Mist Sweeps */}
      <style>{`
        @keyframes ambientMistSweep {
          0% { transform: translate3d(-4%, -2%, 0) scale(1); }
          50% { transform: translate3d(3%, 3%, 0) scale(1.05); }
          100% { transform: translate3d(-2%, 4%, 0) scale(1.02); }
        }
      `}</style>
    </div>
  );
}


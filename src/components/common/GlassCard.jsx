// src/components/common/GlassCard.jsx
import React from 'react';

export default function GlassCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[28px] border transition-all duration-300 relative overflow-hidden select-none ${
        onClick ? 'cursor-pointer active:scale-98 hover:border-white/40' : ''
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
        backdropFilter: 'blur(40px) saturate(190%)',
        WebkitBackdropFilter: 'blur(40px) saturate(190%)',
        borderColor: 'rgba(255, 255, 255, 0.22)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      {children}
    </div>
  );
}
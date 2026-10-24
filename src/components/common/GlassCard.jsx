// src/components/common/GlassCard.jsx
import React from 'react';

export default function GlassCard({ 
  children, 
  theme, 
  className = '', 
  onClick, 
  clickable = false 
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-3xl border backdrop-blur-xl shadow-md transition-all ${
        clickable ? 'cursor-pointer active:scale-98 hover:scale-[1.01]' : ''
      } ${className}`}
      style={{
        background: theme.glassBg,
        borderColor: theme.glassBorder,
        boxShadow: theme.isDark 
          ? '8px 8px 20px rgba(0,0,0,0.4), -3px -3px 12px rgba(255,255,255,0.03)'
          : '6px 6px 16px rgba(0,0,0,0.08), -3px -3px 12px rgba(255,255,255,0.6)'
      }}
    >
      {children}
    </div>
  );
}
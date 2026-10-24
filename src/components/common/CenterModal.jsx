// src/components/common/CenterModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function CenterModal({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon, 
  theme, 
  children,
  maxWidth = 'max-w-sm',
  maxHeight = 'max-h-[84vh]'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Centered Glass Dialog Card */}
      <div 
        className={`relative z-10 w-full ${maxWidth} ${maxHeight} rounded-[36px] p-6 border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}
        style={{
          background: theme.isDark ? 'rgba(25, 20, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: theme.glassBorder,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
        }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-black/10 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={18} style={{ color: theme.accent }} />}
            <h2 className="text-base font-extrabold tracking-tight">{title}</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto py-3 space-y-4 text-xs pr-1 scrollbar-none flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
// src/components/common/PullToRefresh.jsx
import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children, theme }) {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    } else {
      startY.current = 0;
    }
  };

  const handleTouchMove = (e) => {
    if (!startY.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && window.scrollY === 0) {
      // Resistance effect for touch pulling
      const damped = Math.min(diff * 0.45, 70);
      setPullY(damped);
    }
  };

  const handleTouchEnd = async () => {
    if (pullY >= 48 && !isRefreshing) {
      setIsRefreshing(true);
      setPullY(48);
      try {
        if (navigator.vibrate) navigator.vibrate(25);
        await onRefresh?.();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullY(0);
        }, 400);
      }
    } else {
      setPullY(0);
    }
    startY.current = 0;
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen"
    >
      {/* Pull Indicator Spinner */}
      <div 
        className="w-full flex items-center justify-center transition-all duration-200 overflow-hidden"
        style={{ height: `${pullY}px` }}
      >
        <div 
          className="px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-1.5 text-[11px] font-bold shadow-lg"
          style={{ 
            background: theme?.glassBg || 'rgba(255, 255, 255, 0.08)', 
            borderColor: theme?.glassBorder || 'rgba(255, 255, 255, 0.15)',
            color: theme?.accent || '#f59e0b' 
          }}
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Live Syncing...' : 'Pull to Refresh'}</span>
        </div>
      </div>

      {children}
    </div>
  );
}
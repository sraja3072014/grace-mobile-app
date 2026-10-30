// src/components/layout/DynamicIslandDock.jsx
import React from 'react';
import { 
  Home, Users, Church, Radio, 
  Plus, CheckSquare, DollarSign, UserPlus, Sparkles
} from 'lucide-react';

export default function DynamicIslandDock({
  activeTab,
  setActiveTab,
  activeSubMenu,
  setActiveSubMenu,
  isIslandExpanded,
  setIsIslandExpanded,
  onTriggerAction,
  theme
}) {
  const mainNavTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'people', label: 'People', icon: Users, isPopup: true },
    { id: 'church', label: 'Church', icon: Church, isPopup: true },
    { id: 'connect', label: 'Connect', icon: Radio, isPopup: true }
  ];

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 flex flex-col items-center justify-center px-4 pointer-events-none">
      
      {/* 🌟 1. Expanded Quick Actions (Crystal Glass Dock) */}
      {isIslandExpanded && (
        <div 
          className="mb-2.5 p-2 rounded-3xl border shadow-2xl flex items-center gap-2 pointer-events-auto animate-in zoom-in-95 duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%)',
            backdropFilter: 'blur(40px) saturate(190%)',
            WebkitBackdropFilter: 'blur(40px) saturate(190%)',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              onTriggerAction('action_checkin');
              setIsIslandExpanded(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white cursor-pointer active:scale-95 transition"
          >
            <CheckSquare size={13} className="text-emerald-300" />
            <span>Check-in</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTriggerAction('action_tithe');
              setIsIslandExpanded(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white cursor-pointer active:scale-95 transition"
          >
            <DollarSign size={13} className="text-cyan-300" />
            <span>Tithe</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTriggerAction('action_add_member');
              setIsIslandExpanded(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white cursor-pointer active:scale-95 transition"
          >
            <UserPlus size={13} className="text-amber-300" />
            <span>Member</span>
          </button>
        </div>
      )}

      {/* 🌟 2. Main Crystal Floating Dynamic Island Capsule */}
      <nav 
        className="h-14 px-3.5 rounded-full border shadow-2xl flex items-center gap-2 pointer-events-auto select-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.45), inset 0 -1px 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {mainNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.isPopup && activeSubMenu === tab.id);

          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => {
                if (tab.isPopup) {
                  setActiveSubMenu(activeSubMenu === tab.id ? null : tab.id);
                } else {
                  setActiveTab(tab.id);
                  setActiveSubMenu(null);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${
                isActive 
                  ? 'bg-white/20 border border-white/30 text-white font-bold shadow-md' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'opacity-70'} />
              {isActive && <span className="text-xs tracking-tight">{tab.label}</span>}
            </button>
          );
        })}

        {/* Center/End Dynamic Plus Trigger */}
        <button
          type="button"
          onClick={() => setIsIslandExpanded(!isIslandExpanded)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg border border-white/30 cursor-pointer transition-transform duration-300 active:scale-90 ${
            isIslandExpanded ? 'rotate-45' : ''
          }`}
          style={{ background: theme?.accent || '#f59e0b' }}
        >
          <Plus size={18} />
        </button>
      </nav>

    </div>
  );
}
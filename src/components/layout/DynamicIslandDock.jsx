import React from 'react';
import { Plus, X } from 'lucide-react';
import { 
  BOTTOM_NAV_TABS, 
  DYNAMIC_ISLAND_ACTIONS 
} from '../../constants/navigationConfig';

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
  const handleTabClick = (tab) => {
    setIsIslandExpanded(false);
    if (tab.hasSubMenu) {
      if (activeSubMenu === tab.id) {
        setActiveSubMenu(null);
      } else {
        setActiveSubMenu(tab.id);
      }
    } else {
      setActiveSubMenu(null);
      setActiveTab(tab.id);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40">
      
      {/* Expanded Island Control Dock */}
      {isIslandExpanded && (
        <div 
          className="mb-3 p-4 rounded-[32px] border backdrop-blur-2xl shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-300"
          style={{
            background: theme.navBg,
            borderColor: theme.glassBorder,
            boxShadow: '0 12px 36px rgba(0,0,0,0.25)'
          }}
        >
          <div className="flex justify-between items-center text-xs font-extrabold pb-2 border-b border-black/10 dark:border-white/10">
            <span>Quick Command Launcher</span>
            <button 
              type="button" 
              onClick={() => setIsIslandExpanded(false)}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {DYNAMIC_ISLAND_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button 
                  key={action.id}
                  type="button"
                  onClick={() => {
                    onTriggerAction(action.id);
                    setIsIslandExpanded(false);
                  }}
                  className="p-2.5 rounded-2xl border flex flex-col items-center gap-1 active:scale-95 transition bg-white/40 dark:bg-white/5 text-center cursor-pointer"
                  style={{ borderColor: theme.glassBorder }}
                >
                  <Icon size={16} style={{ color: action.color || theme.accent }} />
                  <span className="text-[9px] font-bold leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <nav 
        className="rounded-full px-5 py-2.5 flex items-center justify-between border backdrop-blur-2xl shadow-2xl transition-all"
        style={{
          background: theme.navBg,
          borderColor: theme.glassBorder,
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)'
        }}
      >
        {/* Left Tabs (Home & People) */}
        {BOTTOM_NAV_TABS.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.hasSubMenu ? activeSubMenu === tab.id : activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer ${
                isActive ? '-translate-y-1' : 'opacity-60'
              }`}
              style={{ color: isActive ? theme.accent : undefined }}
              aria-label={tab.label}
            >
              <Icon size={20} />
            </button>
          );
        })}

        {/* Center Dynamic Island Button (+) */}
        <button 
          type="button"
          onClick={() => {
            setActiveSubMenu(null);
            setIsIslandExpanded(!isIslandExpanded);
          }}
          className="w-13 h-13 -mt-6 rounded-full flex items-center justify-center text-white shadow-2xl transition active:scale-90 border-4 cursor-pointer"
          style={{
            background: theme.accent,
            borderColor: theme.navBg,
            boxShadow: `0 6px 20px ${theme.accent}66`
          }}
          title="Toggle Dynamic Island"
          aria-label="Dynamic Island Actions"
        >
          <Plus 
            size={24} 
            className={`stroke-[2.5] transition-transform duration-300 ${
              isIslandExpanded ? 'rotate-45' : 'rotate-0'
            }`} 
          />
        </button>

        {/* Right Tabs (Church & Connect) */}
        {BOTTOM_NAV_TABS.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.hasSubMenu ? activeSubMenu === tab.id : activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer ${
                isActive ? '-translate-y-1' : 'opacity-60'
              }`}
              style={{ color: isActive ? theme.accent : undefined }}
              aria-label={tab.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </nav>

    </div>
  );
}
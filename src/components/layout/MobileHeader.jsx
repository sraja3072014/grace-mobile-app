// src/components/layout/MobileHeader.jsx
import React from 'react';
import { ChevronDown, Bell, Building2, Check, MapPin } from 'lucide-react';

export default function MobileHeader({ 
  branches = [],
  selectedBranch, 
  onSelectBranch,
  isBranchMenuOpen,
  setIsBranchMenuOpen,
  theme, 
  userProfile, 
  isUserMenuOpen, 
  setIsUserMenuOpen 
}) {
  return (
    <header className="relative z-20 max-w-lg mx-auto px-5 pt-6 flex items-center justify-between">
      
      {/* 1. Branch / Campus Selector Button */}
      <div className="relative">
        <div 
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsBranchMenuOpen(!isBranchMenuOpen);
          }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-xl shadow-md cursor-pointer transition-all active:scale-95"
          style={{
            background: theme.glassBg,
            borderColor: theme.glassBorder
          }}
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] text-white shadow-xs" 
            style={{ background: theme.accent }}
          >
            {selectedBranch?.code ? selectedBranch.code.substring(0, 2) : 'GC'}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none max-w-[140px] truncate">
              {selectedBranch?.name || 'Grace Cathedral'}
            </span>
            <span className="text-[9px] font-bold opacity-60">
              {selectedBranch?.city || 'Headquarters'}
            </span>
          </div>
          <ChevronDown 
            size={14} 
            className={`opacity-60 ml-0.5 transition-transform duration-200 ${isBranchMenuOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        {/* 2. அவதார் மெனு போல கீழே விரியும் Branch Dropdown Menu */}
        {isBranchMenuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsBranchMenuOpen(false)} />
            <div 
              className="absolute left-0 top-12 w-64 rounded-3xl p-2.5 border backdrop-blur-2xl shadow-2xl z-40 space-y-1.5 animate-in fade-in zoom-in-95 duration-200"
              style={{
                background: theme.navBg,
                borderColor: theme.glassBorder,
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
              }}
            >
              <div className="px-3 py-1.5 border-b border-black/10 dark:border-white/10 flex items-center gap-1.5 opacity-60">
                <Building2 size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">Select Campus / Branch</span>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5">
                {branches.map((b) => {
                  const isSelected = selectedBranch?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        onSelectBranch(b);
                        setIsBranchMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-2xl transition cursor-pointer active:scale-95 text-left ${
                        isSelected 
                          ? 'bg-orange-500/15 border border-orange-500/40' 
                          : 'hover:bg-black/5 dark:hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div 
                          className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-[10px] text-white shrink-0" 
                          style={{ background: theme.accent }}
                        >
                          {b.code ? b.code.substring(0, 2) : 'GC'}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold leading-tight truncate">{b.name}</h4>
                          <span className="text-[9px] opacity-60 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin size={9} /> {b.city} • {b.isHQ ? 'Primary HQ' : 'Branch'}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check size={14} style={{ color: theme.accent }} className="shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Right Controls: Bell and User Profile Avatar */}
      <div className="flex items-center gap-2.5 relative">
        <button 
          type="button"
          className="p-2.5 rounded-full border backdrop-blur-xl shadow-md active:scale-95 transition cursor-pointer"
          style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>

        <div 
          onClick={() => {
            setIsBranchMenuOpen(false);
            setIsUserMenuOpen(!isUserMenuOpen);
          }}
          className="w-10 h-10 rounded-full border-2 bg-cover bg-center cursor-pointer shadow-md hover:scale-105 active:scale-95 transition relative"
          style={{ 
            backgroundImage: `url('${userProfile?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}')`,
            borderColor: theme.accent 
          }}
        >
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>
      </div>
    </header>
  );
}
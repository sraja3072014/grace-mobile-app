import React from 'react';
import { AVATAR_DROPDOWN_MENU } from '../../constants/navigationConfig';

export default function UserDropdownMenu({ 
  isOpen, 
  onClose, 
  userProfile, 
  selectedBranch, 
  theme, 
  onSelectAction 
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div 
        className="absolute right-5 top-20 w-56 rounded-3xl p-2.5 border backdrop-blur-2xl shadow-2xl z-40 space-y-1 animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: theme.navBg,
          borderColor: theme.glassBorder
        }}
      >
        <div className="px-3 py-2 border-b border-black/10 dark:border-white/10 mb-1">
          <h4 className="text-xs font-black truncate">{userProfile?.name || 'Raja S'}</h4>
          <p className="text-[10px] opacity-60 font-semibold truncate">
            {userProfile?.role || 'Lead Pastor'} • {selectedBranch?.city || 'Headquarters'}
          </p>
        </div>

        {AVATAR_DROPDOWN_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectAction(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer active:scale-95 ${
                item.isDanger 
                  ? 'text-rose-500 hover:bg-rose-500/10' 
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={15} style={{ color: item.isDanger ? '#f43f5e' : theme.accent }} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 opacity-70">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
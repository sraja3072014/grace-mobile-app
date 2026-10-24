import React from 'react';
import { 
  PEOPLE_SUB_MENU, 
  CHURCH_SUB_MENU, 
  CONNECT_SUB_MENU 
} from '../../constants/navigationConfig';

export default function NavSubPopups({ 
  activeSubMenu, 
  onClose, 
  onSelectSubItem, 
  theme 
}) {
  if (!activeSubMenu) return null;

  let menuItems = [];
  let title = '';

  if (activeSubMenu === 'people') {
    menuItems = PEOPLE_SUB_MENU;
    title = 'People & Shepherding';
  } else if (activeSubMenu === 'church') {
    menuItems = CHURCH_SUB_MENU;
    title = 'Church Operations';
  } else if (activeSubMenu === 'connect') {
    menuItems = CONNECT_SUB_MENU;
    title = 'Connect & Fellowship';
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div 
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm rounded-[32px] p-4 border backdrop-blur-3xl shadow-2xl z-40 space-y-2 animate-in slide-in-from-bottom-4 duration-200"
        style={{
          background: theme.navBg,
          borderColor: theme.glassBorder,
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
        }}
      >
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-black/10 dark:border-white/10">
          <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
            {title}
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
            Sub Menu
          </span>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectSubItem(item.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs"
                    style={{ background: theme.glassBorder, color: theme.accent }}
                  >
                    <Icon size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{item.label}</h4>
                    <span className="text-[10px] opacity-60 font-medium">{item.desc}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
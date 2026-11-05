import { useEffect, useRef, useState } from 'react';
import { CircleUserRound, LogOut, Settings, UserRound } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function HeaderProfileMenu({
  userProfile = {},
  onOpenProfile,
  onOpenSettings,
  onSignOut
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = event => {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = event => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = callback => {
    setIsOpen(false);
    callback?.();
  };
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/70 bg-emerald-500/20 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.28)] transition hover:bg-emerald-400/30 active:scale-90"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
        <CircleUserRound size={18} className="relative" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-[80] w-64 rounded-2xl border border-white/15 bg-slate-950/90 p-3 text-white shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-white/10 px-2 pb-3">
            <p className="truncate text-sm font-bold">{userProfile.name || 'GraceOS User'}</p>
            <p className="mt-0.5 truncate text-[11px] text-white/55">{userProfile.email || t('no_email_available')}</p>
            <span className="mt-2 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
              {userProfile.role || 'MEMBER'}
            </span>
          </div>
          <div className="space-y-1 pt-2">
            <button type="button" onClick={() => handleAction(onOpenProfile)} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-white/85 hover:bg-white/10">
              <UserRound size={14} className="text-emerald-300" /> {t('user_profile')}
            </button>
            <button type="button" onClick={() => handleAction(onOpenSettings)} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-white/85 hover:bg-white/10">
              <Settings size={14} className="text-cyan-300" /> {t('settings')}
            </button>
            <button type="button" onClick={() => handleAction(onSignOut)} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-rose-300 hover:bg-rose-400/10">
              <LogOut size={14} /> {t('sign_out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

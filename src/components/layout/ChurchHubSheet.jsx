import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  Church,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Plus,
  ShieldCheck,
  Users,
  Wallet,
  X
} from 'lucide-react';

const adminItems = [
  { id: 'information', label: 'Information', description: 'சபை விவரங்கள், முகவரி மற்றும் தொலைபேசி', icon: Building2 },
  { id: 'users', label: 'Users and Access', description: 'சபைத் தலைவர்கள் மற்றும் போதகர்களுக்கான அனுமதிகள்', icon: ShieldCheck },
  { id: 'care', label: 'Care Team', description: 'விசிட்டிங் மற்றும் போதக ஆலோசனைக் குழு', icon: HeartHandshake }
];

const fellowshipItems = [
  { id: 'sunday-school', label: 'Sunday School', description: 'சிறார் வகுப்பு அட்டவணை மற்றும் ஆசிரியர்கள்', icon: GraduationCap },
  { id: 'youth', label: 'Youth Fellowship', description: 'வாலிபர் ஐக்கியம்', icon: Users },
  { id: 'women', label: "Women's Fellowship", description: 'மகளிர் ஐக்கியக் கூடுகை', icon: HeartHandshake },
  { id: 'men', label: "Men's Fellowship", description: 'சகோதரர் ஐக்கியக் கூடுகை', icon: Users }
];

const moduleItems = [
  { id: 'finance', label: 'Finance & Offerings', icon: Wallet },
  { id: 'school', label: 'Sunday School Tracker', icon: BookOpen },
  { id: 'liturgy', label: 'Service Plans / Liturgy', icon: Church }
];

function SectionTitle({ children }) {
  return <h3 className="px-1 mb-2 text-[10px] font-black uppercase tracking-[0.16em] opacity-55">{children}</h3>;
}

export default function ChurchHubSheet({
  isOpen,
  onClose,
  branches,
  selectedBranch,
  onSelectBranch,
  onCreateBranch,
  moduleStates,
  setModuleStates,
  theme
}) {
  const [activeInfo, setActiveInfo] = useState(null);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocusedElement = document.activeElement;
    const dialog = dialogRef.current;
    dialog?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;

      const focusableElements = dialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === dialog)) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderNavigationRows = (items) => items.map(({ id, label, description, icon: Icon }) => (
    <button
      type="button"
      key={id}
      onClick={() => setActiveInfo(activeInfo === id ? null : id)}
      className="w-full flex items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-black/5 dark:hover:bg-white/10"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: theme.glassBg, color: theme.accent }}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold">{label}</span>
        <span className="mt-0.5 block text-[10px] leading-snug opacity-60">{description}</span>
      </span>
      <ChevronRight size={15} className={`shrink-0 opacity-40 transition-transform ${activeInfo === id ? 'rotate-90' : ''}`} />
    </button>
  ));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="presentation">
      <button type="button" aria-label="Close Church Hub" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="church-hub-title"
        tabIndex={-1}
        ref={dialogRef}
        className="church-sheet-enter relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[32px] border shadow-2xl"
        style={{ background: theme.navBg, borderColor: theme.glassBorder, color: theme.textMain }}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-current opacity-20" />
        <header className="flex items-center gap-3 border-b border-black/10 px-5 py-4 dark:border-white/10">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg" style={{ background: theme.accent }}>
            <Church size={23} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="church-hub-title" className="truncate text-sm font-black">Grace Central Cathedral</h2>
            <p className="mt-0.5 text-[10px] font-semibold opacity-60">Administrator / Lead Pastor</p>
            <p className="text-[10px] opacity-55">{selectedBranch?.city || 'Koduvai'} · சபை கிளைகள் & அமைப்புகள்</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto px-4 pb-8 pt-4">
          <section className="mb-5">
            <SectionTitle>Settings & Admin · நிர்வாகம்</SectionTitle>
            <div className="rounded-3xl border p-1" style={{ borderColor: theme.glassBorder }}>
              {renderNavigationRows(adminItems)}
              {activeInfo && adminItems.some((item) => item.id === activeInfo) && (
                <p className="mx-3 mb-3 rounded-xl px-3 py-2 text-[10px] leading-relaxed opacity-65" style={{ background: theme.glassBg }}>
                  {activeInfo === 'information' && 'Grace Central Cathedral · Main Road, Koduvai · +91 84280 44555'}
                  {activeInfo === 'users' && 'Administrator and Lead Pastor access is active for this account.'}
                  {activeInfo === 'care' && 'Care Team coordinates member visits, prayer support, and pastoral counseling.'}
                </p>
              )}
            </div>
          </section>

          <section className="mb-5">
            <SectionTitle>Groups & Fellowships · சபைக் கூட்டங்கள்</SectionTitle>
            <div className="rounded-3xl border p-1" style={{ borderColor: theme.glassBorder }}>
              {renderNavigationRows(fellowshipItems)}
              {activeInfo && fellowshipItems.some((item) => item.id === activeInfo) && (
                <p className="mx-3 mb-3 rounded-xl px-3 py-2 text-[10px] leading-relaxed opacity-65" style={{ background: theme.glassBg }}>
                  {fellowshipItems.find((item) => item.id === activeInfo)?.description}
                </p>
              )}
            </div>
          </section>

          <section className="mb-5">
            <SectionTitle>App Modules · செயலித் தொகுதிகள்</SectionTitle>
            <div className="space-y-2">
              {moduleItems.map(({ id, label, icon: Icon }) => (
                <div key={id} className="flex items-center gap-3 rounded-2xl border px-3 py-3" style={{ background: theme.glassBg, borderColor: theme.glassBorder }}>
                  <Icon size={17} style={{ color: theme.accent }} />
                  <span className="flex-1 text-xs font-bold">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(moduleStates[id])}
                    aria-label={`${label} ${moduleStates[id] ? 'on' : 'off'}`}
                    onClick={() => setModuleStates((current) => ({ ...current, [id]: !current[id] }))}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors ${moduleStates[id] ? 'bg-emerald-500' : 'bg-black/20 dark:bg-white/20'}`}
                  >
                    <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${moduleStates[id] ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>My Branches / Campus Spaces · கிளைச் சபைகள்</SectionTitle>
            <div className="space-y-2">
              {branches.map((branch) => {
                const isSelected = selectedBranch?.id === branch.id;
                return (
                  <button
                    type="button"
                    key={branch.id}
                    onClick={() => onSelectBranch(branch)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${isSelected ? 'border-current' : ''}`}
                    style={{ background: isSelected ? `${theme.accent}18` : theme.glassBg, borderColor: isSelected ? theme.accent : theme.glassBorder }}
                  >
                    <MapPin size={17} style={{ color: theme.accent }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-extrabold">{branch.isHQ ? 'Headquarters / Main Sanctuary' : branch.name}</span>
                      <span className="block text-[10px] opacity-60">{branch.city}</span>
                    </span>
                    {isSelected && <Check size={16} style={{ color: theme.accent }} />}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={onCreateBranch}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed p-3 text-xs font-extrabold transition hover:bg-black/5 dark:hover:bg-white/10"
                style={{ borderColor: theme.accent, color: theme.accent }}
              >
                <Plus size={16} /> Create or Join Another Campus / Branch
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

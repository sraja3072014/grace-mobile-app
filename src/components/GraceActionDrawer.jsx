import { useState } from 'react';
import {
  X,
  LayoutDashboard,
  UserCheck,
  Users,
  UserPlus,
  Cross,
  HeartHandshake,
  CalendarDays,
  Radio,
  BadgeIndianRupee,
  Megaphone,
  BarChart3,
  Settings,
  PlusCircle,
  ChevronRight,
  Flame
} from 'lucide-react';

const GRACE_MODULES = [
  { id: 'overview', title: 'Overview', desc: 'முகப்பு கட்டுப்பாட்டகம்', icon: LayoutDashboard, category: 'core' },
  { id: 'attendance', title: 'Attendance', desc: 'வருகைப் பதிவு & QR', icon: UserCheck, category: 'people' },
  { id: 'members', title: 'Members', desc: 'உறுப்பினர் தரவுத்தளம்', icon: Users, category: 'people' },
  { id: 'visitors', title: 'Visitors', desc: 'புதிய விருந்தினர்கள்', icon: UserPlus, category: 'people' },
  { id: 'ministries', title: 'Ministries', desc: 'ஊழியக் குழுக்கள்', icon: Cross, category: 'church' },
  { id: 'prayer', title: 'Prayer', desc: 'ஜெபக் கோரிக்கைகள்', icon: HeartHandshake, category: 'church' },
  { id: 'events', title: 'Events', desc: 'நிகழ்வுகள் & காலண்டர்', icon: CalendarDays, category: 'operations' },
  { id: 'live', title: 'Live', desc: 'நேரலை & Stream Sync', icon: Radio, category: 'operations' },
  { id: 'finance', title: 'Finance', desc: 'நன்கொடை & வரவு செலவு', icon: BadgeIndianRupee, category: 'finance' },
  { id: 'broadcast', title: 'Broadcast', desc: 'SMS & WhatsApp அறிவிப்பு', icon: Megaphone, category: 'communications' },
  { id: 'reports', title: 'Reports', desc: 'மாதாந்திர பகுப்பாய்வு', icon: BarChart3, category: 'finance' },
  { id: 'settings', title: 'Settings', desc: 'கணினி அமைப்புகள்', icon: Settings, category: 'core' },
];

export default function GraceActionDrawer({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onSelectModule, 
  onOpenQuickAdd 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'அனைத்தும்' },
    { id: 'core', label: 'Core' },
    { id: 'people', label: 'People' },
    { id: 'church', label: 'Ministry' },
    { id: 'operations', label: 'Ops' },
    { id: 'finance', label: 'Finance' },
    { id: 'communications', label: 'Comms' },
  ];

  const filteredModules = selectedCategory === 'all' 
    ? GRACE_MODULES 
    : GRACE_MODULES.filter(m => m.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Background Dimmed Overlay */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Main Glassmorphism Sheet */}
      <div 
        className="relative z-10 w-full max-w-lg max-h-[88vh] rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 border shadow-2xl flex flex-col overflow-hidden"
        style={{
          background: 'rgba(22, 16, 12, 0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderColor: currentTheme?.glassBorder || 'rgba(249, 115, 22, 0.3)',
        }}
      >
        {/* Mobile Swipe Handle Indicator */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Flame size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">GraceOS Command Hub</h2>
              <p className="text-[11px] text-stone-400">12 Primary Mobile Operations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Instant Action Banner (Quick Add Modal Shortcut) */}
        <div 
          onClick={() => {
            onClose();
            if (onOpenQuickAdd) onOpenQuickAdd();
          }}
          className="mt-3.5 p-3 rounded-2xl border border-dashed border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/15 cursor-pointer flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2.5">
            <PlusCircle size={20} className="text-orange-400 group-hover:rotate-90 transition-transform duration-300" />
            <div>
              <span className="text-xs font-bold text-orange-200 block">உடனடி பதிவு (Quick Entry)</span>
              <span className="text-[10px] text-orange-300/70">புதிய நிகழ்வு அல்லது நன்கொடை சேர்க்க</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-orange-400/80" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white border-orange-400 shadow-md'
                  : 'bg-white/5 text-stone-400 border-white/5 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 12 Modules Glass Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-3 gap-2.5 my-2">
          {filteredModules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onSelectModule) onSelectModule(item.id);
                  onClose();
                }}
                className="group relative p-3 rounded-2xl border border-white/5 bg-black/25 hover:bg-white/10 hover:border-orange-500/40 transition-all flex flex-col items-center justify-center text-center gap-2 active:scale-95"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform"
                  style={{ color: currentTheme?.accent || '#f97316' }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white/95 group-hover:text-orange-300 transition">
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-stone-400 font-medium truncate max-w-[80px]">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Status bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
          <span>GraceOS Local Vault</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </div>
  );
}
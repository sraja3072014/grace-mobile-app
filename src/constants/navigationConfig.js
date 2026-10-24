// src/constants/navigationConfig.js
import { 
  Home, Users, CalendarDays, Radio, 
  UserPlus, Baby, Receipt, Calendar, ClipboardList, 
  Video, Megaphone, HeartHandshake, BookOpen, 
  UserCheck, DollarSign, BarChart3, Settings, HelpCircle, LogOut 
} from 'lucide-react';

// 1. கீழ்ப்பகுதி 4 முதன்மை டேப்கள்
export const BOTTOM_NAV_TABS = [
  { id: 'home', label: 'Home', icon: Home, hasSubMenu: false },
  { id: 'people', label: 'People', icon: Users, hasSubMenu: true },
  { id: 'church', label: 'Church', icon: CalendarDays, hasSubMenu: true },
  { id: 'connect', label: 'Connect', icon: Radio, hasSubMenu: true }
];

// 2. People சப்-மெனு
export const PEOPLE_SUB_MENU = [
  { id: 'members', label: 'Members Directory', desc: 'சபை உறுப்பினர்கள்', icon: Users },
  { id: 'visitors', label: 'Visitors Registry', desc: 'புதிய விருந்தினர்கள்', icon: UserPlus },
  { id: 'ministries', label: 'Ministries & Teams', desc: 'ஊழியப் பிரிவுகள்', icon: Baby }
];

// 3. Church Life சப்-மெனு
export const CHURCH_SUB_MENU = [
  { id: 'finance', label: 'Finance & 80G', desc: 'காணிக்கை & வரவு-செலவு', icon: Receipt },
  { id: 'events', label: 'Events Calendar', desc: 'கூட்டங்கள் & நிகழ்வுகள்', icon: Calendar },
  { id: 'service_plans', label: 'Service Plans', desc: 'ஆராதனை நிகழ்ச்சி நிரல்', icon: ClipboardList }
];

// 4. Connect சப்-மெனு
export const CONNECT_SUB_MENU = [
  { id: 'livestream', label: 'Live Stream Desk', desc: 'மேடை நேரலை ஸ்ட்ரீம்', icon: Video },
  { id: 'broadcast', label: 'Broadcast Hub', desc: 'SMS / WhatsApp அறிவிப்பு', icon: Megaphone },
  { id: 'prayer', label: 'Prayer Wall', desc: 'ஜெபக் கோரிக்கைகள்', icon: HeartHandshake },
  { id: 'bible', label: 'Holy Bible', desc: 'வேத புத்தகம் (தமிழ் / KJV)', icon: BookOpen }
];

// 5. '+' (Dynamic Island) உடனடி விரைவுச் செயல்பாடுகள் (Donation / Offering என மாற்றப்பட்டது)
export const DYNAMIC_ISLAND_ACTIONS = [
  { id: 'action_checkin', label: 'Check-In', icon: UserCheck, color: '#38bdf8' },
  { id: 'action_tithe', label: 'Donation / Offering', icon: DollarSign, color: '#10b981' },
  { id: 'action_add_member', label: 'Add Person', icon: UserPlus, color: '#ff6b6b' },
  { id: 'action_service_flow', label: 'Service Flow', icon: CalendarDays, color: '#f59e0b' }
];

// 6. Header அவதார் மெனு
export const AVATAR_DROPDOWN_MENU = [
  { id: 'profile', label: 'View Profile', icon: Users },
  { id: 'reports', label: 'Reports & Audits', icon: BarChart3, badge: 'Admin' },
  { id: 'settings', label: 'Settings & Theme', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'signout', label: 'Sign Out', icon: LogOut, isDanger: true }
];
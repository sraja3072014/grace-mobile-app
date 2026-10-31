// src/constants/navigationConfig.js
import { 
  Home, Users, CalendarDays, Radio, 
  UserPlus, Baby, Receipt, Calendar, ClipboardList, 
  Video, Megaphone, HeartHandshake, BookOpen, 
  UserCheck, DollarSign, BarChart3, Settings, HelpCircle, LogOut 
} from 'lucide-react';
import { translations } from '../i18n/translations';

export function getNavigationConfig(language = 'en') {
  const nav = translations[language]?.nav || translations.en.nav;
  return {
    bottomNavTabs: [
      { id: 'home', label: nav.home, icon: Home, hasSubMenu: false },
      { id: 'people', label: nav.people, icon: Users, hasSubMenu: true },
      { id: 'church', label: nav.church, icon: CalendarDays, hasSubMenu: true },
      { id: 'connect', label: nav.connect, icon: Radio, hasSubMenu: true }
    ],
    peopleSubMenu: [
      { id: 'members', label: nav.members, desc: language === 'ta' ? 'சபை உறுப்பினர்கள்' : 'Church members', icon: Users },
      { id: 'visitors', label: nav.visitors, desc: language === 'ta' ? 'புதிய விருந்தினர்கள்' : 'New visitors', icon: UserPlus },
      { id: 'ministries', label: nav.ministries, desc: language === 'ta' ? 'ஊழியப் பிரிவுகள்' : 'Ministry teams', icon: Baby }
    ],
    churchSubMenu: [
      { id: 'finance', label: nav.finance, desc: language === 'ta' ? 'காணிக்கை & வரவு-செலவு' : 'Giving & accounts', icon: Receipt },
      { id: 'events', label: nav.events, desc: language === 'ta' ? 'கூட்டங்கள் & நிகழ்வுகள்' : 'Meetings & events', icon: Calendar },
      { id: 'service_plans', label: nav.servicePlans, desc: language === 'ta' ? 'ஆராதனை நிகழ்ச்சி நிரல்' : 'Worship schedules', icon: ClipboardList }
    ],
    connectSubMenu: [
      { id: 'livestream', label: nav.livestream, desc: language === 'ta' ? 'மேடை நேரலை ஸ்ட்ரீம்' : 'Stage livestream', icon: Video },
      { id: 'broadcast', label: nav.broadcast, desc: language === 'ta' ? 'SMS / WhatsApp அறிவிப்பு' : 'SMS / WhatsApp notices', icon: Megaphone },
      { id: 'prayer', label: nav.prayer, desc: language === 'ta' ? 'ஜெபக் கோரிக்கைகள்' : 'Prayer requests', icon: HeartHandshake },
      { id: 'bible', label: nav.bible, desc: language === 'ta' ? 'வேத புத்தகம் (தமிழ் / KJV)' : 'Scripture (Tamil / KJV)', icon: BookOpen }
    ],
    dynamicIslandActions: [
      { id: 'action_checkin', label: nav.checkIn, icon: UserCheck, color: '#38bdf8' },
      { id: 'action_tithe', label: nav.donation, icon: DollarSign, color: '#10b981' },
      { id: 'action_add_member', label: nav.addPerson, icon: UserPlus, color: '#ff6b6b' },
      { id: 'action_service_flow', label: nav.serviceFlow, icon: CalendarDays, color: '#f59e0b' }
    ],
    avatarDropdownMenu: [
      { id: 'profile', label: nav.profile, icon: Users },
      { id: 'reports', label: nav.reports, icon: BarChart3, badge: nav.admin },
      { id: 'settings', label: nav.settings, icon: Settings },
      { id: 'help', label: nav.help, icon: HelpCircle },
      { id: 'signout', label: nav.signOut, icon: LogOut, isDanger: true }
    ]
  };
}

const defaultNavigation = getNavigationConfig('en');

// 1. கீழ்ப்பகுதி 4 முதன்மை டேப்கள்
export const BOTTOM_NAV_TABS = defaultNavigation.bottomNavTabs;

// 2. People சப்-மெனு
export const PEOPLE_SUB_MENU = defaultNavigation.peopleSubMenu;

// 3. Church Life சப்-மெனு
export const CHURCH_SUB_MENU = defaultNavigation.churchSubMenu;

// 4. Connect சப்-மெனு
export const CONNECT_SUB_MENU = defaultNavigation.connectSubMenu;

// 5. '+' (Dynamic Island) உடனடி விரைவுச் செயல்பாடுகள் (Donation / Offering என மாற்றப்பட்டது)
export const DYNAMIC_ISLAND_ACTIONS = defaultNavigation.dynamicIslandActions;

// 6. Header அவதார் மெனு
export const AVATAR_DROPDOWN_MENU = defaultNavigation.avatarDropdownMenu;
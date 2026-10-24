// src/App.jsx
import React, { useState } from 'react';
import { useWeatherEngine } from './hooks/useWeatherEngine';
import { DEFAULT_CAMPUSES, INITIAL_USER_PROFILE } from './constants/churchDefaults';

// Common Components
import ParticleCanvas from './components/common/ParticleCanvas';
import TickerNotice from './components/common/TickerNotice';

// Layout Components
import MobileHeader from './components/layout/MobileHeader';
import DynamicIslandDock from './components/layout/DynamicIslandDock';
import UserDropdownMenu from './components/layout/UserDropdownMenu';
import NavSubPopups from './components/layout/NavSubPopups';

// Modals
import MemberProfileModal from './components/modals/MemberProfileModal';
import QuickAttendanceModal from './components/modals/QuickAttendanceModal';
import FinanceEntryModal from './components/modals/FinanceEntryModal';
import SettingsModal from './components/modals/SettingsModal';

// Pages
import OverviewTab from './pages/1_Overview/OverviewTab';
import MembersPage from './pages/2_People/MembersPage';
import VisitorsPage from './pages/2_People/VisitorsPage';
import MinistriesPage from './pages/2_People/MinistriesPage';
import FinancePage from './pages/3_ChurchLife/FinancePage';
import EventsPage from './pages/3_ChurchLife/EventsPage';
import ServicePlansPage from './pages/3_ChurchLife/ServicePlansPage';
import LiveStreamPage from './pages/4_Connect/LiveStreamPage';
import BroadcastPage from './pages/4_Connect/BroadcastPage';
import PrayerWallPage from './pages/4_Connect/PrayerWallPage';
import BiblePage from './pages/4_Connect/BiblePage';

export default function App() {
  const {
    isLiveAdaptive,
    setIsLiveAdaptive,
    activeThemeKey,
    setActiveThemeKey,
    currentTheme,
    isSyncingWeather,
    refreshWeather
  } = useWeatherEngine();

  // Navigation & Sub-Menu States
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);

  // Dropdown States
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);

  // Modals States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // App Data States
  const [branches] = useState(DEFAULT_CAMPUSES);
  const [selectedBranch, setSelectedBranch] = useState(DEFAULT_CAMPUSES[0]);
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [financeType, setFinanceType] = useState('income');
  const [liveCheckins, setLiveCheckins] = useState(128);

  // Dynamic Island Action Handler
  const handleTriggerAction = (actionId) => {
    if (actionId === 'action_checkin') {
      setIsAttendanceModalOpen(true);
    } else if (actionId === 'action_tithe') {
      setFinanceType('income');
      setIsFinanceModalOpen(true);
    } else if (actionId === 'action_add_member') {
      setIsMemberModalOpen(true);
    } else if (actionId === 'action_service_flow') {
      alert('Sunday Stage Service Flow opened');
    }
  };

  // Avatar Menu Action Handler
  const handleAvatarMenuAction = (actionId) => {
    if (actionId === 'profile') {
      setIsMemberModalOpen(true);
    } else if (actionId === 'settings') {
      setIsSettingsModalOpen(true);
    } else if (actionId === 'reports') {
      alert('Opening Full Church Audit Reports...');
    } else if (actionId === 'help') {
      alert('GraceOS Mobile Helpdesk opened');
    } else if (actionId === 'signout') {
      if (window.confirm('Are you sure you want to sign out?')) {
        alert('Signed out successfully');
      }
    }
  };

  return (
    <div 
      className="min-h-screen pb-36 relative overflow-x-hidden font-sans transition-all duration-1000 select-none"
      style={{
        backgroundImage: currentTheme.bgGrad,
        backgroundAttachment: 'fixed',
        color: currentTheme.textMain
      }}
    >
      {/* 1. Background Particle Engine */}
      <ParticleCanvas particleType={currentTheme.particleType} />

      {/* 2. Top Header Bar (With Dropdown for Branches) */}
      <MobileHeader 
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        isBranchMenuOpen={isBranchMenuOpen}
        setIsBranchMenuOpen={setIsBranchMenuOpen}
        theme={currentTheme}
        userProfile={userProfile}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
      />

      {/* 3. Avatar Dropdown Menu */}
      <UserDropdownMenu 
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        userProfile={userProfile}
        selectedBranch={selectedBranch}
        theme={currentTheme}
        onSelectAction={handleAvatarMenuAction}
      />

      {/* 4. Marquee Notice Ticker */}
      <TickerNotice theme={currentTheme} />

      {/* 5. Main Content Area */}
      <main className="relative z-10 max-w-lg mx-auto px-5 pt-4 space-y-4">
        {activeTab === 'home' && (
          <OverviewTab 
            theme={currentTheme}
            userProfile={userProfile}
            liveCheckins={liveCheckins}
            onOpenAttendance={() => setIsAttendanceModalOpen(true)}
            onOpenMembers={() => setActiveTab('members')}
            onOpenFinance={() => {
              setFinanceType('income');
              setIsFinanceModalOpen(true);
            }}
          />
        )}

        {/* People Sub-pages */}
        {activeTab === 'members' && (
          <MembersPage 
            theme={currentTheme} 
            onAddNewMember={() => setIsMemberModalOpen(true)} 
            onSelectMember={(m) => {
              setUserProfile({ ...userProfile, name: m.name, phone: m.phone, role: m.role });
              setIsMemberModalOpen(true);
            }}
          />
        )}

        {activeTab === 'visitors' && (
          <VisitorsPage theme={currentTheme} />
        )}

        {activeTab === 'ministries' && (
          <MinistriesPage theme={currentTheme} />
        )}
      </main>

      {/* Church Life Sub-pages */}
        {activeTab === 'finance' && (
          <FinancePage 
            theme={currentTheme}
            onRecordTransaction={(type) => {
              setFinanceType(type);
              setIsFinanceModalOpen(true);
            }}
          />
        )}

        {activeTab === 'events' && (
          <EventsPage theme={currentTheme} />
        )}

        {activeTab === 'service_plans' && (
          <ServicePlansPage theme={currentTheme} />
        )}
        {/* Connect Sub-pages */}
        {activeTab === 'livestream' && <LiveStreamPage theme="{currentTheme}"/>}
        {activeTab === 'broadcast' && <BroadcastPage theme="{currentTheme}"/>}
        {activeTab === 'prayer' && <PrayerWallPage theme="{currentTheme}"/>}
        {activeTab === 'bible' && <BiblePage theme="{currentTheme}"/>}

      {/* 6. Sub-Menu Popup (People, Church, Connect) */}
      <NavSubPopups 
  activeSubMenu={activeSubMenu}
  onClose={() => setActiveSubMenu(null)}
  onSelectSubItem={(subId) => {
    setActiveTab(subId);
    setActiveSubMenu(null);
  }}
  theme={currentTheme}
/>

      {/* 7. Bottom Navigation & Dynamic Island Dock */}
      <DynamicIslandDock 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
        isIslandExpanded={isIslandExpanded}
        setIsIslandExpanded={setIsIslandExpanded}
        onTriggerAction={handleTriggerAction}
        theme={currentTheme}
      />

      {/* 8. Modals */}
      <MemberProfileModal 
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        profileForm={userProfile}
        setProfileForm={setUserProfile}
        theme={currentTheme}
      />

      <QuickAttendanceModal 
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onMarkAttendance={() => setLiveCheckins(prev => prev + 1)}
        theme={currentTheme}
      />

      <FinanceEntryModal 
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        initialType={financeType}
        onAddTransaction={(tx) => alert(`Recorded: ${tx.title} (${tx.amount})`)}
        theme={currentTheme}
      />

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isLiveAdaptive={isLiveAdaptive}
        setIsLiveAdaptive={setIsLiveAdaptive}
        activeThemeKey={activeThemeKey}
        setActiveThemeKey={setActiveThemeKey}
        isSyncingWeather={isSyncingWeather}
        refreshWeather={refreshWeather}
        theme={currentTheme}
      />

    </div>
);
}